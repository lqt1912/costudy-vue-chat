import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import Conversations from './pages/Conversations.vue';
import Login from './components/users/Login.vue';
import ConversationItem from './pages/ConversationItem.vue';
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

import store from './store/index';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/conversations'
    },
    {
      mame: 'conversations',
      path: '/conversations',
      components: {
        default: Conversations,
        footer: TeamsFooter
      }, 
      children:[
        {
          name: 'team-members',
          path: ':teamId',
          component: ConversationItem,
          props: true
        }    
      ]
    },
    {
      path: '/login',
      components: {
        default: Login,
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
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);
    debugger;
    const loggedIn =JSON.parse(localStorage.getItem('user'));
    const _loggedIn =JSON.parse(localStorage.getItem('currentUser'));

    if (authRequired && (!loggedIn || !_loggedIn)) {
      return next('/login');
    }

    next();
  }
});

library.add(faUserSecret);
library.add(faImages);
library.add(faPaperPlane);
library.add(faTimes);
const app = createApp(App);
app.use(store);
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router);

app.mount('#app');
