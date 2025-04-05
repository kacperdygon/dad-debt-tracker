<script setup lang="ts">
import { useEntryStore } from '@/store/entries';
import EntryList from '@/components/entries/EntryList.vue';
import { storeToRefs } from 'pinia';

const entriesStore = useEntryStore();
const lastEntries = storeToRefs(entriesStore).lastEntries;
</script>

<template>
  <section>
    <h3>Last entries</h3>
    <EntryList :entries="lastEntries" />
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
