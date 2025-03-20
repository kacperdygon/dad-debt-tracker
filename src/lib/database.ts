interface FetchResponse<T> {
  data: T | null;
  status: number;
  ok: boolean;
}

export async function fetchData<T = unknown>(url: string, options: RequestInit = {}): Promise<FetchResponse<T>> {
  if (!import.meta.env.VITE_BACKEND_URL) {
    throw new Error('No backend url set');
  }

  try {

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${url}`, options);
    const status = res.status;
    const ok = res.ok;

    if (!res.ok){
      return { data: null, status: status, ok: ok }
    }

    const data = await res.json() as T;

    return { data: data, status: status, ok: ok };

  } catch (error) {
    throw new Error("Fetch error: " + error);
  }
}