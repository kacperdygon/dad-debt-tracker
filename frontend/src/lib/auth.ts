import { fetchData, type FetchResponse } from './database';

export interface IAuth{
  pin: string,
  role: string,
}

export async function signInDB(pin: string): Promise<FetchResponse<{role: string}>> {
  return await fetchData<{role: string}>("api/auth/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pin: pin
    }),
    credentials: "include",
  });
}

export async function signOutDB(): Promise<FetchResponse> {
  return await fetchData("api/auth/sign-out", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
}

export async function getRole(): Promise<string | null> {
  const res = await fetchData<IAuth>("api/auth/verify-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })

  return res.data?.role || null;
}