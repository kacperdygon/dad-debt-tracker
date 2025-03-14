import type { Entry } from '@/lib/entries.ts';
import Cookies from 'js-cookie';

export enum Role {
  Admin= "admin"
}

export const getEntriesFromFirestore = async (): Promise<Entry[]> => {

}

export const addEntryToFirestore = async (entry: Omit<Entry, 'id'>): Promise<string> => {


}

export const editEntryFromFirestore = async (entryId: string, entry: Omit<Entry, 'id'>): Promise<void> => {

}

export const deleteEntryFromFirestore = async (entryId: string): Promise<void> => {

}

export async function login(enteredPin: string): Promise<boolean> {

  Cookies.set("pin", enteredPin);

  return true;
}

export async function getRole(): Promise<string | null> {
  const userPin = Cookies.get('pin');
  if (!userPin) {
    return null;
  }


}