import { type EntryFetchOptions, type EntryStatus, type IEntry, SortBy } from 'shared';
import { fetchData, type FetchResponse } from '@/lib/database';
import { constructParams } from '@/lib/entries/fetchOptionsHelper';


const DEFAULT_OPTIONS = {
  sortBy: SortBy.DATE_DESC,
  filter: {
    author: ['dad', 'son'],
    status: ['confirmed', 'pending'],
    sign: ['positive', 'negative']
  },
  time: {}
}

export async function getEntriesDB(page: number = 1, options: EntryFetchOptions = DEFAULT_OPTIONS): Promise<FetchResponse<{
  entries: IEntry[],
  pageCount: number
}>> {

  const params = constructParams(page, options);


  return await fetchData<{ message: string, entries: IEntry[], pageCount: number }>(`api/entries?${params}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
}

export async function addEntryDB(newEntry: Omit<IEntry, '_id' | 'status'>): Promise<FetchResponse<{entry: IEntry}>> {
  return await fetchData<{ entry: IEntry }>("api/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...newEntry,
    }),
    credentials: "include",
  });
}

export async function updateEntryDB(entryId: string, newEntry: Omit<IEntry, '_id' | 'status'>): Promise<FetchResponse<{entry: IEntry}>> {
  return await fetchData<{ message: string, entry: IEntry }>(`api/entries/${entryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      patchType: 'updateData',
      ...newEntry,
    }),
    credentials: "include",
  });
}

export async function deleteEntryDB(entryId: string): Promise<FetchResponse> {
  return await fetchData(`api/entries/${entryId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
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
  return await fetchData<{ pageCount: number }>(`api/entries/page-count${rejected ? '/?rejected=true' : ''}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
}

export async function getEntryPosition(id: string): Promise<FetchResponse<{
  page: number,
  positionOnPage: number,
  rejected: boolean
}>>{
  return await fetchData<{
    page: number,
    positionOnPage: number,
    rejected: boolean
  }>(`api/entries/position/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
}