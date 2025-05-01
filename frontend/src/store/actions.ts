import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IActionResponse } from 'shared';
import { getActionPageCountDB, getActionsDB } from '@/lib/actions';

export const useActionStore = defineStore('action', () => {
  const actions = ref<IActionResponse[]>([]);
  const pageCount = ref(0);

  async function fetchActions(page: number) {
    try {
      pageCount.value = (await getActionPageCountDB()).data?.actionPageCount || 0;
      const loadedActions = await getActionsDB(page);
      actions.value.length = 0;
      actions.value.push(...loadedActions);
    } catch (error) {
      console.error('Error fetching actions:', error);
    }
  }

  async function unloadActions(){
    actions.value.length = 0;
  }

  return { actions, fetchActions, pageCount, unloadActions };
});
