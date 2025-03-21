import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/home/HomeView.vue';
import EntriesView from '../views/entries/EntriesView.vue';
import { isSignedIn } from '../lib/auth.ts';
import AuthView from '../views/auth/AuthView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/entries',
      name: 'entries',
      component: EntriesView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
    },
    // {
    //   path: '/settings',
    //   name: 'settings',
    //   component: SettingsView,
    // },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (await isSignedIn()) {
    next();
  } else {
    if (to.path == '/auth') {
      next();
    } else {
      next('/auth');
    }
  }
});

export default router;
