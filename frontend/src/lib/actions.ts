import type { IActionResponse } from 'shared/dist';
import { fetchData } from '@/lib/database.ts';

export async function getActionsDB(): Promise<IActionResponse[]> {
  const res = await fetchData<{ message: string, actions: IActionResponse[] }>("api/actions", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    return [];
  }
  return res.data?.actions as IActionResponse[];
}