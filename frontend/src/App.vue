<script setup lang="ts">
import EntryModal from './components/entries/EntryModal.vue';
import HeaderComponent from './components/header/HeaderComponent.vue';
import { ref, provide, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useEntryStore } from '@/store/entries';
import { useAuthStore } from '@/store/auth';
import FooterComponent from './components/footer/FooterComponent.vue';

const entryModalRef = ref<typeof EntryModal | null>(null);

const entryStore = useEntryStore();
const authStore = useAuthStore();
onMounted( () => {
  fetchDataIfSignedIn();
  if (!entryModalRef.value) throw new Error('Entry modal ref not set');
  provide('openEntryModal', entryModalRef.value?.openModal);
});

async function fetchDataIfSignedIn () {
  if (await authStore.isSignedIn()) {
    await entryStore.fetchEntries();
  }
}



</script>

<template>
  <HeaderComponent />
  <div class="margin-div">
    <RouterView />
  </div>
  <FooterComponent />

  <EntryModal ref="entryModalRef" />
</template>

<style scoped>
.margin-div {
  margin: auto;
  padding: 1.25rem;
  width: 100%;
  display:flex;
  justify-content: center;
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
