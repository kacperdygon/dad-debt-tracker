import { defineStore } from 'pinia';
import { addEntryDB, updateEntryDB, getEntriesDB, type IEntry, deleteEntryDB, confirmEntryDB } from '../lib/entries.ts';
import { computed, ref } from 'vue';

export const useEntryStore = defineStore('entry', () => {
  const entries = ref<IEntry[]>([]);

  async function fetchEntries() {
    try {
      entries.value = await getEntriesDB();
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }

  const lastEntries = computed(() => {
    return [...entries.value].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  });

  const totalDebt = computed(() => {
    let totalDebt = 0;
    for (const entry of entries.value) {
      totalDebt += entry.balanceChange;
    }
    return totalDebt;
  });

  async function addEntry(newEntry: Omit<IEntry, '_id'>) {
    const addedEntry = await addEntryDB(newEntry);
    if (!addedEntry) {
      throw new Error("Error adding entry");
    }
    entries.value.push({ ...newEntry, _id: addedEntry._id });
  }

  async function updateEntry(entryId: string, newEntry: Omit<IEntry, '_id'>) {
    const updatedEntry = await updateEntryDB(entryId, newEntry);
    if (!updatedEntry) {
      throw new Error("Error updating entry");
    }
    const index = entries.value.findIndex((entry) => entry._id === entryId);
    if (index !== -1) {
      Object.assign(entries.value[index], newEntry);
    }
  }

  async function deleteEntry(entryId: string) {
    const result = await deleteEntryDB(entryId);
    if (!result) {
      throw new Error("Error deleting entry");
    }
    const index = entries.value.findIndex((entry) => entry._id === entryId);
    if (index !== -1) {
      entries.value.splice(index, 1);
    }
  }

  async function confirmEntry(entryId: string) {
    const result = await confirmEntryDB(entryId);
    if (!result) {
      throw new Error("Error patching entry");
    }
    const index = entries.value.findIndex((entry) => entry._id === entryId);
    if (index !== -1) {
      entries.value[index].confirmed = true;
    }
  }

  async function rejectEntry(entryId: string) {

  }

  return { entries, lastEntries, totalDebt, addEntry, updateEntry, deleteEntry, confirmEntry, rejectEntry, fetchEntries };
});
