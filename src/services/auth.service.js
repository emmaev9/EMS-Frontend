import axios from 'axios';

//const API_URL = 'http://localhost:8080/auth/';
//const API_URL_CLIENT = 'http://localhost:8080/person/';
//const API_URL_ADMIN = 'http://localhost:8080/admin/';


class AuthService {
  login(user) {
    console.log(user)
    return axios
      .post('http://localhost:8080/auth/login', {
        email: user.email,
        password: user.password
      })
      .then(response => {
        console.log(response.data)
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }
}
export default new AuthService();