import type { IActionResponse } from 'shared';
import { fetchData, type FetchResponse } from '@/lib/database';

export async function getActionsDB(page: number = 1, entryId?: string): Promise<FetchResponse<{ actions: IActionResponse[], pageCount: number }>> {

  const URL = constructURL(page, entryId);

  return await fetchData<{ actions: IActionResponse[], pageCount: number }>(URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

}

function constructURL(page: number, entryId?: string): string {
  let params = 'api/actions';
  if (entryId){
    params += `/${entryId}`;
  }
  params += `?page=${page}`;

  return params;
}