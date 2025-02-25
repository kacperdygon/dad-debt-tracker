<script setup lang="ts">
import EntryItem from '@/components/EntryItem.vue';
import EntryModal from '@/components/EntryModal.vue';
import { ref } from 'vue';
import { useEntryStore } from '@/store/entries.ts';
import { storeToRefs } from 'pinia';

const entryModalRef = ref<typeof EntryModal | null>(null);

const entriesStore = useEntryStore();
const { lastEntries } = storeToRefs(entriesStore);

const handleOpenModal = () => {
  if (!entryModalRef.value) {
    throw new Error('Entry modal ref is null');
  }
  entryModalRef.value.openModal();
};
</script>

<template>
  <section>
    <h3>Last entries</h3>
    <ul>
      <EntryItem v-for="entry in lastEntries" :key="entry.date.getTime" :entry="entry" />
    </ul>
    <button @click="handleOpenModal" class="button-main">Add new entry</button>
  </section>

  <Teleport to="body">
    <EntryModal ref="entryModalRef" />
  </Teleport>
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
