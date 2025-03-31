import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteLocationNormalizedLoaded
} from 'vue-router';
import HomeView from '../views/home/HomeView.vue';
import EntriesView from '../views/entries/EntriesView.vue';
import AuthView from '../views/auth/AuthView.vue';
import SettingsView from '@/views/settings/SettingsView.vue';
import { useAuthStore } from '@/store/auth.ts';
import LogsView from '@/views/logs/LogsView.vue';

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
      path: '/entries/:id',
      name: 'jump-to-entry',
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
    {
      path: '/logs',
      name: 'logs',
      component: LogsView,
    },
  ],
});

router.beforeEach(async ( to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded, next: NavigationGuardNext) => {
  const authStore = useAuthStore();
  if (await authStore.isSignedIn()) {
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
