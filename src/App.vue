<script setup lang="ts">
import EntryModal from '@/components/EntryModal.vue';
import HeaderComponent from '@/components/header/HeaderComponent.vue';
import { ref, provide } from 'vue';
import { RouterView } from 'vue-router';

const entryModalRef = ref<typeof EntryModal | null>(null);

provide('entryModalRef', entryModalRef);
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
