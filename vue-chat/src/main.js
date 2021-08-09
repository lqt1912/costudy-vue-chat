import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import TeamsList from './components/teams/TeamsList.vue';
import UsersList from './components/users/UsersList.vue';
import TeamMembers from './components/teams/TeamMembers.vue';
import NotFound from './components/nav/NotFound.vue';
import TeamsFooter from './components/teams/TeamsFooter.vue';
import UsersFooter from './components/users/UsersFooter.vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faImages, faPaperPlane, faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
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
      }
    },
    {
      name: 'team-members',
      path: '/teams/:teamId',
      component: TeamMembers,
      props: true
    }, // our-domain.com/teams => TeamsList

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
  }
});
library.add(faUserSecret);
library.add(faImages);
library.add(faPaperPlane)

const app = createApp(App);

app.component('font-awesome-icon',FontAwesomeIcon);

app.use(router);
app.mount('#app');