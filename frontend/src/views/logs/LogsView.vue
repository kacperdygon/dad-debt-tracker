<script setup lang="ts">

import { getActionsDB } from '@/lib/actions';
import LogList from '@/views/logs/components/LogList.vue';
import type { IActionResponse } from 'shared';
import { onMounted, ref, watch } from 'vue';
import PaginationButtonsComponent from '@/components/pagination/PaginationButtonsComponent.vue';

const actions = ref<IActionResponse[]>([]);
const pageCount = ref(1);
const selectedPage = ref(1);

onMounted(() => {
  loadActions();
});

async function loadActions(){
  const response = await getActionsDB(selectedPage.value);
  if (response.ok){
    const loadedActions = response.data?.actions;
    actions.value.length = 0;
    if (loadedActions && response.data?.pageCount){
      actions.value.push(...loadedActions);
      pageCount.value = response.data.pageCount;
    }
  }
}

watch(selectedPage, () => {
  loadActions();
});

</script>

<template>
  <main>
    <section>
      <header>
        <h2>Logs</h2>
      </header>
      <LogList :actions="actions" />
      <PaginationButtonsComponent
      :total-pages="pageCount"
      v-model="selectedPage" />
    </section>
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

h2{
  margin:0;
}

header{
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

button{
  margin:auto;
  margin:2rem auto 1rem auto;
}


</style>