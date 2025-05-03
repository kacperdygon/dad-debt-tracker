<script setup lang="ts">
import { onMounted } from 'vue';
import HeroComponent from './components/HeroComponent.vue';
import LastEntries from './components/LastEntries.vue';
import ChartSection from '@/views/home/components/ChartSection.vue';
import { useEntryStore } from '@/store/entries';

onMounted(() => {
  useEntryStore().fetchEntries();
})
</script>

<template>
  <main>
    <HeroComponent />
    <ChartSection/>
    <LastEntries />
  </main>
</template>

<style scoped>
main{
  width:50%;
}
</style>
