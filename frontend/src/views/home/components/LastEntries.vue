<script setup lang="ts">
import EntryList from '@/components/entries/EntryList.vue';
import { inject, onMounted, ref } from 'vue';
import { getEntriesDB, getUnconfirmedEntryCountDB } from '@/lib/entries';
import { IEntry } from 'shared';

const lastEntries = ref<IEntry[]>([]);
const unconfirmedEntryCount = ref<number>(0);

const openEntryModal = inject<() => void | null>('openEntryModal');
const handleOpenModal = () => {
  if (!openEntryModal) {
    throw new Error('Open entry modal not passed');
  }
  openEntryModal();
};

onMounted(() => {
  loadEntries();
  loadUnconfirmedEntryCount();
});

async function loadEntries() {
  const response = await getEntriesDB(1);
  lastEntries.value.push(...response.data.entries.slice(0, 3));
}

async function loadUnconfirmedEntryCount() {
  const response = await getUnconfirmedEntryCountDB();
  unconfirmedEntryCount.value = response.data.unconfirmedEntryCount;
}
</script>

<template>
  <section>
    <h3>Last entries <span v-if="unconfirmedEntryCount !== 0" class="font-1rem orange-color">{{ unconfirmedEntryCount }} not confirmed</span></h3>
    <EntryList :entries="lastEntries" type="partial" />
    <button @click="handleOpenModal" class="button-main font-125rem padding-075rem">Add new entry</button>
  </section>
</template>

<style scoped>
button {
  align-self: center;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0%);
  margin-top: 1rem;
}
</style>
