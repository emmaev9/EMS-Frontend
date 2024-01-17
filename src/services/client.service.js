//import authHeader from './auth-header';
import axios from "axios";


const API_URL_Client = "http://localhost:8080/person/";
import authHeader from './auth-header';
class ClientService {

  getClientData(id){
    return axios.get(API_URL_Client + 'getClientById', {
      params: {
       id: id
      },
      headers: authHeader()
     });
  }

  deleteAccount(id){
    console.log(id);
    return axios.delete(`${API_URL_Client}${id}`, { headers: authHeader() });
  }

}

export default new ClientService();