<script setup lang="ts">
import EntryItem from '../../components/EntryItem.vue';
import { inject } from 'vue';
import { useEntryStore } from '../../store/entries.ts';
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
  <main>
    <section>
      <h2>Entries</h2>
      <Suspense>
        <ul>
          <EntryItem v-for="entry in lastEntries" :key="entry._id" :entry="entry" />
        </ul>
      </Suspense>
      <button @click="handleOpenModal" class="button-main">Add new entry</button>
    </section>
  </main>
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

h2 {
  margin-top: 0;
}
</style>
