import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IActionResponse } from 'shared/dist';
import { getActionsDB } from '@/lib/actions.ts';

export const useActionStore = defineStore('action', () => {
  const actions = ref<IActionResponse[]>([]);

  async function fetchActions() {
    try {
      actions.value = await getActionsDB();
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }

  return { actions, fetchActions };
});
