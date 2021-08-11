<template>
  <li
    :class="{ 'align-right': isSender, 'justify-content-end': isSender }"
    style="border: none"
    class="row d-flex"
  >
    <div
      v-if="messageType === 0"
      v-on:click="toggleCreatedDate()"
      class="message"
      style="margin: 2px"
      :class="{
        'guest-message': !isSender,
        'message-sender': isSender,
        'message-client': !isSender,
        'not-border-top-left': borderType && !isSender,
        'not-border-top-right': borderType && isSender,
      }"
    >
      <!-- Message content -->
      <pre>  {{ message[0] }}</pre>
    </div>

    <div
      class="message"
      v-if="messageType === 3"
      :class="{
        'guest-message': !isSender,
        'message-sender': isSender,
        'message-client': !isSender,
        'not-border-top-left': borderType && !isSender,
        'not-border-top-right': borderType && isSender,
      }"
    >

      <h5>{{ message.author_name }}</h5>
      <p>{{ message.title }}...</p>

    </div>

    <div
      v-else-if="messageType === 1"
      v-for="msg in message"
      :key="msg.oid"
      
    >
    <div v-on:click="sendUrl(msg.image_hash)">
      <img
        style="max-width: 150px; max-height: 150px"
        :src="msg.image_hash"
        class="m-1 image-border"
        alt=""
      />
    </div>
     
    </div>

    <br />
    <transition name="fade">
      <p class="col-12 created-date" v-if="isShowDate">
        {{ convertedDate(createdDate) }}
      </p>
    </transition>
  </li>
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      isShowDate: false,
    };
  },
  props: [
    'message',
    'sender',
    'isSender',
    'createdDate',
    'messageType',
    'index',
    'borderType',
  ],

  computed: {},
  methods: {
    sendUrl(data){
      this.$emit('setImageModal',data);
    },
    convertedDate(date) {
      const convertedDate = moment(date);
      const currentDate = moment();
      let distance = Math.floor(currentDate.diff(convertedDate) / (1000 * 60));
      if (distance === 0) return 'Vừa xong';
      else if (distance <= 60) return `${distance} phút trước`;
      distance = Math.floor(distance / 60);
      if (distance < 23) return `${distance} giờ trước`;
      distance = Math.floor(distance / 24);
      if (distance < 7) return `${distance} ngày trước`;
      else return convertedDate.format('DD-MM-YYYY');
    },
    toggleCreatedDate() {
      this.isShowDate = !this.isShowDate;
    },
  },
  updated() {
    if (this.index === 0) {
      document.querySelector('pre').innerText = 'C';
    }
  },
};
</script>

<style scoped>
.not-border-top-left {
  border-top-left-radius: 0px !important;
}
.not-border-top-right {
  border-top-right-radius: 0px !important;
}

.message {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 20px;
  padding-left: 20px;
  border-radius: 20px;
  background-color: #c1d5f5;
  max-width: 450px;
}
.message-sender {
  border-bottom-right-radius: 5px;
}

.message-client {
  border-bottom-left-radius: 5px;
}
.align-right {
  text-align: right;
}
li {
  margin: 1rem 0;
  border: 1px solid #ccc;
  padding: 1rem;
}

h3 {
  margin: 0.5rem 0;
}

.role {
  border-radius: 40px;
  background-color: #ccc;
  color: #252525;
  padding: 0.25rem 1rem;
  display: inline-block;
}

.role--engineer {
  background-color: blue;
  color: white;
}

.role--consultant {
  background-color: #af003a;
  color: white;
}

.guest-message {
  background-color: #4aa1a1;
  color: white;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.created-date {
  font-size: 10px;
}
pre {
  overflow: hidden;
  font-family: inherit;
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word;
  /* Internet Explorer 5.5+ */
  margin-bottom: 0px;
}

.image-border {
  border: 1px solid gray;
  border-radius: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 10px;
}
</style>
