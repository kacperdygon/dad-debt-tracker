import { DB } from '@/firebase/config.ts';
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import type { Entry } from '@/lib/entries.ts';
import Cookies from 'js-cookie';
import { getAuth, signInAnonymously } from "firebase/auth";

export const getEntriesFromFirestore = async (): Promise<Entry[]> => {

  const entriesCollection = collection(DB, 'entries');

  const snapshot = await getDocs(entriesCollection)

  return snapshot.docs.map(doc => {
    return { ...doc.data(), id: doc.id } as Entry
  });
}

export const addEntryToFirestore = async (entry: Omit<Entry, 'id'>): Promise<string> => {

  const entriesCollection = collection(DB, 'entries');
  const docRef = await addDoc(entriesCollection, entry);

  return docRef.id;

}

export const editEntryFromFirestore = async (entryId: string, entry: Omit<Entry, 'id'>): Promise<void> => {
  await updateDoc(doc(DB, 'entries', entryId), {...entry});
}

export const deleteEntryFromFirestore = async (entryId: string): Promise<void> => {
  await deleteDoc(doc(DB, 'entries', entryId ));
}

export async function login(enteredPin: string): Promise<boolean> {
  const docRef = doc(DB, "roles", enteredPin);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    return false;
  }
  const auth = getAuth();
  const userCredential = await signInAnonymously(auth);
  const uid = userCredential.user.uid;

  Cookies.set("pin", enteredPin);

  return true;
}

export async function getRole(): Promise<string | null> {
  const userPin = Cookies.get('pin');
  if (!userPin) {
    return null;
  }
  const docRef = doc(DB, "roles", userPin);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data().role as string;
}