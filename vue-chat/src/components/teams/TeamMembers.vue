<template>
  <section style="background-color: gray">
    <h2>{{receiverName}}</h2>
    <ul class="chat-box scrollable" ref="msgContainer" id="msgContainer">
      <li>
        <div class="text-center" v-on:click="loadTeamMembers(teamId)">
          Load More
        </div>
      </li>

      <transition-group name="list-messages">
        <user-item
          v-for="(message, index) in messages"
          :key="message"
          :message="message.content"
          :sender="message.sender_name"
          :isSender="isSender(message)"
          :messageType="message.message_type"
          :createdDate="message.modified_date"
          :index="index"
          :borderType="isNotBorder(message)"
          class="single-message pt-0 pb-0 mt-0 mb-0"
          :class="{ 'mb-3': index === currentSkip - 1 }"
        ></user-item>
      </transition-group>
    </ul>
    <div
      class="
        form-group
        mt-1
        p-1
        mb-0
        row
        d-flex
        justify-content-between
        add-message-box
      "
    >
      <textarea
        autocomplete="off"
        style="
          border-radius: 100px;
          height: 36px;
          overflow: hidden;
          resize: none;
        "
        type="text"
        class="form-control"
        id="formGroupExampleInput2"
        placeholder="Nhập tin nhắn"
        v-model="message"
        rows="5"
        :class="{ 'w-90': message.length > 0 }"
      ></textarea>

      <button
        v-if="message.length > 0"
        class="btn w-10 btn-send"
        style="border: none"
        v-on:click="sendMessage()"
      >
        <font-awesome-icon icon="paper-plane" v-if="!isTyping" />
      </button>
    </div>
  </section>
</template>

<script>
import conversation from '../../apis/conversation';
import UserItem from '../users/UserItem.vue';
import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import signalr from '../../utils/signalr';

export default {
  inject: ['users', 'teams'],

  components: {
    UserItem,
  },
  props: ['teamId'],
  data() {
    return {
      messages: [],
      currentSkip: 0,
      message: '',
      isViewOldMessage: false,
      isTyping: false,
    };
  },
  computed: {
    receiverName() {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const conversation = JSON.parse(localStorage.getItem('conversations'));
console.log(conversation);
      const cvs = conversation.find(x=>x.conversation.oid == this.teamId);
      console.log(cvs);
      const name = cvs.conversation.participants.find(x=>x.member_id != currentUser.oid).member_name;
      return name;
    },
  },
  methods: {
    isNotBorder(message) {
      const currentMessageIndex = this.messages.indexOf(message);
      const currentMessage = message;
      const messageBefore = this.messages[currentMessageIndex - 1];
      const messageAfter = this.messages[currentMessageIndex + 1];
      if (messageBefore != null && messageAfter != null) {
        if (
          currentMessage.sender_id === messageBefore.sender_id &&
          currentMessage.sender_id === messageAfter.sender_id
        ) {
          return true;
        }
      }
      return false;
    },
    toggleTyping(isTyping) {
      this.isTyping = isTyping;
    },

    loadTeamMembers(teamId) {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser === null) return 'Có lỗi xảy ra';
      conversation
        .getMessageByConversationId(teamId, this.currentSkip, 15)
        .then((response) => {
          this.messages = response.data.result.concat(this.messages);
          this.currentSkip = this.currentSkip + 15;
        })
        .catch((error) => console.log(error));
    },
    isSender(message) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      return message.sender_id === currentUser.oid;
    },
    sendMessage() {
      if (this.message === '') alert('Vui lòng nhập tin nhắn. ');
      else {
        var messageToSend = {
          conversation_id: this.teamId,
          message_type: 0,
          content: [this.message],
        };
        conversation
          .sendMessage(messageToSend)
          .then((response) => {
            console.log(response);
            this.messages.push(response.data.result);

            this.message = '';
            const connection = new HubConnectionBuilder()
              .withUrl('https://localhost:44356/messagehub')
              .configureLogging(LogLevel.Information)
              .build();

            connection
              .start()
              .then(() => {
                connection
                  .invoke('SendMessage', this.teamId, response.data.result)
                  .then(() => {
                    console.log('Sent! ');
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((err) => console.log(err));
          })
          .catch((error) => console.log(error));
      }
    },
    receiveMessage(user, message) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      if (user === this.teamId && currentUser.oid != message.sender_id) {
        this.messages.push(message);
      }
      const items = document.querySelectorAll('.single-message');
      const last = items[items.length - 1];
      last.scrollIntoView();
    },
  },
  created() {
    this.currentSkip = 0;
    this.loadTeamMembers(this.teamId);
  },
  mounted() {
    signalr.listen('ReceiveMessage', this.receiveMessage);
  },
  watch: {
    messages() {
      this.$nextTick(function () {
        const items = document.querySelectorAll('.single-message');
        const last = items[items.length - 1];
        if (this.currentSkip === 15) {
          last.scrollIntoView({ behavior: 'smooth' });
        }
      });
    },
  },
  updated() {
    const items = document.querySelectorAll('.single-message');
    const last = items[items.length - 1];
    last.scrollIntoView({ behavior: 'smooth' });

    document.querySelector('textarea').addEventListener('keyup', function () {
      document.querySelector('pre').innerText = this.value;
    });
  },
};
</script>

<style scoped>
.w-90 {
  width: 90%;
}

.w-10 {
  width: 10%;
}
.chat-box {
  background-color: white;
  max-height: 75vh;
  overflow-y: hidden;
  scroll-behavior: smooth;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.scrollable {
  overflow: hidden;
  overflow-y: scroll;
  height: calc(100vh - 20px);
}
#msgContainer {
  scrollbar-width: none !important;
}
section {
  margin: 2rem auto;
  max-width: 40rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  border-radius: 12px;
}

h2 {
  margin: 0.5rem 0;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.list-messages-enter-active,
.list-messages-leave-active {
  transition: all 0.5s ease-in-out;
}

.list-messages-enter-from,
.list-messages-leave-to {
  opacity: 0;
  transform: translateY(1px);
}

.add-message-box {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  margin-left: 0px;
  margin-right: 0px;
}

::-webkit-scrollbar {
  width: 0; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
}

.btn-send {
  background-color: GRAY;
  color: white;
}
</style>