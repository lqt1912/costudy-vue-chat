<template>
  <div class="row d-flex justify-content-center">
    <div class="col-7 pt-2 mt-2" style="border: 1px solid black">
      <input
        type="text"
        class="form-control mb-2"
        v-model="userName"
        placeholder="user name"
      />

      <input
        type="text"
        class="form-control mb-2"
        v-model="password"
        placeholder="password"
      />
      <button class="btn btn-danger btn-block mb-2" v-on:click="login()">
        Login
      </button>
    </div>
  </div>
  <!-- 
  <ul>
    <user-item v-for="user in users" :key="user.id" :name="user.fullName" :role="user.role"></user-item>
  </ul> -->
</template>

<script>
//import UserItem from './UserItem.vue';
import auth from '../../auth/auth';
export default {
  data() {
    return {
      userName: '',
      password: '',
    };
  },
  components: {
    //UserItem,
  },
  inject: ['users'],
  methods: {
    confirmInput() {
      this.$router.push('/teams');
    },

    login() { 
      auth
        .loginAxios(this.userName, this.password)
        .then((result) => {
          if (result.data.success === true) {
            //console.log(result);
            localStorage.setItem('user', JSON.stringify(result.data.result));
            // alert("Đăng nhập thành công. ")
          }
        })
        .catch((error) => {
          alert(error.message);
        });
      auth.currentUser().then((result) => {
        localStorage.setItem('currentUser', JSON.stringify(result.data.result));
      });

      const data = localStorage.getItem('currentUser');
      if (data != null) {
        this.$router.push('/teams');
      } else alert('Đăng nhập không thành công');
    },
  },
};
</script>

<style scoped> 
ul {
  list-style: none;
  margin: 2rem auto;
  max-width: 20rem;
  padding: 0;
}
</style>