import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { FetchResponse } from '@/lib/database.ts';
import { getRole, signInDB, signOutDB } from '@/lib/auth.ts';

export const useAuthStore = defineStore('auth', () => {
  const role = ref<string | null>(null);

  //for router and app mount
  const isSignedIn = async () => {
    role.value = await getRole();
    return !!role.value;
  }

  async function signIn(pin: string): Promise<FetchResponse<{ role: string }>> {
    const res = await signInDB(pin);

    if (res.ok
    && res.data != null // res data always not null when res is ok
    ) {
      role.value = res.data.role
    }
    return res;
  }

  async function signOut(): Promise<FetchResponse> {
    const res = await signOutDB();

    if (res.ok
      && res.data != null // res data always not null when res is ok
    ) {
      role.value = null
    }
    return res;
  }

  return { role, isSignedIn, signIn, signOut };
});
