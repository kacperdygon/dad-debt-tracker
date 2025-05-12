<script setup lang="ts">
import {   inject, onMounted, reactive, Ref, ref, watch } from 'vue';
import EntryList from '@/components/entries/EntryList.vue';
import PaginationButtonsComponent from '@/components/pagination/PaginationButtonsComponent.vue';
import { useRoute } from 'vue-router';
import EntriesOptions from './components/EntriesOptions.vue';
import { EntryFetchOptions, IEntry, SortBy } from 'shared';
import { getEntriesDB } from '@/lib/entries';
import EntryModal from '@/components/entries/EntryModal.vue';


const entryModalRef = inject<Ref<InstanceType<typeof EntryModal>> | null>('entryModalRef');
const handleOpenModal = async () => {
  if (!entryModalRef) {
    throw new Error('Entry modal not passed');
  }
  const result = await entryModalRef.value.openModal();
  if (result) loadEntries();
};

const entryListRef = ref<Ref<InstanceType<typeof EntryList>> | null>(null);

const entries = ref<IEntry[] | null>([]);
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
    if (!entryListRef.value) {
      throw new Error('Entry list ref not set');
    }
    entryListRef.value.jumpTo(positionOnPage);
  }
  loadEntries();
})

async function loadEntries(){
  const response = await getEntriesDB(selectedPage.value, formData);
  const loadedEntries = response.data.entries;
  pageCount.value = response.data.pageCount
  entries.value.length = 0;
  entries.value.push(...loadedEntries);
  
}

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
}

aside{
  width:30%;
}

main{
  width:70%;
}
</style>
