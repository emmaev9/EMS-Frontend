<template>
  <br>
  <br>
  <br>
  <div class="chat-container">
    <aside class="users-panel">
      <h3>Users</h3>
      <ul class="user-list">
        <li v-for="user in this.otherUsers" :key="user.id" @click="this.getMessagesOfSelectUser(user)">
           <!-- Use unreadMessagesMap to check for unread messages -->
          <!--<span class="status-indicator" v-if="unreadMessagesMap[user.id]"></span> -->
          <img :src="this.avatar" :alt="user.name" class="user-avatar" />
          {{ user.name }}
        </li>
      </ul>
      <hr>
      <div class="current-user">
        {{ this.currentUser.name }}
      </div>
    </aside>
    <section class="chat-panel">
      <div class="chat-header">
        <img :src="this.avatar" class="user-avatar" />
        {{ selectedUser ? selectedUser.name : 'Select a user' }}
      </div>
      <div class="chat-history">
        <div class="message" v-for="message in this.messages" :key="message.id" :class="{'mine': this.isMessageMine(message), 'theirs': !this.isMessageMine(message)}">
          <div class="message-content">
            {{ message.content }}
          </div>
          <div class="message-status" v-if="this.isMessageMine(message) && message.seen">
             Seen
          </div>
        </div>
        <div class="typing-indicator" v-if="this.messageTyping.typing">
          Typing...
        </div> 
      </div>
      <div class="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          v-model="this.newMessage"
          @keyup.enter="this.sendMessage"
          @input="this.handleTyping"
        />
        <button @click="this.sendMessage">Send</button>
        
      </div>
    </section>
  </div>
</template>

<script>
import ChatService from "../services/chat.service.js";
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import authHeader from "../services/auth-header.js"

//import Vue from 'vue';
export default {
  data() {
    return {
      avatar: require('@/assets/avatar.png'),
      users: [],
      messages: [],
      selectedUser: "",
      newMessage: "",
      isTyping: false,
      messageTyping: {
        typing: false,
        recipientId: null,
        senderId: null
      },
    }
  },
  methods: {
    createSimpleUserObject(user) {
      return {
        id: user.id,
        name: user.name,
        address: user.address,
        email: user.email,
        age: user.age,
        password: user.password,
        role: user.role,
      };
    },
    getMessagesOfSelectUser(user){
      console.log("Selected user: " + user.name);
      this.selectedUser = user;
      ChatService.getUserMessages(this.currentUser.id, user.id).then(
        (response) => {
          console.log("Messages: " + response.data);
          this.messages = response.data;
          this.$nextTick(() => {
              this.markMessagesAsRead(this.messages);
          });
          //this.updateUnreadMessagesIndicator();
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
  

    isMessageMine(message) {
      return message.senderId === this.currentUser.id;
    },

    markMessagesAsRead(messages){
      if (this.stompClient && this.stompClient.connected) {
        messages.forEach (message => {
          if (!message.seen && message.senderId !== this.currentUser.id) {
            //
           // this.onMessageSeen(message);
            const messagePayload = JSON.stringify({ messageId: message.id });
             this.stompClient.send("/app/markSeen", messagePayload, {});
          }
        })
        console.log("Messages are all seen!!!!");
      }
    },
    onMessageSeen(message) {
      console.log("MESSAGE SEEN" + message.body);
      if (!message || !message.body) {
        console.error('Invalid or empty message received in onMessageSeen');
        return;
      }
      try {
        let seenUpdate = JSON.parse(message.body);
        let updatedMessageIndex = this.messages.findIndex(m => m.id === seenUpdate.messageId);
        
        if (updatedMessageIndex !== -1) {
            this.messages[updatedMessageIndex].seen = true;
            this.$forceUpdate(); // To ensure Vue updates the UI
        }
      } catch (error) {
          console.error('Error parsing JSON data in onMessageSeen:', error);
      }
    },
    hasUnreadMessages(user) {
      /*if (this.selectedUser && this.selectedUser.id === user.id) {
          return false;
      }*/
      // Check for unread messages from this user
      return this.messages.some(message => message.senderId === user.id && !message.seen && message.recipientId === this.currentUser.id);
    },

    sendMessage() {
      const message = {
        senderId: this.currentUser.id,
        recipientId: this.selectedUser.id,
        content: this.newMessage,
        timestamp: new Date(),
        seen: false
      };
      this.isTyping = true;

      this.messages.push(message);
      this.newMessage = '';
      console.log("Message to be sent: " + message.content);

      if (this.stompClient && this.stompClient.connected) {
        const JSONmessage = JSON.stringify(message);
        this.stompClient.send("/app/chat", JSONmessage, {});
        console.log("Message sent");
      }
    },
    getOnlineUsers(){
      ChatService.getConnectedUsers().then(
        (response) => {
          console.log(response.data);
          this.users = response.data;
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },
    getMessages(){
      ChatService.getMessages().then(
        (response) => {
          console.log(response.data);
          this.messages = response.data;
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      );
    },

    handleTyping(){
      // Dacă mesajul este gol, utilizatorul nu mai scrie
      this.isTyping = !!this.newMessage.trim();
      if(this.stompClient && this.stompClient.connected){
        const typingPayoad = JSON.stringify({ 
          senderId: this.currentUser.id, 
          recipientId: this.selectedUser.id, 
          typing: this.isTyping 
        });
        this.stompClient.send("/app/typing", typingPayoad, {});
      }
    },

    onTypingReceived(message) {
      console.log("TYPING RECIVED" + message.body);
      if (!message || !message.body) {
        console.error('Invalid or empty message received in onTypingReceived');
        return;
      }
      try {
        this.messageTyping = message.body;
        
      } catch (error) {
          console.error('Error parsing JSON data in onTypingReceived:', error);
      }
    },

   
    connect() {
      const vm = this; // Bind `this` to `vm`
      
      const socket = new SockJS('http://localhost:8089/ws'); // URL of your WebSocket endpoint
      vm.stompClient = Stomp.over(socket);
      const headers = authHeader(); // Get the auth headers

      this.stompClient.connect(headers, frame => {  
        console.log('Connected: ' + frame);
        console.log('/user/' + vm.currentUser.id + '/queue/messages');
   
           // Subscribe to personal message queue
        this.stompClient.subscribe('/user/' + this.currentUser.id + '/queue/messages', this.onDirectMessageReceived);

        // Subscribe to general topic for broadcast messages
        this.stompClient.subscribe('/user/'+ this.currentUser.id + '/topic', this.onTopicMessageReceived);

        // Subscribe to message seen updates
        this.stompClient.subscribe('/topic/messageSeen', this.onMessageSeen);

        //Subscribe to typing updates
        this.stompClient.subscribe('/topic/typing', this.onTypingReceived);
        
        

        const simpleUser = vm.createSimpleUserObject(vm.currentUser);
        this.connectUser(simpleUser);
        this.getOnlineUsers();

      }, error => {
        console.error('Error connecting:', error);
      
      });
    },
    disconnectUser(user) {
      if (this.stompClient && this.stompClient.connected) {
        const message = JSON.stringify(user);
        this.stompClient.send("/app/user.disconnectUser", message, {});
        console.log("User disconnected");
      }
    },
    connectUser(user) {
      if (this.stompClient && this.stompClient.connected) {
        const message = JSON.stringify(user);
        this.stompClient.send("/app/user.connectUser", message, {});
        console.log("User connected");
      }
    }, 
    // Handle incoming direct messages
    onDirectMessageReceived(message) {
        let receivedMessage = JSON.parse(message.body);
       
        if (this.selectedUser && receivedMessage.senderId === this.selectedUser.id && !receivedMessage.seen) {
          this.messages.push(receivedMessage);
          this.markMessagesAsRead([receivedMessage]);
        }

    },

    // Handle incoming messages from the topic
    onTopicMessageReceived(message) {
      let receivedMessage = JSON.parse(message.body);
      if (this.selectedUser && receivedMessage.senderId === this.selectedUser.id && !receivedMessage.seen) {
            // If the message is from the currently selected user, add it to the chat
            this.messages.push(receivedMessage);
            if(!receivedMessage.seen){
              this.markMessagesAsRead([receivedMessage]);
            }
        } 

     },
    },
  computed: {
   currentUser() {
      return JSON.parse(localStorage.getItem("user"));
   },
   otherUsers(){
      return this.users.filter(user => user.id !== this.currentUser.id);
   },
   
  },
 
  mounted() {
    this.connect();
    this.getOnlineUsers();
  },

  beforeUnmount() {
    if (this.stompClient && this.stompClient.connected) {
      const simpleUser = this.createSimpleUserObject(this.currentUser);
      this.disconnectUser(simpleUser);
      this.stompClient.disconnect();
    }
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  max-width: 800px;
  min-height: 600px;
  margin: 40px auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.users-panel {
  flex: 1;
  background-color: #4e4e53;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.user-list {
  list-style: none;
  padding: 0;
  margin-top: 20px;
}

.user-list li {
  padding: 10px 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.user-list li:hover, .user-list li.active-user {
  background-color: #787878;
}

.chat-panel {
  flex: 3;
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-history {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

.message {
  margin: 10px 0;
  display: flex;
}

.mine {
  justify-content: flex-end;
}

.theirs {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 10px;
  border-radius: 18px;
  background: #4e4e53;
  word-wrap: break-word;
}

.mine .message-content {
  background: #157887;
}

.chat-input {
  display: flex;
  padding: 20px;
  background: #8c8c8d;
  border-top: 1px solid #eaebed;
}

.chat-input input {
  flex-grow: 1;
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #eaebed;
  border-radius: 4px;
}

.chat-input button {
  padding: 10px 20px;
  background-color: #5eb4be;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-input button:hover {
  background-color: #157887;
}
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}
.current-user {
  padding: 10px 0;
  display: flex;
  color: white;
  align-items: center;
  background-color: #4e4e53; /* Different background to indicate non-interactivity */
  margin-top: auto; /* Push to the bottom */
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgb(2, 206, 182);
  margin-right: 5px;
}
.status-indicator.online {
  background-color: green;
}
.chat-header {
  padding: 10px 20px;
  background-color: #8c8c8d;
  color: white;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #333;

}
.message-status {
  font-size: 0.7em;
  color: #777676;
  text-align: right;
  margin-top: 7px;
}

.typing-indicator {
  color: #777676;
  font-size: 0.8em;
  margin-top: 7px;
}

</style>
```