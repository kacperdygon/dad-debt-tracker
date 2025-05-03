<script setup lang="ts">
import {  inject, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useEntryStore } from '@/store/entries';
import EntryList from '@/components/entries/EntryList.vue';
import { storeToRefs } from 'pinia';
import PaginationButtonsComponent from '@/components/pagination/PaginationButtonsComponent.vue';
import { useRoute } from 'vue-router';
import EntriesOptions from './components/EntriesOptions.vue';
import { EntryFetchOptions, SortBy } from 'shared';

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

const selectedPage = ref(1);

onMounted(() => {
  const params = useRoute().query;
  const positionOnPage = parseInt(params.positionOnPage as string);
  const page = parseInt(params.page as string);
  const rejected = params.rejected;
  if (positionOnPage && page && rejected) {
    formData.showRejected = params.rejected === 'true';
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
  entriesStore.fetchEntries(newValue, formData);
  entriesStore.setLastPage(formData.showRejected, newValue, formData);
});

const formData = reactive<EntryFetchOptions>({
  showRejected: false,
  sortBy: SortBy.DATE_DESC,
  filter: {
    author: ['dad', 'son'],
    status: ['confirmed', 'pending'],
    sign: ['positive', 'negative']
  },
  time: {}
});

watch(formData, (newValue) => {
  selectedPage.value = 1;
  entriesStore.fetchEntries(selectedPage.value, newValue);
})



</script>

<template>
  <div class="parent-div">
    <aside>
      <EntriesOptions v-model="formData"/>
</aside>
<main>
  <section>
    <header>
      <h2>Entries</h2>

    </header>

    <EntryList :entries="formData.showRejected ? rejectedEntries : entries" type="full" ref="entryListRef"/>
    <button @click="handleOpenModal" class="button-main font-125rem padding-075rem">Add new entry</button>

    <PaginationButtonsComponent
      :total-pages="formData.showRejected ? pageCount.rejectedEntries : pageCount.entries"
      v-model="selectedPage" />
  </section>
</main>
  </div>
  
</template>

<style scoped>

.parent-div{
  display:flex;
}

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

.parent-div{
  width:70%;
}

aside{
  width:30%;
}

main{
  width:70%;
}
</style>
