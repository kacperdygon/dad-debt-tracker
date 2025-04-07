<script setup lang="ts">
import { inject, ref, watch } from 'vue';
import { useEntryStore } from '@/store/entries';
import EntryList from '@/components/entries/EntryList.vue';
import { storeToRefs } from 'pinia';

const entriesStore = useEntryStore();
const {lastEntries, lastRejectedEntries} = storeToRefs(entriesStore);

const openEntryModal = inject<() => void | null>('openEntryModal');
const handleOpenModal = () => {
  if (!openEntryModal) {
    throw new Error('Open entry modal not passed');
  }
  openEntryModal();
};

const showRejected = ref(false);
watch(showRejected, (newValue) => {
  if (lastRejectedEntries.value.length === 0 && newValue) {
    entriesStore.fetchRejectedEntries();
  }
}) 

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

      <EntryList :entries="showRejected ? lastRejectedEntries : lastEntries" type="full"/>
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
