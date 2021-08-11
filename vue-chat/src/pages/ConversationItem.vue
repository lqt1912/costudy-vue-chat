 <template >
  <div class="col-6 pl-1">
    <section style="background-color: #2a8383" class="m-0 mt-1">
      <h2 class="m-0 pb-1" style="color: white">{{ receiverName }}</h2>
      <ul class="chat-box scrollable" ref="msgContainer" id="msgContainer">
        <li>
          <div class="text-center" v-on:click="loadConversationItem(teamId)">
            Load More
          </div>
        </li>
        <transition-group name="list-messages">
          <message
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
            @setImageModal="setImageModal"
          ></message>
        </transition-group>
      </ul>
      <div id="image-preview" style="max-height: 100px" class="d-flex">
        <div class="img-wrap" v-for="url in previewUrls" :key="url">
          <span class="close" v-on:click="removeImageFromPreview(url.fileName)"
            ><font-awesome-icon icon="times"
          /></span>
          <img
            :src="url.url"
            style="
              width: 100px;
              height: 100px;
              object-fit: fill;
              border-radius: 20px;
            "
            class="p-2"
            alt=""
          />
        </div>
      </div>
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
        <button
          v-if="!(message.length > 0)"
          class="btn btn-send w-10"
          v-on:click="handleSelectFile()"
        >
          <font-awesome-icon icon="images" />
        </button>
        <textarea
          autocomplete="off"
          style="
            border-radius: 100px;
            height: 36px;
            overflow: hidden;
            resize: none;
          "
          type="text"
          class="form-control w-90"
          id="formGroupExampleInput2"
          placeholder="Nhập tin nhắn"
          v-model="message"
          rows="5"
          :class="{
            'w-90': message.length > 0,
            'w-80': message.length === 0 && actualFileLength > 0,
          }"
        ></textarea>

        <button
          v-if="message.length > 0 && actualFileLength === 0"
          class="btn w-10 btn-send"
          style="border: none"
          v-on:click="sendMessage()"
        >
          <font-awesome-icon icon="paper-plane" />
        </button>

        <button
          v-else-if="message.length === 0 && actualFileLength > 0"
          class="btn w-10 btn-send"
          style="border: none"
          v-on:click="submitFile()"
        >
          <font-awesome-icon icon="paper-plane" />
        </button>

        <button
          v-else-if="message.length > 0 && actualFileLength > 0"
          class="btn w-10 btn-send"
          style="border: none"
          v-on:click="submitFile()"
        >
          <font-awesome-icon icon="paper-plane" />
        </button>
      </div>
    </section>
    <div class="container d-none">
      <div class="large-12 medium-12 small-12 cell">
        <label
          >File
          <input
            type="file"
            id="file"
            ref="file"
            multiple
            v-on:change="handleFileUpload()"
          />
        </label>
        <button v-on:click="submitFile()">Submit</button>
      </div>
    </div>
  </div>
  <ImageList :imageUrls="imageMessages.imageUrls"> </ImageList>

  <modal
    style="width: 100%; height: 100%"
    v-if="showModal"
    @closeModal="showModal = false"
    :imageUrl="currentImage"
  >
  </modal>
</template>

<script>
import conversation from '../apis/conversation';
import Message from '../components/users/Message.vue';
import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import signalr from '../utils/signalr';
import file from '../apis/file';
import { mapActions, mapGetters } from 'vuex';
import modal from '../components/modals/modal.vue';
import ImageList from '../components/users/ImageList.vue';
export default {
  components: {
    Message,
    modal,
    ImageList,
  },
  props: ['teamId'],
  data() {
    return {
      messages: [],
      currentSkip: 0,
      message: '',
      isViewOldMessage: false,
      isTyping: false,
      files: [],
      fileUrls: [],
      previewUrls: [],
      showModal: false,
      currentImage: '',
      imageMessages: {
        currentSkip: 0,
        images: [],
        imageUrls: [],
      },
    };
  },
  computed: {
    actualFileLength() {
      let count = 0;
      for (let i = 0; i < this.files.length; i++) {
        const exist = this.previewUrls.find(
          (x) => x.fileName === this.files[i].name
        );
        if (exist != null) {
          count++;
        }
      }
      return count;
    },
    receiverName() {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const conversation = JSON.parse(localStorage.getItem('conversations'));
      console.log(conversation);
      const cvs = conversation.find((x) => x.conversation.oid == this.teamId);
      console.log(cvs);
      const name = cvs.conversation.participants.find(
        (x) => x.member_id != currentUser.oid
      ).member_name;
      return name;
    },
    ...mapGetters('conversation', ['get']),
  },
  methods: {
    getImages(teamId) {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (currentUser === null) return 'Có lỗi xảy ra';
      conversation
        .getImagesByConversationId(teamId, this.imageMessages.currentSkip, 3)
        .then((response) => {
          this.imageMessages.images.push(response.data.result);
          this.imageMessages.currentSkip += 3;

          for (let i = 0; i < response.data.result.length; i++) {
            this.imageMessages.imageUrls = this.imageMessages.imageUrls.concat(
              response.data.result[i].content
            );
          }
        })
        .catch((error) => console.log(error));
    },
    ...mapActions('conversation', ['set']),

    setImageModal(data) {
      this.currentImage = data;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    removeImageFromPreview(fileName) {
      debugger;
      const file = this.previewUrls.find((x) => x.fileName === fileName);
      const index = this.previewUrls.indexOf(file);
      this.previewUrls.splice(index, 1);
    },
    handleSelectFile() {
      document.getElementById('file').click();
    },
    handleFileUpload() {
      this.files = this.$refs.file.files;
      this.previewUrls = [];
      for (let i = 0; i < this.$refs.file.files.length; i++) {
        const data = {
          fileName: this.$refs.file.files[i].name,
          url: URL.createObjectURL(this.$refs.file.files[i]),
        };
        this.previewUrls.push(data);
      }
    },
    submitFileAndSendMessage() {
      this.submitFile();
      this.sendMessage();
    },
    submitFile() {
      let formData = new FormData();
      for (let i = 0; i < this.files.length; i++) {
        let isExist = this.previewUrls.find(
          (x) => x.fileName === this.files[i].name
        );
        if (isExist) {
          formData.append('Files', this.files[i], this.files[i].name);
        }
      }

      formData.append('Folder', 'messages');

      file
        .uploadFile(formData)
        .then((response) => {
          //alert('Upload success');
          console.log(response);

          this.fileUrls = response.data.result;

          var messageToSend = {
            conversation_id: this.teamId,
            message_type: 1,
            image: [],
          };

          for (let i = 0; i < response.data.result.length; i++) {
            let element = response.data.result[i];
            messageToSend.image.push({
              image_url: element,
              image_hash: element,
              media_type: 0,
            });
          }

          conversation
            .sendMessage(messageToSend)
            .then((response) => {
              console.log(response);
              this.messages.push(response.data.result);

              this.files = [];
              this.fileUrls = [];
              this.previewUrls = [];

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
          return response.data.result;
        })
        .catch((error) => console.log(error));
    },
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

    loadConversationItem(teamId) {
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
    this.loadConversationItem(this.teamId);
  },
  mounted() {
    signalr.listen('ReceiveMessage', this.receiveMessage);
    this.set(this.teamId);
  },
  watch: {
    messages() {
      this.$nextTick(function () {
        const items = document.querySelectorAll('.single-message');
        const last = items[items.length - 1];
        if (this.currentSkip === 15) {
          last.scrollIntoView({ behavior: 'smooth' });
        }
        this.getImages(this.teamId);
      });
    },
  },
  updated() {
    debugger;
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

.w-80 {
  width: 80%;
}
.chat-box {
  background-color: white;
  max-height: 65vh;
  overflow-y: hidden;
  scroll-behavior: smooth;
  border-radius: 12px;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 1rem;
  border-radius: 5px;
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
  background-color: #2a8383;
  color: white;
}

.img-wrap {
  position: relative;
}
.img-wrap .close {
  position: absolute;
  top: 2px;
  right: 10px;
  z-index: 100;
  background-color: black;
  padding: 5px;
  border-radius: 100px;
  font-size: 1rem;
  padding-left: 7px;
  padding-right: 7px;
  color: white;
}

#imageDetail {
  width: 100%;
  height: 100%;
  background-color: black;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style> */