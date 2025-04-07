<script setup lang="ts">
import { useEntryStore } from '@/store/entries';
import EntryList from '@/components/entries/EntryList.vue';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const entriesStore = useEntryStore();
const lastEntries = storeToRefs(entriesStore).lastEntries;

const last3Entries = computed(() => lastEntries.value.slice(0, 3))
</script>

<template>
  <section>
    <h3>Last entries</h3>
    <EntryList :entries="last3Entries" type="partial" />
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
