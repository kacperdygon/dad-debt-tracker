import type { IActionResponse } from 'shared';
import { fetchData, type FetchResponse } from '@/lib/database';

export async function getActionsDB(page: number = 1, entryId?: string): Promise<FetchResponse<{ actions: IActionResponse[], pageCount: number }>> {

  const URL = constructURL(page, entryId);
  console.log(URL);

  const res = await fetchData<{ actions: IActionResponse[], pageCount: number }>(URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  return res;

}

function constructURL(page: number, entryId?: string): string {
  let params = 'api/actions';
  if (entryId){
    params += `/${entryId}`;
  }
  params += `?page=${page}`;

  return params;
}