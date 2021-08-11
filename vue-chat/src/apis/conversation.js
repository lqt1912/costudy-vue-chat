import axios from 'axios';
import constants from '../constants/constants';

export default {
  getListConversation() {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const promise = axios.get(`${constants.API_URL}/Conversation/current`, {
      headers: {
        Authorization: currentUser.jwtToken
      }
    });

    const dataPromise = promise.then(response => {
      return response;
    });
    return dataPromise;
  },

  getMessageByConversationId(conversationId, skip, count) {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const promise = axios.get(
      `${constants.API_URL}/Message/message/get/conversation?ConversationId=${conversationId}&skip=${skip}&count=${count}`,
      {
        headers: {
          Authorization: currentUser.jwtToken
        }
      }
    );
    const dataPromise = promise.then(response => {
      return response;
    });
    return dataPromise;
  },

  getImagesByConversationId(conversationId, skip, count) {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const promise = axios.get(
      `${constants.API_URL}/Message/message/image?ConversationId=${conversationId}&skip=${skip}&count=${count}`,
      {
        headers: {
          Authorization: currentUser.jwtToken
        }
      }
    );
    const dataPromise = promise.then(response => {
      return response;
    });
    return dataPromise;
  },

  sendMessage(message) {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const promise = axios.post(
      `${constants.API_URL}/Message/message/add`,
      message,
      {
        headers: {
          Authorization: currentUser.jwtToken
        }
      }
    );

    const dataPromise = promise.then(response => {
      return response;
    });
    return dataPromise;
  }
};
