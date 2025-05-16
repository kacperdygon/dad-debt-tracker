<script setup lang="ts">
import HeroComponent from '@/views/home/components/HeroComponent.vue';
import LastEntries from '@/views/home/components/LastEntries.vue';
import ChartSection from '@/views/home/components/ChartSection.vue';
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
  padding:1.25rem;
  min-width:600px;
  box-sizing: border-box;
}

@media screen and (max-width: 600px) {
  main{width:100%; min-width: 0}
}
</style>
