import { DB } from '@/firebase/config.ts';
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import type { Entry } from '@/lib/entries.ts';

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