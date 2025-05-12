<script setup lang="ts">
import { getTotalDebtDB } from '@/lib/entries';
import { onMounted, ref } from 'vue';

const totalDebt = ref(0);

onMounted(() => {
  loadTotalDebt();
})

async function loadTotalDebt(){
  const response = await getTotalDebtDB();
  totalDebt.value = response.data.totalDebt;
}
</script>

<template>
  <section>
    <h3>Your dad owes you</h3>
    <h2>{{ totalDebt }} zł</h2>
  </section>
</template>

<style scoped>
h3 {
  color: var(--text-gray);
  margin: 0;
}

h2 {
  margin: 0;
  font-size: 3.5rem;
}
</style>
