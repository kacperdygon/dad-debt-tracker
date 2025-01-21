<script setup lang="ts">

defineProps<{
  totalDebt: number;
}>();

</script>

<template>

  <section>
    <h3>Your dad owes you</h3>
    <h2>{{totalDebt.toFixed(2)}} zł</h2>
  </section>



</template>

<style scoped>

</style>