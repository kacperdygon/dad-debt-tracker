import './global.css'

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

export interface Entry {
    title: string;
    date: Date;
    balanceChange: number;
}