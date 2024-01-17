import axios from "axios";

const API_URL_CLIENT = "http://localhost:8080/person/";
const API_URL_DEVICE = "http://localhost:8082/device/";
const API_URL_MAPPING = "http://localhost:8082/mapping/";

import authHeader from './auth-header';
class AdminService {

  //client requests
  deleteClient(id){
    console.log("Client id to delete: " + id);
    return axios.delete(`${API_URL_CLIENT}${id}`, { headers: authHeader() });
  }

  getClient(id){
    return axios.get(`${API_URL_CLIENT}${id}`, { headers: authHeader() });
  }

  updateClient(client){

    console.log("Sunt in updateClient");
    console.log(client);
    return axios.put(API_URL_CLIENT,client, { headers: authHeader() });
  }

  getAllClients(){
    return axios.get(API_URL_CLIENT + 'getAllClients',{ headers: authHeader() });
  }
  registerClient(client){
    return axios.post(API_URL_CLIENT, client, { headers: authHeader() });
  }

  //device requests
  deleteDevice(id){
    console.log("Device id to delete: " + id);
    return axios.delete(`${API_URL_DEVICE}${id}`, { headers: authHeader() });
  }

  getDevice(id){
    return axios.get(`${API_URL_DEVICE}${id}`, { headers: authHeader() });
  }

  updateDevice(device){

    console.log("Sunt in updateDevice");
    console.log(device);
    return axios.put(API_URL_DEVICE,device, { headers: authHeader() });
  }

  getAllDevices(){
    return axios.get(API_URL_DEVICE,{ headers: authHeader() });
  }
  registerDevice(device){
    return axios.post(API_URL_DEVICE, device, { headers: authHeader() });
  }

  //mapping requests
  createMapping(mapping){
    return axios.post(API_URL_MAPPING + 'createMapping', mapping, { headers: authHeader() });
  }
  deleteMapping(id){
    console.log("Mapping id to delete: " + id);
    return axios.delete(`${API_URL_MAPPING}deleteMapping/${id}`, { headers: authHeader() });
  }

  getAllMappings(){
    return axios.get(API_URL_MAPPING + 'getAllMappings',{ headers: authHeader() });
  }

  getDevicesForUser(id){
    return axios.get(`${API_URL_DEVICE}getDevicesForUser/${id}`, { headers: authHeader() });
  }
  updateSelectedMapping(id, device_id){
    return axios.put(`${API_URL_MAPPING}updateUserDevice/${id}/${device_id}`, { headers: authHeader() });
  }

}

export default new AdminService();