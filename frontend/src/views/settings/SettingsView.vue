<script setup lang="ts">

import { signOut } from '@/lib/auth.ts';
import { useRouter } from 'vue-router';

const router = useRouter();

function handleSignOut(): void {
  signOut();
  router.push('/auth');
}
</script>

<template>
  <button @click="handleSignOut">
    Sign out
  </button>
</template>

<style scoped>

</style>