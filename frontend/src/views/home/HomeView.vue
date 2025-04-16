<script setup lang="ts">
import { onMounted } from 'vue';
import HeroComponent from './components/HeroComponent.vue';
import LastEntries from './components/LastEntries.vue';
import ChartSection from '@/views/home/components/ChartSection.vue';
import { ChartDataPeriod } from 'shared';
import { useEntryStore } from '@/store/entries';

onMounted(() => {
  useEntryStore().fetchEntries();
})
</script>

<template>
  <main>
    <HeroComponent />
    <ChartSection :period="ChartDataPeriod.LAST_3_MONTHS" />
    <LastEntries />
  </main>
</template>

<style scoped></style>
