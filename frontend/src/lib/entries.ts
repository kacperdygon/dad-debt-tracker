import { fetchData } from './database';

export interface IEntry {
  _id: string;
  title: string;
  timestamp: Date;
  balanceChange: number;
  confirmed?: boolean;
}

export async function getEntriesDB(): Promise<IEntry[]> {
  const res = await fetchData<{ message: string, entries: IEntry[] }>("api/entries", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    return [];
  }
  return res.data?.entries as IEntry[];
}

export async function addEntryDB(newEntry: Omit<IEntry, '_id'>): Promise<IEntry | null> {
  const res = await fetchData<{ message: string, entry: IEntry }>("api/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...newEntry,
    }),
    credentials: "include",
  });

  return res.data?.entry ?? null;

}

export async function updateEntryDB(entryId: string, newEntry: Omit<IEntry, '_id'>): Promise<IEntry | null> {
  const res = await fetchData<{ message: string, entry: IEntry }>(`api/entries/${entryId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...newEntry,
    }),
    credentials: "include",
  });

  return res.data?.entry ?? null;

}

export async function deleteEntryDB(entryId: string): Promise<boolean> {
  const res = await fetchData<{ message: string, entry: IEntry }>(`api/entries/${entryId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  return res.ok;
}

export async function confirmEntryDB(entryId: string): Promise<boolean> {
  const res = await fetchData<{ message: string, entry: IEntry }>(`api/entries/${entryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patchType: 'confirmEntry'
    }),
    credentials: "include",
  });

  return res.ok;
}