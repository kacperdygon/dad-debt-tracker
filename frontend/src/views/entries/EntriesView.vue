<script setup lang="ts">
import {  inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { useEntryStore } from '@/store/entries';
import EntryList from '@/components/entries/EntryList.vue';
import { storeToRefs } from 'pinia';
import PaginationButtonsComponent from '@/components/pagination/PaginationButtonsComponent.vue';
import { useRoute } from 'vue-router';

const entriesStore = useEntryStore();
const {entries, rejectedEntries, pageCount} = storeToRefs(entriesStore);

const openEntryModal = inject<() => void | null>('openEntryModal');
const handleOpenModal = () => {
  if (!openEntryModal) {
    throw new Error('Open entry modal not passed');
  }
  openEntryModal();
};

type EntryListExposed = {
  jumpTo: (id: number) => void;
};
const entryListRef = ref<EntryListExposed | null>(null);

const showRejected = ref(false);
const selectedPage = ref(1);

watch(showRejected, (newValue) => {
  if (newValue) entriesStore.fetchRejectedEntries();
  else entriesStore.fetchEntries();
  selectedPage.value = 1;
})

onMounted(() => {
  const params = useRoute().query;
  const positionOnPage = parseInt(params.positionOnPage as string);
  const page = parseInt(params.page as string);
  const rejected = params.rejected;
  if (positionOnPage && page && rejected) {
    showRejected.value = params.rejected === 'true';
    selectedPage.value = page;
    if (!entryListRef.value) {
      throw new Error('Entry list ref not set');
    }
    entryListRef.value.jumpTo(positionOnPage);
  }
})

onUnmounted(() => {
  entriesStore.unloadEntries();
});

watch(selectedPage, (newValue) => {
  entriesStore.fetchEntries(newValue);
  entriesStore.setLastPage(showRejected.value, newValue);
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

      <EntryList :entries="showRejected ? rejectedEntries : entries" type="full" ref="entryListRef"/>
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
