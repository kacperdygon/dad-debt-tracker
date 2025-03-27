import { fetchData, type FetchResponse } from './database';

export interface IAuth{
  pin: string,
  role: string,
}

export async function signIn(pin: string): Promise<FetchResponse> {
  return await fetchData<IAuth>("api/auth/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pin: pin
    }),
    credentials: "include",
  });
}

export async function signOut(): Promise<FetchResponse> {
  return await fetchData<IAuth>("api/auth/sign-out", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
}

export async function isSignedIn(): Promise<boolean> {
  const res = await fetchData<IAuth>("api/auth/verify-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return res.ok;
}

export async function getRole(): Promise<string | undefined> {
  const res = await fetchData<IAuth>("api/auth/verify-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })

  return res.data?.role || undefined;
}