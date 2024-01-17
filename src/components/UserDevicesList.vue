<template>
  <br>
  <br>
  <div v-if="message" class="alert alert-success">
    {{ message }}
  </div>
  <div  class="container col-14">
    <h2 class="title">Devices</h2>
  </div>

  <br>
  <div v-if="notifications.length" class="notification-container">
    <br>
    <br>
    <div v-for="note in notifications" :key="note.id" class="notification">
      {{ note.message }}
    </div>
  </div> 

  <div class="container col-14">
    <hr style="height:1px;border-width:0;color:gray;background-color:gray">
    <div>
      <table class="table table-striped table-bordered shadow-lg table-sm border-top">
        <thead>
          <tr>
            <th class="bg-danger bg-gradient">ID</th>
            <th class="bg-danger bg-gradient">Description</th>
            <th class="bg-danger bg-gradient">Address</th>
            <th class="bg-danger bg-gradient">Max Energy Consumption</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in devices" :key="item.id">
            <td class="bg-notdanger "> {{ item.id }}</td>
            <td class="bg-notdanger "> {{ item.description }}</td>
            <td class="bg-notdanger "> {{ item.address }}</td>
            <td class="bg-notdanger "> {{ item.maxEnergyConsumption }}</td>
          
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <br>
  <br>
</template>

<script>
import AdminService from "../services/admin.service";
//import { io } from "socket.io-client";
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
export default {
  name: "DevicesList",

  data() {
    return {
      //currentUser: "",
      successful: false,
      loading: false,
      devices: "",
      mappings:"",
      message: "",
      notifications: [], // Array to hold notifications
      notificationId: 0, // Counter for notification IDs
      //socket: null,

    };
  },
  computed: {
   currentUser() {
      return JSON.parse(localStorage.getItem("user"));
   }
  },
  methods: {
    refreshTable() {
   
      console.log("current user id: " + this.currentUser.id);
      AdminService.getDevicesForUser(this.currentUser.id).then(
        (response) => {
          console.log(response.data);
          this.devices = response.data;
        },
        (error) => {
          this.content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }
      )
    },
    addNotification(message) {
      // Add a new notification to the array
      this.notifications.push({ id: this.notificationId++, message: message });
      // Optional: Remove notification after a delay
        /*setTimeout(() => {
          this.notifications.shift();
        }, 30000); // 5 seconds delay*/
    },
    connectToSocket() {
      const vm = this; // Bind `this` to `vm`

      var socket = new SockJS('http://localhost:8085/ws');
      vm.stompClient = Stomp.over(socket); // Use `vm.stompClient`

      vm.stompClient.connect({}, frame => {
        console.log('Connected stoooooooooooomp: ' + frame);

        vm.stompClient.subscribe('/queue/' + vm.currentUser.id + '/specific', message => {
          console.log("in stomp client");
          if (message) {
            console.log("User id from socket: " + message);
            console.log("Current user id: " + vm.currentUser.id);
            vm.addNotification(message.body);
          }
        });
      }, error => {
        console.error('STOMP error:', error);
      });
    }
  },
  mounted() {
    this.connectToSocket();
    // Subscribe to the specific user topic
    /*this.$socket.client.subscribe('/user/' + this.currentUser.id + '/specific', (event) => {
      const message = JSON.parse(event.body);
      this.addNotification(message);
    });*/

  
    this.refreshTable();
  },
  beforeUnmount() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  },

  created(){
    this.refreshTable();
  },
};


</script>
<style>
@import url(../assets/styles/delete_button.css);
@import url(../assets/styles/cancel_button.css);
@import url(../assets/styles/update_button.css);

.title {
  font-family: "Roboto Slab", serif;
  font-style:bold;
  font-stretch: condensed;
  font-size: 30px;
  color:  #006554 !important; 
  text-align: left;
  margin-left: 20px;
  margin-top: 25px;
}
.bg-danger {
  background-color:#a5e1d9 !important;
  color: white;
}
.bg-notdanger {
  background-color:white !important;
  color: black;
}
.notification-container {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1000;
}

.notification {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #f5c6cb;
  border-radius: 3px;
}
</style>