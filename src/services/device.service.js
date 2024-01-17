//import authHeader from './auth-header';
import axios from "axios";


const API_URL_DEVICE = "http://localhost:8082/device/";
import authHeader from './auth-header';

class DeviceService {

  getDeviceData(id){
    return axios.get(API_URL_DEVICE + 'getDeviceById', {  
      params: {
       id: id
      },
      headers: authHeader()
     });
  }
}

export default new DeviceService();