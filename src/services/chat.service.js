import axios from "axios";
import authHeader from './auth-header';

class ChatService {

  getConnectedUsers(){
    return axios.get('http://localhost:8089/onlineUsers', { headers: authHeader() });
  }

  getUserMessages(sender, recipient){
    return axios.get('http://localhost:8089/messages/' + sender + '/' + recipient, { headers: authHeader() });
  }
 
}

export default new ChatService();