<template>
  <div class="container-fluid row d-flex">
    <ul class="col-md-3 col-lg-3 col-xl-3 m-0">
      <Conversation
        v-for="conversation in conversations"
        :key="conversation.conversation.oid"
        :oid="conversation.conversation.oid"
        :name="getUserName(conversation).member_name"
        :message="getLatestMessage(conversation)"
        :userAvatar="getUserName(conversation).member_avatar"
        v-on:activeConversation="activeConversationItem()"
        class="conversation-item"
        :class="{ 'custom-active': conversation.conversation.oid === get }"
      ></Conversation>
    </ul>
    <router-view :key="$route.fullPath"> </router-view>
   
  </div>
</template>

<script>
import Conversation from '../components/teams/Conversation.vue';
import conversation from '../apis/conversation';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      conversations: null,
      currentActiveId: '',
    };
  },
  components: {
    Conversation,
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
          localStorage.setItem(
            'conversations',
            JSON.stringify(this.conversations)
          );
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
        return conversation.conversation.participants[0];
      } else {
        return conversation.conversation.participants[1];
      }
    },
    getLatestMessage(conversation) {
      var msg = conversation.messages[0];
      if (msg.message_type === 0) {
        return msg.content[0];
      } else return 'Ảnh';
    },
  },
  mounted() {
    this.getListConversation();
    const defaultChildRoute = JSON.parse(localStorage.getItem('conversations'))[0].conversation.oid;
    this.$router.push(`/conversations/${defaultChildRoute}`);
  },
  computed: {
    test() {
      return 1;
    },
    ...mapGetters('conversation', ['get']),
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
.conversation-item {
  background-color: whitesmoke;
  border-radius: 5px;
  margin: 4px;
}
.custom-active {
  background-color: rgb(204, 195, 195);
}
</style>