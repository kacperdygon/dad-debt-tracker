import { type EntryFetchOptions } from 'shared';
import { fetchData, type FetchResponse } from './database';

export enum EntryStatus {
  CONFIRMED = 'confirmed',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export interface IEntry {
  _id: string;
  title: string;
  timestamp: Date;
  balanceChange: number;
  status: string;
}

export async function getEntriesDB(page: number = 1, options?: EntryFetchOptions): Promise<IEntry[]> {

  const params = new URLSearchParams({
    page: page.toString(),
    rejected: options ? String(options.showRejected) : String(false),
    sortBy: options ? options.sortBy : 'DATE_DESC',
    filterBySon: options ? String(options.filter.author.son) : String(true),
    filterByDad: options ? String(options.filter.author.dad) : String(true),
    filterByConfirmed: options ? String(options.filter.status?.confirmed) : String(true),
    filterByPending: options ? String(options.filter.status?.pending) : String(true),
    filterByPositive: options ? String(options.filter.sign.positive) : String(true),
    filterByNegative: options ? String(options.filter.sign.negative) : String(true)
});

console.log(`api/entries?${params}`);



  const res = await fetchData<{ message: string, entries: IEntry[] }>(`api/entries?${params}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    return [];
  }
  return res.data?.entries as IEntry[];
}

export async function addEntryDB(newEntry: Omit<IEntry, '_id' | 'status'>): Promise<IEntry | null> {
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

export async function updateEntryDB(entryId: string, newEntry: Omit<IEntry, '_id' | 'status'>): Promise<IEntry | null> {
  const res = await fetchData<{ message: string, entry: IEntry }>(`api/entries/${entryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patchType: 'updateData',
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

export async function changeEntryStatusDB(entryId: string, status: EntryStatus): Promise<FetchResponse<{ entry: IEntry }>> {
  return await fetchData<{ entry: IEntry }>(`api/entries/${entryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patchType: 'changeStatus',
      newStatus: status,
    }),
    credentials: "include",
  });
}

export async function getTotalDebtDB(): Promise<FetchResponse<{ totalDebt: number }>> {
  return await fetchData<{ totalDebt: number }>(`api/entries/total-debt`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
}

export async function getUnconfirmedEntryCountDB(): Promise<FetchResponse<{ unconfirmedEntryCount: number }>> {
  return await fetchData<{ unconfirmedEntryCount: number }>(`api/entries/unconfirmed-count`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
}

export async function getEntryPageCountDB(rejected: boolean): Promise<FetchResponse<{ pageCount: number }>>{
  const result = await fetchData<{ pageCount: number }>(`api/entries/page-count${rejected ? '/?rejected=true' : ''}`  , {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return result;
}

export async function getEntryPosition(id: string): Promise<FetchResponse<{
  page: number,
  positionOnPage: number,
  rejected: boolean
}>>{
  const result = await fetchData<{
    page: number,
    positionOnPage: number,
    rejected: boolean
  }>(`api/entries/position/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
  return result;
}