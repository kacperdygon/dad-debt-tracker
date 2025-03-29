<script setup lang="ts">

import { useActionStore } from '@/store/actions.ts';
import LogList from '@/views/logs/components/LogList.vue';
import { computed, onMounted } from 'vue';

const actionStore = useActionStore();

const actions = computed(() => actionStore.actions);

onMounted(() => {
  actionStore.fetchActions();
});

</script>

<template>
  <main>
    <section>
      <header>
        <h2>Logs</h2>
      </header>
      <LogList :actions="actions" />
    </section>
  </main>
</template>

<style scoped>
h2{
  margin:0;
}

header{
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}


</style>