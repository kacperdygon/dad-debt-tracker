<script setup lang="ts">
import { inject } from 'vue';
import { useEntryStore } from '@/store/entries.ts';
import { storeToRefs } from 'pinia';
import EntryList from '@/components/entries/EntryList.vue';

const entriesStore = useEntryStore();
const { lastEntries } = storeToRefs(entriesStore);

const openEntryModal = inject<() => void | null>('openEntryModal');
const handleOpenModal = () => {
  if (!openEntryModal) {
    throw new Error('Open entry modal not passed');
  }
  openEntryModal();
};
</script>

<template>
  <section>
    <h3>Last entries</h3>
    <EntryList :entries="lastEntries.slice(0, 3)" />
    <button @click="handleOpenModal" class="button-main">Add new entry</button>
  </section>
</template>

<style scoped>
ul {
  padding-left: 0;
}

ul > * {
  margin: 0 0 1rem;
}

button {
  align-self: center;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0%);
}
</style>
