import { defineStore } from 'pinia';
import {
  addEntryDB,
  updateEntryDB,
  getEntriesDB,
  type IEntry,
  deleteEntryDB,
  changeEntryStatusDB,
  EntryStatus,
  getTotalDebtDB,
  getUnconfirmedEntryCountDB,
  getEntryPageCountDB
} from '@/lib/entries';
import { reactive, ref } from 'vue';
import type { EntryFetchOptions } from 'shared';

export const useEntryStore = defineStore('entry', () => {
  const entries = ref<IEntry[]>([]);
  const rejectedEntries = ref<IEntry[]>([]);

  const pageCount = reactive({
    entries: 0,
    rejectedEntries: 0
  })
  const lastPage = reactive({
    page: 1,
    rejected: false
  })

  const totalDebt = ref<number>(0);

  const unconfirmedEntryCount = ref<number>(0);

  async function fetchEntries(page: number = 1, rejected: boolean = false, options?: EntryFetchOptions) {
    try {
        pageCount.entries = (await getEntryPageCountDB(false)).data?.pageCount || 0;
        const loadedEntries = await getEntriesDB(page, options);
        if (!rejected) {
          entries.value.length = 0;
          entries.value.push(...loadedEntries);
        } else {
          rejectedEntries.value.length = 0;
          rejectedEntries.value.push(...loadedEntries);
        }
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  }

  async function reloadLastPage(){
    if (lastPage.rejected) {
      fetchEntries(lastPage.page, true)
    } else {
      fetchEntries(lastPage.page, false)
    }
  }

  function setLastPage(rejected: boolean, page: number){
    lastPage.rejected = rejected;
    lastPage.page = page;
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

  async function fetchUnconfirmedEntryCount(){
    try{
      unconfirmedEntryCount.value = (await getUnconfirmedEntryCountDB()).data?.unconfirmedEntryCount || 0;
    } catch (error) {
      console.error('Error fetching unconfirmed count: ' + error);
    }
  }

  async function addEntry(newEntry: Omit<IEntry, '_id' | 'status'>) {
    const addedEntry = await addEntryDB(newEntry);
    if (!addedEntry) {
      throw new Error("Error adding entry");
    }
    reloadLastPage();
  }

  async function updateEntry(entryId: string, newEntry: Omit<IEntry, '_id' | 'status'>) {
    const updatedEntry = await updateEntryDB(entryId, newEntry);
    if (!updatedEntry) {
      throw new Error("Error updating entry");
    }
    reloadLastPage();
  }

  async function deleteEntry(entryId: string) {
    const result = await deleteEntryDB(entryId);
    if (!result) {
      throw new Error("Error deleting entry");
    }
    reloadLastPage();
  }

  async function changeNotRejectedStatus(entryId: string, newStatus: EntryStatus) {
    const result = await changeEntryStatusDB(entryId, newStatus);
    if (!result.ok) {
      throw new Error("Error patching entry");
    }
      reloadLastPage();
  }

  async function changeRejectedStatus(entryId: string, newStatus: EntryStatus) {
    const result = await changeEntryStatusDB(entryId, newStatus);
    if (!result.ok) {
      throw new Error("Error patching entry");
    }

    reloadLastPage();
  }

  return {entries, unconfirmedEntryCount, unloadEntries, pageCount, fetchUnconfirmedEntryCount, rejectedEntries, addEntry, updateEntry, deleteEntry, changeNotRejectedStatus, changeRejectedStatus, fetchEntries, totalDebt, fetchTotalDebt, setLastPage };
});
