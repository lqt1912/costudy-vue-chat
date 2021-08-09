<template>
  <router-view></router-view>
  <ul>
    <teams-item
      v-for="conversation in conversations"
      :key="conversation.conversation.oid"
      :oid="conversation.conversation.oid"
      :name="getUserName(conversation)"
      :message="getLatestMessage(conversation)"
    ></teams-item>
  </ul>

  <button v-on:click="getListConversation()">Test</button>
</template>

<script>
import TeamsItem from './TeamsItem.vue';
import conversation from '../../apis/conversation';

export default {
  data() {
    return {
      conversations: null,
    };
  },
  components: {
    TeamsItem,
  },
  inject: ['teams'],
  methods: {
    getListConversation() {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser === null) return 'Có lỗi xảy ra';

      conversation
        .getListConversation()
        .then((response) => {
          console.log(response.data.result.conversations);
          this.conversations = response.data.result.conversations;
          localStorage.setItem('conversations', JSON.stringify(this.conversations));
          console.log(this.conversations);
        })
        .catch((err) => console.log(err));
    },
    getUserName(conversation) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      console.log(currentUser);
      if (
        conversation.conversation.participants[0].member_id != currentUser.oid
      ) {
        return conversation.conversation.participants[0].member_name;
      } else {
        return conversation.conversation.participants[1].member_name;
      }
    },
    getLatestMessage(conversation) {
      var msg = conversation.messages[0].content[0];
      return msg;
    },
  },
  mounted() {
    this.getListConversation();
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 2rem auto;
  max-width: 40rem;
  padding: 0;
}
</style>