<script setup lang="ts">
import type { IActionResponse } from 'shared';
import LogItem from '@/views/logs/components/LogItem.vue';

const props = defineProps<{
  actions: IActionResponse[]
}>()

</script>

<template>
  <div>
    <span v-if="!actions.length" class="entry-placeholder">Seems like nothing happened yet</span>
    <Suspense>
      <ul class="base-ul flex-ul">
        <LogItem v-for="action in props.actions" :key="action._id" :action="action" />
      </ul>
    </Suspense>
  </div>
</template>

<style scoped>

.entry-placeholder {
  width:100%;
  text-align: center;
  height:4rem;
  display:flex;
  align-items: center;
  justify-content: center;
  color:var(--text-gray)
}
</style>
