<script setup lang="ts">
import {  inject, onUnmounted, ref, watch } from 'vue';
import { useEntryStore } from '@/store/entries';
import EntryList from '@/components/entries/EntryList.vue';
import { storeToRefs } from 'pinia';
import PaginationButtonsComponent from '@/components/pagination/PaginationButtonsComponent.vue';

const entriesStore = useEntryStore();
const {lastEntries, lastRejectedEntries, pageCount} = storeToRefs(entriesStore);

const openEntryModal = inject<() => void | null>('openEntryModal');
const handleOpenModal = () => {
  if (!openEntryModal) {
    throw new Error('Open entry modal not passed');
  }
  openEntryModal();
};

const showRejected = ref(false);
const selectedPage = ref(1);

watch(showRejected, (newValue) => {
  if (lastRejectedEntries.value.length === 0 && newValue) {
    entriesStore.fetchRejectedEntries();
  }
})

onUnmounted(() => {
  entriesStore.unloadEntries();
});

watch(selectedPage, (newValue) => {
  entriesStore.fetchEntries(newValue);
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

      <PaginationButtonsComponent
        v-show="lastEntries.length > 5"
        :total-pages="showRejected ? pageCount.rejectedEntries : pageCount.entries"
        v-model="selectedPage" />

      <EntryList :entries="showRejected ? lastRejectedEntries : lastEntries" type="full"/>
      <button @click="handleOpenModal" class="button-main font-125rem padding-075rem">Add new entry</button>

      <PaginationButtonsComponent
        :total-pages="showRejected ? pageCount.rejectedEntries : pageCount.entries"
        v-model="selectedPage" />
    </section>
  </main>
</template>

<style scoped>
ul {
  padding-left: 0;
}
h2{
  margin:0;
}

header{
  display:flex;
  justify-content: space-between;
  align-items: center;
  width:100%;
}

section{
  display:flex;
  flex-direction:column;
  align-items: center;
  gap:1rem;
}
</style>
