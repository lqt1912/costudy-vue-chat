import getters from './getters';
import actions from './actions';
import muations from './muations';

export default {
  namespaced: true,
  state() {
    return {
      currentConversationId: ''
    };
  },
  mutations: muations,
  getters: getters,
  actions: actions
};
