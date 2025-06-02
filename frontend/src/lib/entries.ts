import { type EntryFetchOptions, type EntryStatus, type IEntry, SortBy } from 'shared';
import { fetchData, type FetchResponse } from './database';


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


  const res = await fetchData<{ message: string, entries: IEntry[], pageCount: number }>(`api/entries?${params}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  return res;
}

function constructParams(page: number, options: EntryFetchOptions): URLSearchParams{
  const params = new URLSearchParams({
    page: page.toString(),
    sortBy: options.sortBy,
});

  params.append('author', options.filter.author.join(','));
  params.append('sign', options.filter.sign.join(','));
  params.append('status', options.filter.status.join(','));

  if (options.time?.startDate) {
    const parsedDate = options.time.startDate.toISOString().split('T')[0];
    params.append('startDate', parsedDate);
  }
  if (options.time?.endDate) {
    const parsedDate = options.time.endDate.toISOString().split('T')[0];
    params.append('endDate', parsedDate);
  }

  return params
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