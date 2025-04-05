<script setup lang="ts">
import { useEntryStore } from '@/store/entries';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const entriesStore = useEntryStore();
const totalDebt = storeToRefs(entriesStore).totalDebt;

onMounted(() => {
  entriesStore.fetchTotalDebt();
})
</script>

<template>
  <section>
    <h3>Your dad owes you</h3>
    <h2>{{ totalDebt }} zł</h2>
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
