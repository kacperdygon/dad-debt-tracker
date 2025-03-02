<script setup lang="ts">
import { useEntryStore } from '@/store/entries.ts';
import { storeToRefs } from 'pinia';

const entriesStore = useEntryStore();

const { totalDebt } = storeToRefs(entriesStore);
</script>

<template>
  <section>
    <h3>Your dad owes you</h3>
    <h2>{{ totalDebt.toFixed(2) }} zł</h2>
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
