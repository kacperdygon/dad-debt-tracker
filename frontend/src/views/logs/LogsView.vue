<script setup lang="ts">

import { useActionStore } from '@/store/actions';
import LogList from '@/views/logs/components/LogList.vue';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const actionStore = useActionStore();

const actions = storeToRefs(actionStore).actions;

onMounted(() => {
  actionStore.fetchActions(page.value);
});

onUnmounted(() => {
  actionStore.unloadActions();
})

const page = ref(1);
function handleLoadMore(){
    page.value++;
    actionStore.fetchActions(page.value);
}

const showLoadMoreButton = computed(() => {
  return page.value < storeToRefs(actionStore).pageCount.value;
})

</script>

<template>
  <main>
    <section>
      <header>
        <h2>Logs</h2>
      </header>
      <LogList :actions="actions" />
      <button v-show="showLoadMoreButton" class="button-plain secondary-text-color" @click="handleLoadMore">Load more</button>
    </section>
  </main>
</template>

<style scoped>
main{
  width:50%;
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