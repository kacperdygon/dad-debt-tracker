import { defineStore } from 'pinia';
import { type Entry, getEntriesFromLocalStorage, saveEntries } from '@/lib/entries.ts';
import { computed, ref } from 'vue';

export const useEntryStore = defineStore('entry', () => {
  const entries = ref(getEntriesFromLocalStorage());

  const lastEntries = computed(() => {
    return [...entries.value]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      // .slice(0, 3);
  });

  const totalDebt = computed(() => {
    let totalDebt = 0;
    for (const entry of entries.value) {
      totalDebt += entry.balanceChange;
    }
    return totalDebt;
  });

  function addEntry(newEntry: Entry) {
    if (!newEntry) {
      return;
    }
    if (!(newEntry.date && newEntry.balanceChange && newEntry.title)) {
      return;
    }
    entries.value.push(newEntry);
    saveEntries(entries.value);
  }

  function editEntry(targetEntry: Entry, newEntry: Entry) {
    if (!newEntry) {
      return;
    }
    if (!(newEntry.date && newEntry.balanceChange && newEntry.title)) {
      return;
    }
    const matchingIndex = entries.value.findIndex((entry) => entry === targetEntry);
    if (matchingIndex !== -1) {
      entries.value.splice(matchingIndex, 1, newEntry);
    }
    saveEntries(entries.value);
  }

  function deleteEntry(targetEntry: Entry) {
    const matchingIndex = entries.value.indexOf(targetEntry);
    entries.value.splice(matchingIndex, 1);
    saveEntries(entries.value);
  }

  return { entries, lastEntries, totalDebt, addEntry, editEntry, deleteEntry };
});
