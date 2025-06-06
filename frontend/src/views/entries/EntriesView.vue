<script setup lang="ts">
import {   inject, onMounted, provide, reactive, type Ref, ref, watch } from 'vue';
import EntryList from '@/components/entries/EntryList.vue';
import PaginationButtonsComponent from '@/components/pagination/PaginationButtonsComponent.vue';
import { useRoute } from 'vue-router';
import EntriesOptions from './components/EntriesOptions.vue';
import { type EntryFetchOptions, type IEntry, SortBy } from 'shared';
import { getEntriesDB } from '@/lib/entries/entries';
import EntryModal from '@/components/entries/EntryModal.vue';
import { addErrorToast, handleErrorWithToast } from '@/lib/toastHandlers.ts';


const entryModalRef = inject<Ref<InstanceType<typeof EntryModal>> | null>('entryModalRef');
const handleOpenModal = () => {
  if (!entryModalRef) {
    console.warn('Entry modal ref not passed');
    return;
  }
  entryModalRef.value.openModal().then((shouldReload) => {
    if (shouldReload) loadEntries();
  });
};

const entryListRef = ref<Ref<InstanceType<typeof EntryList>> | null>(null);

const entries = ref<IEntry[]>([]);
const pageCount = ref<number>(0);
const selectedPage = ref(1);

onMounted(() => {
  const params = useRoute().query;
  const positionOnPage = parseInt(params.positionOnPage as string);
  const page = parseInt(params.page as string);
  const rejected = params.rejected;
  if (positionOnPage && page && rejected) {
    if (rejected === "true") formData.filter.status.push('rejected');
    selectedPage.value = page;
  }
  loadEntries().then(() => {
    if (!Number.isNaN(positionOnPage)){
      jumpToEntry(positionOnPage);
    }
  });
})

function jumpToEntry(positionOnPage: number){
  if (!entryListRef.value) {
    console.warn('Entry list ref not set');
    return;
  }
  entryListRef.value.jumpTo(positionOnPage);
  entryListRef.value.highlightChild(positionOnPage);
}

async function loadEntries(){
  let response;
  try {
    response = await getEntriesDB(selectedPage.value, formData);
  } catch (error) {
    handleErrorWithToast(error);
    return;
  }

  if (response.ok && response.data) {
    const loadedEntries = response.data.entries;
    pageCount.value = response.data.pageCount
    entries.value.length = 0;
    entries.value.push(...loadedEntries);
  } else {
    addErrorToast('Error while loading entries: ' + response.message);
  }
}

provide('reloadEntries', loadEntries);

const formData = reactive<EntryFetchOptions>({
  sortBy: SortBy.DATE_DESC,
  filter: {
    author: ['dad', 'son'],
    status: ['confirmed', 'pending'],
    sign: ['positive', 'negative']
  },
  time: {}
});

watch(selectedPage, () => {
  loadEntries();
});

watch(formData, () => {
  if (selectedPage.value === 1) {
    loadEntries();
  } else {
    selectedPage.value = 1;
  }
  
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

    <EntryList :entries="entries" type="full" ref="entryListRef"/>
    <button @click="handleOpenModal" class="button-main font-125rem padding-075rem">Add new entry</button>

    <PaginationButtonsComponent
      :total-pages="pageCount"
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
  min-width:800px;
  padding:1.25rem;
  box-sizing: border-box;
}

aside{
  width:30%;
  margin-right:1rem;
}

main{
  width:70%;
}

@media screen and (max-width: 800px) {
  .parent-div {
    width: 100%;
    min-width: 0;
    display:flex;
    flex-wrap: wrap;
  }
  main{width:100%}
  aside{width:100%; margin-right:0; margin-bottom: 1rem;}
}
</style>
