import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import TeamsList from './components/teams/TeamsList.vue';
import UsersList from './components/users/UsersList.vue';
import TeamMembers from './components/teams/TeamMembers.vue';
import NotFound from './components/nav/NotFound.vue';
import TeamsFooter from './components/teams/TeamsFooter.vue';
import UsersFooter from './components/users/UsersFooter.vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faImages,
  faPaperPlane,
  faTimes,
  faUserSecret
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/teams'
    },
    {
      mame: 'teams',
      path: '/teams',
      components: {
        default: TeamsList,
        footer: TeamsFooter
      }, 
      children:[
        {
          name: 'team-members',
          path: ':teamId',
          component: TeamMembers,
          props: true
        }    
      ]
    },
    {
      path: '/users',
      components: {
        default: UsersList,
        footer: UsersFooter
      }
    },
    {
      path: '/:notFound(.*)',
      component: NotFound
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    console.log(to + from + savedPosition);
    if (savedPosition) return savedPosition;
    return {
      left: 0,
      top: 0
    };
  },
  beforeEach(to, from, next) {
    debugger;
    const publicPages = ['/users'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');
    const _loggedIn = localStorage.getItem('currentUser');

    if (authRequired && (!loggedIn || !_loggedIn)) {
      return next('/users');
    }

    next();
  }
});

library.add(faUserSecret);
library.add(faImages);
library.add(faPaperPlane);
library.add(faTimes);
const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router);
app.mount('#app');
