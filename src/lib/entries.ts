export interface IEntry {
  _id: string;
  title: string;
  timestamp: Date;
  balanceChange: number;
}

export const getEntriesFromLocalStorage = (): IEntry[] => {
  const storedEntries = localStorage.getItem('entries');
  let parsedStoredEntries;

  if (storedEntries) {
    parsedStoredEntries = JSON.parse(storedEntries);
  } else {
    parsedStoredEntries = [];
  }

  return parsedStoredEntries;
};

export const saveEntries = (entries: IEntry[]) => {
  localStorage.setItem('entries', JSON.stringify(entries));
};
