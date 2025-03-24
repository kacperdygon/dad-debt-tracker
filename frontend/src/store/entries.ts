import { defineStore } from 'pinia';
import { addEntryDB, updateEntryDB, getEntriesDB, type IEntry, deleteEntryDB, changeEntryStatusDB, EntryStatus } from '@/lib/entries.ts';
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
    return [...entries.value].filter(
      (entry) => entry.status != 'rejected'
    );
  });

  const rejectedEntries = computed(() => {
    return [...entries.value].filter(
      (entry) => entry.status == 'rejected'
    );
  });

  const totalDebt = computed(() => {
    let totalDebt = 0;
    for (const entry of entries.value.filter(
      (entry) => entry.status != 'rejected'
    )) {
      totalDebt += entry.balanceChange;
    }
    return totalDebt;
  });

  async function addEntry(newEntry: Omit<IEntry, '_id' | 'status'>) {
    const addedEntry = await addEntryDB(newEntry);
    if (!addedEntry) {
      throw new Error("Error adding entry");
    }
    entries.value.push(addedEntry);
  }

  async function updateEntry(entryId: string, newEntry: Omit<IEntry, '_id' | 'status'>) {
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

  async function changeEntryStatus(entryId: string, newStatus: EntryStatus) {
    const result = await changeEntryStatusDB(entryId, newStatus);
    if (!result) {
      throw new Error("Error patching entry");
    }
    const index = entries.value.findIndex((entry) => entry._id === entryId);
    if (index !== -1) {
      entries.value[index].status = newStatus;
    }
  }

  return { entries, lastEntries, totalDebt, addEntry, updateEntry, deleteEntry, changeEntryStatus, fetchEntries, rejectedEntries };
});
