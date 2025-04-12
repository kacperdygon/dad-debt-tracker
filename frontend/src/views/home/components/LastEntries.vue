<script setup lang="ts">
import { useEntryStore } from '@/store/entries';
import EntryList from '@/components/entries/EntryList.vue';
import { storeToRefs } from 'pinia';
import { computed, inject, onMounted } from 'vue';

const entriesStore = useEntryStore();
const lastEntries = storeToRefs(entriesStore).lastEntries;
const unconfirmedEntryCount = storeToRefs(entriesStore).unconfirmedEntryCount;

const last3Entries = computed(() => { 
  const lastEntriesArr = lastEntries.value.slice();
  // sort to get latest and then get first 3
  return lastEntriesArr.sort((a, b) => { 
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  }).slice(0, 3);
});

const openEntryModal = inject<() => void | null>('openEntryModal');
const handleOpenModal = () => {
  if (!openEntryModal) {
    throw new Error('Open entry modal not passed');
  }
  openEntryModal();
};

onMounted(() => {
  entriesStore.fetchUnconfirmedEntryCount();
});
</script>

<template>
  <section>
    <h3>Last entries <span v-if="unconfirmedEntryCount !== 0" class="font-1rem orange-color">{{ unconfirmedEntryCount }} not confirmed</span></h3>
    <EntryList :entries="last3Entries" type="partial" />
    <button @click="handleOpenModal" class="button-main font-125rem padding-075rem">Add new entry</button>
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
  margin-top: 1rem;
}
</style>
