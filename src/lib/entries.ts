import { useEntryStore } from '@/store/entries.ts'

export interface Entry {
  title: string
  date: Date
  balanceChange: number
}

export const addEntry = (newEntry: Entry) => {
  const entries = getEntriesFromStore()
  if (!newEntry) {
    return
  }
  if (!(newEntry.date && newEntry.balanceChange && newEntry.title)) {
    return
  }
  entries.push(newEntry)
  saveEntries(entries)
}

export const editEntry = (targetEntry: Entry, newEntry: Entry) => {
  const entries = getEntriesFromStore()
  if (!newEntry) {
    return
  }
  if (!(newEntry.date && newEntry.balanceChange && newEntry.title)) {
    return
  }
  const matchingIndex = entries.indexOf(targetEntry)
  entries[matchingIndex] = newEntry
  saveEntries(entries)
}

export const deleteEntry = (targetEntry: Entry) => {
  const entries = getEntriesFromStore()
  const matchingIndex = entries.indexOf(targetEntry)
  entries.splice(matchingIndex, 1)
  saveEntries(entries)
}

export const getEntriesFromLocalStorage = (): Entry[] => {
  const storedEntries = localStorage.getItem('entries')
  let parsedStoredEntries

  if (storedEntries) {
    parsedStoredEntries = JSON.parse(storedEntries)
  } else {
    parsedStoredEntries = []
  }

  return parsedStoredEntries
}

const getEntriesFromStore = (): Entry[] => {
  const entryStore = useEntryStore()
  return entryStore.entries
}

export const saveEntries = (entries: Entry[]) => {
  localStorage.setItem('entries', JSON.stringify(entries))
}
