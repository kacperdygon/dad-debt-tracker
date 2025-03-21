import { fetchData } from './database';

export interface IAuth{
  pin: string,
  role: string,
}

export async function signIn(pin: string): Promise<number> {
  const res = await fetchData<IAuth>("api/auth/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pin: pin
    }),
    credentials: "include",
  });
  return res.status;
}

export async function isSignedIn(): Promise<boolean> {
  const res = await fetchData<IAuth>("api/auth/verify-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({  }),
    credentials: "include",
  });

  return res.ok;

}