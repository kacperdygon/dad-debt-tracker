<script setup lang="ts">
import EntryModal from './components/entries/EntryModal.vue';
import HeaderComponent from './components/header/HeaderComponent.vue';
import { ref, provide, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import FooterComponent from './components/footer/FooterComponent.vue';

const entryModalRef = ref<typeof EntryModal | null>(null);

onMounted( () => {
  if (!entryModalRef.value) {
    console.warn('Entry modal ref not set');
    return;
  }
  provide('entryModalRef', entryModalRef);
});

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
  width: 100%;
  display:flex;
  justify-content: center;
  flex:1;
}
</style>
