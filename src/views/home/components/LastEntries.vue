<script setup lang="ts">
import EntryItem from '@/components/EntryItem.vue';
import { inject } from 'vue';
import { useEntryStore } from '@/store/entries.ts';
import { storeToRefs } from 'pinia';

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
    <ul>
      <EntryItem
        v-for="entry in lastEntries.slice(0, 3)"
        :key="entry.id"
        :entry="entry"
      />
    </ul>
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
