<script setup lang="ts">
import { useEntryStore } from '@/store/entries';

const entriesStore = useEntryStore();
</script>

<template>
  <section>
    <h3>Your dad owes you</h3>
    <h2>{{  }} zł</h2>
  </section>
</template>

<style scoped>
h3 {
  color: var(--text-gray);
  margin: 0;
}

h2 {
  margin: 0;
  font-size: 3.5rem;
}
</style>
