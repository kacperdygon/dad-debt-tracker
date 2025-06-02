<script setup lang="ts">

import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const router = useRouter();
const authStore = useAuthStore();

function handleSignOut(): void {
  authStore.signOut();
  router.push('/auth');
}
</script>

<template>
  <main>
    <button @click="handleSignOut">
      Sign out
    </button>
  </main>

</template>

<style scoped>
  main{
    display:flex;
    flex-direction: column;
    justify-content: center;
  }
</style>