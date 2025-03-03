<script setup lang="ts">
import EntryModal from '@/components/EntryModal.vue';
import HeaderComponent from '@/components/header/HeaderComponent.vue';
import { ref, provide, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useEntryStore } from '@/store/entries.ts';

const entryModalRef = ref<typeof EntryModal | null>(null);


const entryStore = useEntryStore();
onMounted(() => {
  if (entryStore.entries.length === 0) {
    entryStore.fetchEntries();
  }
});

onMounted(() => {
  if (!entryModalRef.value) throw new Error('Entry modal ref not set');
  provide('openEntryModal', entryModalRef.value.openModal);
})
</script>

<template>
  <HeaderComponent />
  <div class="margin-div">
    <RouterView />
  </div>

  <EntryModal ref="entryModalRef" />
</template>

<style scoped>
.margin-div {
  margin: auto;
  padding: 1.25rem;
  width: 50%;
  box-sizing: border-box;
  min-width: 600px;
}

@media screen and (max-width: 600px) {
  .margin-div {
    width: 100%;
    min-width: 0;
  }
}
</style>
