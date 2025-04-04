import { defineStore } from 'pinia';
import { addEntryDB, updateEntryDB, getEntriesDB, type IEntry, deleteEntryDB, changeEntryStatusDB, EntryStatus, getRejectedEntriesDB } from '@/lib/entries';
import { computed, ref } from 'vue';

export const useEntryStore = defineStore('entry', () => {
  const entries = ref<IEntry[]>([]);
  const rejectedEntries = ref<IEntry[]>([]);

  
  async function fetchEntries(page: number = 1) {
    try {
      entries.value = await getEntriesDB();
      console.log(entries);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }

  async function fetchRejectedEntries(page: number = 1) {
    try {
      rejectedEntries.value = await getRejectedEntriesDB();
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }

  const lastEntries = computed(() => {
    return entries.value;
  })

  const lastRejectedEntries = computed(() => {
    return rejectedEntries.value;
  })

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

  async function changeNotRejectedStatus(entryId: string, newStatus: EntryStatus) {
    const result = await changeEntryStatusDB(entryId, newStatus);
    if (!result.ok) {
      throw new Error("Error patching entry");
    }

      const index = entries.value.findIndex((entry) => entry._id === entryId);
      if (index !== -1) {
        if (newStatus == EntryStatus.REJECTED){
        const item = entries.value.splice(index, 1)[0];
        item.status = newStatus;
        rejectedEntries.value.push(item);
        } else {
          entries.value[index].status = newStatus;
        }
      }
  }

  async function changeRejectedStatus(entryId: string, newStatus: EntryStatus) {
    const result = await changeEntryStatusDB(entryId, newStatus);
    if (!result.ok) {
      throw new Error("Error patching entry");
    }

    const index = rejectedEntries.value.findIndex((entry) => entry._id === entryId);
    if (index !== -1){
      const item = rejectedEntries.value.splice(index, 1)[0];
      item.status = newStatus;
      entries.value.push(item);
    }
  }

  return {lastEntries, lastRejectedEntries, addEntry, updateEntry, deleteEntry, changeNotRejectedStatus, changeRejectedStatus, fetchEntries, fetchRejectedEntries };
});
