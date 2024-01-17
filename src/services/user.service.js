import axios from 'axios';
import authHeader from './auth-header';

const API_URL_ADMIN = 'http://localhost:8080/admin/';
const API_URL_CLIENT = 'http://localhost:8080/person/';

class UserService {
  getAdminHome() {
    return axios.get(API_URL_ADMIN + 'adminHome', { headers: authHeader() });
  }

  getClientHome() {
    return axios.get(API_URL_CLIENT + 'personHome', { headers: authHeader() });
  }
 
}

export default new UserService();