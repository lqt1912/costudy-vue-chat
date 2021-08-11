import { createStore } from 'vuex';
import conversationModule from './modules/activeConversation/index'

const store =createStore({
    modules:{
        conversation: conversationModule
    }
})
export default store;