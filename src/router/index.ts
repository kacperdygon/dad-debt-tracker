import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/home/HomeView.vue';
import EntriesView from '@/views/entries/EntriesView.vue';

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
  ],
});

export default router;
