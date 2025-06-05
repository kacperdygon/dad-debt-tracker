<script setup lang="ts">

import { getActionsDB } from '@/lib/actions';
import LogList from '@/views/logs/components/LogList.vue';
import type { IActionResponse } from 'shared';
import { onMounted, ref, watch } from 'vue';
import PaginationButtonsComponent from '@/components/pagination/PaginationButtonsComponent.vue';
import { useRoute } from 'vue-router';
import { addErrorToast, handleError } from '@/lib/errorHandler.ts';

const actions = ref<IActionResponse[]>([]);
const pageCount = ref(1);
const selectedPage = ref(1);

const entryId = ref<string | null>(null);

onMounted(() => {
  loadParams();
  loadActions();
});

const route = useRoute();
function loadParams(){
  const params = route.params;
 if (params.id && typeof params.id == 'string') entryId.value = params.id;
}

async function loadActions(){
  try {
    const response = await getActionsDB(selectedPage.value, entryId.value ?? undefined);
    if (response.ok){
      const loadedActions = response.data?.actions;
      actions.value.length = 0;
      if (loadedActions && response.data?.pageCount){
        actions.value.push(...loadedActions);
        pageCount.value = response.data.pageCount;
      }
    } else {
      addErrorToast('Error while loading actions: ' + response.message);
    }
  } catch (error) {
    handleError(error);
  }

}

watch(selectedPage, loadActions);
watch(() => route.fullPath, reloadComponent)
function reloadComponent(){
  selectedPage.value = 1;
  entryId.value = null;
  loadActions();
}

</script>

<template>
  <main>
    <section>
      <header>
        <h2>{{ entryId ? `Showing history of entry with id ${entryId}` : `Logs` }}</h2>
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