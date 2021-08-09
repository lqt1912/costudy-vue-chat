import axios from 'axios';
import constants from '../constants/constants';

export default {
  loginAxios(userName, password) {
    const data = {
      email: userName,
      password: password
    };
    const result = axios
      .post(`${constants.API_URL}/Accounts/login`, data)
      .then(response => {
        return response;
      });

    return result;
  },

  currentUser() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const promise = axios
      .get(`${constants.API_URL}/User/current`, {
        headers: {
          Authorization: currentUser.jwtToken
        }
      })
      .then(response => {
        return response;
      });

    return promise;
  }
};
