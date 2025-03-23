import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteLocationNormalizedLoaded
} from 'vue-router';
import HomeView from '../views/home/HomeView.vue';
import EntriesView from '../views/entries/EntriesView.vue';
import { isSignedIn } from '@/lib/auth';
import AuthView from '../views/auth/AuthView.vue';
import SettingsView from '@/views/settings/SettingsView.vue';

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
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
  ],
});

router.beforeEach(async ( to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded, next: NavigationGuardNext) => {
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
