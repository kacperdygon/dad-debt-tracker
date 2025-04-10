import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IActionResponse } from 'shared/dist';
import { getActionPageCountDB, getActionsDB } from '@/lib/actions';

export const useActionStore = defineStore('action', () => {
  const actions = ref<IActionResponse[]>([]);
  const pageCount = ref(0);

  async function fetchActions(page: number) {
    try {
      if (actions.value.length === 0){
        pageCount.value = (await getActionPageCountDB()).data?.actionPageCount || 0;
      }
      actions.value.push(...(await getActionsDB(page)));
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }

  async function unloadActions(){
    actions.value.length = 0;
  }

  return { actions, fetchActions, pageCount, unloadActions };
});
