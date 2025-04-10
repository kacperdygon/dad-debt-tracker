<script setup lang="ts">
import { computed, inject, onUnmounted, reactive, ref, watch } from 'vue';
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

const page = reactive({
  entries: 1,
  rejectedEntries: 1
})
function handleLoadMore(){
  if(showRejected.value){
    page.rejectedEntries++;
    entriesStore.fetchRejectedEntries(page.rejectedEntries);
  } else {
    page.entries++;
    entriesStore.fetchEntries(page.entries);
  }
}

watch(showRejected, (newValue) => {
  if (lastRejectedEntries.value.length === 0 && newValue) {
    entriesStore.fetchRejectedEntries();
  }
}) 

const showLoadMoreButton = computed(() => {
  if (showRejected.value) 
  return page.rejectedEntries < storeToRefs(entriesStore).pageCount.value.rejectedEntries;
  else 
  return page.entries < storeToRefs(entriesStore).pageCount.value.entries
})

onUnmounted(() => {
  entriesStore.unloadEntries();
});

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
      <button v-show="showLoadMoreButton" class="button-plain secondary-text-color" @click="handleLoadMore">Load more</button>
      <button @click="handleOpenModal" class="button-main">Add new entry</button>
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
  margin-bottom: 1.25rem;
  width:100%;
}

section{
  display:flex;
  flex-direction:column;
  align-items: center;
  gap:1rem;
}
</style>
