<script setup lang="ts">
import HeroComponent from '@/components/HeroComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import LastEntries from '@/components/LastEntries.vue';
import EntryModal from '@/components/EntryModal.vue';
import { ref, provide } from 'vue';

const entryModalRef = ref<typeof EntryModal | null>(null);

provide('entryModalRef', entryModalRef);
</script>

<template>
  <HeaderComponent />
  <HeroComponent />
  <LastEntries />

  <EntryModal ref="entryModalRef" />

</template>

<style scoped></style>
