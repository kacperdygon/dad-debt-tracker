import type { IActionResponse } from 'shared';
import { fetchData, type FetchResponse } from '@/lib/database';

export async function getActionsDB(page: number = 1): Promise<FetchResponse<{ actions: IActionResponse[], pageCount: number }>> {
  const res = await fetchData<{ actions: IActionResponse[], pageCount: number }>(`api/actions?page=${page}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  return res;

}