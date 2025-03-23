<script setup lang="ts">
import EntryItem from '@/components/EntryItem.vue';
import { inject, ref } from 'vue';
import { useEntryStore } from '@/store/entries.ts';
import { storeToRefs } from 'pinia';

const entriesStore = useEntryStore();
let { lastEntries } = storeToRefs(entriesStore);
let { rejectedEntries } = storeToRefs(entriesStore);

const openEntryModal = inject<() => void | null>('openEntryModal');
const handleOpenModal = () => {
  if (!openEntryModal) {
    throw new Error('Open entry modal not passed');
  }
  openEntryModal();
};

const showRejected = ref(false);
</script>

<template>
  <main>
    <section>
      <header>
        <h2>Entries</h2>
        <label>
          Show rejected
          <input type="checkbox" v-model="showRejected" />
        </label>

      </header>

      <Suspense>
        <ul>
          <EntryItem v-for="entry in showRejected ? rejectedEntries : lastEntries" :key="entry._id" :entry="entry" />
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

h2{
  margin:0;
}

header{
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}
</style>
