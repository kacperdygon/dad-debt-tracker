import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { FetchResponse } from '@/lib/database.ts';
import { getRole, signInDB, signOutDB } from '@/lib/auth';

export const useAuthStore = defineStore('auth', () => {
  const userRole = ref<string | null>(null);

  //for router and app mount
  const isSignedIn = async () => {
    userRole.value = await getRole();
    return !!userRole.value;
  }

  async function reloadRole() {
    userRole.value = await getRole();
  }

  async function signIn(pin: string): Promise<FetchResponse<{ role: string }>> {
    const res = await signInDB(pin);

    if (res.ok
    && res.data != null // res data always not null when res is ok
    ) {
      userRole.value = res.data.role
    }
    return res;
  }

  async function signOut(): Promise<FetchResponse> {
    const res = await signOutDB();

    if (res.ok
      && res.data != null // res data always not null when res is ok
    ) {
      userRole.value = null
    }
    return res;
  }

  return { userRole, isSignedIn, signIn, signOut, reloadRole };
});
