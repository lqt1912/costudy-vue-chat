<template>
  <li class="border">
    <router-link :to="getLink">
      <h2>{{ name }}</h2>
      <h4>{{ message }}</h4>
      {{oid}}
    </router-link>
  </li>
</template>

<script>
export default {
  props: ['oid', 'name', 'message'],
  computed: {
    getLink() {
      //return '/teams/'+this.id;
      return {
        name: 'team-members',
        params: {
          teamId: this.oid
        }
      };
    },
  },
};
</script>

<style scoped>
li {
  margin: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 12px;
  padding: 1rem;
}

li h2 {
  margin: 0.5rem 0;
  font-size: 1.25rem;
  color: black
}
li h4{
  color: brown
}
li .team-members {
  margin: 0.5rem 0;
}

a {
  border-radius: 12px;
  width:100%;
  text-decoration: none;
  color: white;
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background-color: gray;
}

a:hover,
a:active {
  background-color: gainsboro;
}
</style>