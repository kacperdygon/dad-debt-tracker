export interface Entry {
  title: string;
  date: Date;
  balanceChange: number;
}

export const getEntriesFromLocalStorage = (): Entry[] => {
  const storedEntries = localStorage.getItem('entries');
  let parsedStoredEntries;

  if (storedEntries) {
    parsedStoredEntries = JSON.parse(storedEntries);
  } else {
    parsedStoredEntries = [];
  }

  return parsedStoredEntries;
};

export const saveEntries = (entries: Entry[]) => {
  localStorage.setItem('entries', JSON.stringify(entries));
};
