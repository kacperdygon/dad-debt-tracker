import type { IActionResponse } from 'shared/dist';
import { fetchData, type FetchResponse } from '@/lib/database';

export async function getActionsDB(page: number = 1): Promise<IActionResponse[]> {
  const res = await fetchData<{ message: string, actions: IActionResponse[] }>(`api/actions?page=${page}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    return [];
  }
  return res.data?.actions as IActionResponse[];
}

export async function getActionPageCountDB(): Promise<FetchResponse<{ actionPageCount: number }>>{
  const result = await fetchData<{ actionPageCount: number }>(`api/actions/page-count`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return result;
}