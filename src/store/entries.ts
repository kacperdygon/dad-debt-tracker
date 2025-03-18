import { defineStore } from 'pinia';
import { type IEntry } from '@/lib/entries.ts';
import { computed, ref } from 'vue';
import {
  addEntryToFirestore,
  deleteEntryFromFirestore,
  editEntryFromFirestore,
  getEntriesFromFirestore
} from '@/lib/database.ts';

export const useEntryStore = defineStore('entry', () => {
  const entries = ref<IEntry[]>([]);

  async function fetchEntries () {
    try {
      entries.value = await getEntriesFromFirestore();
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }

  const lastEntries = computed(() => {
    return [...entries.value].sort(
      (a, b) => new Date(b.timestamp.toDate()).getTime() - new Date(a.timestamp.toDate()).getTime(),
    );
  });

  const totalDebt = computed(() => {
    let totalDebt = 0;
    for (const entry of entries.value) {
      totalDebt += entry.balanceChange;
    }
    return totalDebt;
  });

  async function addEntry(newEntry: Omit<IEntry, 'id'>) {
    if (!newEntry) {
      return;
    }
    if (!(newEntry.timestamp && newEntry.balanceChange && newEntry.title)) {
      return;
    }
    const newEntryId = await addEntryToFirestore(newEntry);
    entries.value.push({...newEntry, id: newEntryId});
  }

  async function editEntry(entryId: string, newEntry: Omit<IEntry, 'id'>) {
    if (!newEntry) {
      return;
    }
    if (!(newEntry.timestamp && newEntry.balanceChange && newEntry.title)) {
      return;
    }
    await editEntryFromFirestore(entryId, newEntry);
    const index = entries.value.findIndex((entry) => entry.id === entryId);
    if (index !== -1) {
      entries.value[index] = {...newEntry, id: entryId};
    }
  }

  async function deleteEntry(entryId: string) {
    await deleteEntryFromFirestore(entryId);
    const index = entries.value.findIndex((entry) => entry.id === entryId);
    if (index !== -1) {
      entries.value.splice(index, 1);
    }
  }

  return { entries, lastEntries, totalDebt, addEntry, editEntry, deleteEntry, fetchEntries };
});
