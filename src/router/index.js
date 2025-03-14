var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/home/HomeView.vue';
import EntriesView from '@/views/entries/EntriesView.vue';
import { getRole } from '@/lib/database.ts';
import AuthView from '@/views/auth/AuthView.vue';
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
router.beforeEach((to, from, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield getRole()) {
        next();
    }
    else {
        if (to.path == '/auth') {
            next();
        }
        else {
            next('/auth');
        }
    }
}));
export default router;
