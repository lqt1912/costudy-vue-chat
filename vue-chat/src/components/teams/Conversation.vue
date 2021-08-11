<template>
  <li class="border">
    <router-link :to="getLink">
      <div class="row d-flex">
        <div class="col-3 p-0">
          <img :src="userAvatar" class="w-100 img-avatar" alt="" />
        </div>
        <div class="col-9">
          <h2>{{ name }}</h2>
          <h4>{{ latestMessage }}</h4>
        </div>
      </div>
    </router-link>
  </li>
</template>

<script>
import signalr from '../../utils/signalr';

export default {
  props: ['oid', 'name', 'message', 'userAvatar'],
  data() {
    return {
      latestMessage: this.message,
    };
  },
  computed: {
    getLink() {
      //return '/teams/'+this.id;
      return {
        name: 'team-members',
        params: {
          teamId: this.oid,
        },
      };
    },
  },
  methods: {
    receiveMessage(user, _message) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      console.log(_message);
      if (user === this.oid && currentUser.oid != _message.sender_id) {
        if(_message.message_type===0  ){
          
          this.latestMessage = _message.content[0];
        }
        else 
        {
          this.latestMessage ='Ảnh'
        }
          
      }
    },
  },
  mounted() {
    signalr.listen('ReceiveMessage', this.receiveMessage);
  }
};
</script>

<style scoped>
li {
  margin: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 12px;
}

li h2 {
  margin: 0.5rem 0;
  font-size: 1.2rem;
  color: black;
   font-weight: 400;
}
li h4 {
  color: black;
  font-size: 14px;
  font-weight: 400;
}
li .team-members {
  margin: 0.5rem 0;
}

a {
  border-radius: 5px;
  width: 100%;
  text-decoration: none;
  color: white;
  display: inline-block;
  padding: 0.5rem 1.5rem;
  transition: 0.5s !important;
}

a:hover,
a:active {
  background-color: rgb(206, 206, 206);
}
.img-avatar {
  border-radius: 100px;
  padding: 3px;
  border: 1px solid rgb(206, 206, 206);
}
.border{
  border: 1px solid #2A8383 !important;
}
</style>