export interface IEntry {
  _id: string;
  title: string;
  timestamp: Date;
  balanceChange: number;
}

export async function fetchEntries(): Promise<IEntry[] | null> {
  if (!process.env.BACKEND_URL) {
    throw new Error('No backend url set');
  }
  try {
    const res = await fetch(process.env.BACKEND_URL)

    if (!res.ok) {
      console.error('Fetch error: ' + res.status);
      return null;
    }

    const { entries } = await res.json();

    return entries;

  } catch (error) {
    throw new Error("Fetch error:" + error);
  }

}