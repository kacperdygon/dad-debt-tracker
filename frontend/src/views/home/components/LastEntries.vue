<script setup lang="ts">
import EntryList from '@/components/entries/EntryList.vue';
import { inject, onMounted, type Ref, ref } from 'vue';
import { getEntriesDB, getUnconfirmedEntryCountDB } from '@/lib/entries/entries';
import { type IEntry } from 'shared';
import EntryModal from '@/components/entries/EntryModal.vue';

const lastEntries = ref<IEntry[]>([]);
const unconfirmedEntryCount = ref<number>(0);

const entryModalRef = inject<Ref<InstanceType<typeof EntryModal>> | null>('entryModalRef');
const handleOpenModal = async () => {
  if (!entryModalRef) {
    throw new Error('Entry modal not passed');
  }
  const result = await entryModalRef.value.openModal();
  if (result) loadEntries();
};

onMounted(() => {
  loadEntries();
  loadUnconfirmedEntryCount();
});

async function loadEntries() {
  const response = await getEntriesDB();
  if (response.ok && response.data) {
    lastEntries.value.length = 0;
    lastEntries.value.push(...response.data.entries.slice(0, 3));
  }
}

async function loadUnconfirmedEntryCount() {
  const response = await getUnconfirmedEntryCountDB();
  if (response.ok && response.data) {
    unconfirmedEntryCount.value = response.data.unconfirmedEntryCount;
  }
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
