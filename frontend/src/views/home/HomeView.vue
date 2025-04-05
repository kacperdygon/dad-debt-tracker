<script setup lang="ts">
import HeroComponent from './components/HeroComponent.vue';
import LastEntries from './components/LastEntries.vue';
import ChartSection from '@/views/home/components/ChartSection.vue';
import { ChartDataPeriod } from 'shared/dist';
</script>

<template>
  <main>
    <HeroComponent />
    <ChartSection :period="ChartDataPeriod.LAST_MONTH" />
    <LastEntries />
  </main>
</template>

<style scoped></style>
