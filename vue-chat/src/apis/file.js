import constants from '../constants/constants';
import axios from 'axios';

export default {
  uploadFile(data) {
    const promise = axios.post(`${constants.API_URL}/File/file-upload`, data);
    const dataPromise = promise.then(response => {
      return response;
    });
    return dataPromise;
  }
};
