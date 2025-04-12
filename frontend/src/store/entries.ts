import { defineStore } from 'pinia';
import {
  addEntryDB,
  updateEntryDB,
  getEntriesDB,
  type IEntry,
  deleteEntryDB,
  changeEntryStatusDB,
  EntryStatus,
  getRejectedEntriesDB,
  getTotalDebtDB,
  getUnconfirmedEntryCountDB,
  getEntryPageCountDB
} from '@/lib/entries';
import { computed, reactive, ref } from 'vue';

export const useEntryStore = defineStore('entry', () => {
  const entries = ref<IEntry[]>([]);
  const rejectedEntries = ref<IEntry[]>([]);

  const pageCount = reactive({
    entries: 0,
    rejectedEntries: 0
  })

  const totalDebt = ref<number>(0);

  const unconfirmedEntryCount = ref<number>(0);

  async function fetchEntries(page: number = 1) {
    try {
      if (entries.value.length === 0){
        pageCount.entries = (await getEntryPageCountDB(false)).data?.pageCount || 0;
      }
      entries.value.length = 0;
      entries.value.push(...(await getEntriesDB(page)));
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }

  async function fetchTotalDebt(){
    try {
      const res = await getTotalDebtDB();
      if (res.ok){
        totalDebt.value = res.data?.totalDebt ?? 0;
      }
    } catch (error) {
      console.error('Error fetching total debt:', error);
    }
  }

  async function unloadEntries(){
    entries.value.length = 0;
    rejectedEntries.value.length = 0;
    await fetchEntries();
  }

  async function fetchRejectedEntries(page: number = 1) {
    try {
      if (rejectedEntries.value.length === 0){
        pageCount.rejectedEntries = (await getEntryPageCountDB(true)).data?.pageCount || 0;
      }
      rejectedEntries.value.length = 0;
      rejectedEntries.value.push(...(await getRejectedEntriesDB(page)));
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }

  async function fetchUnconfirmedEntryCount(){
    try{
      unconfirmedEntryCount.value = (await getUnconfirmedEntryCountDB()).data?.unconfirmedEntryCount || 0;
    } catch (error) {
      console.error('Error fetching unconfirmed count: ' + error);
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

  return {lastEntries, unconfirmedEntryCount, unloadEntries, pageCount, fetchUnconfirmedEntryCount, lastRejectedEntries, addEntry, updateEntry, deleteEntry, changeNotRejectedStatus, changeRejectedStatus, fetchEntries, fetchRejectedEntries, totalDebt, fetchTotalDebt };
});
