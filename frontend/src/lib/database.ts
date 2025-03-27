export interface FetchResponse<T = unknown> {
  message: string;
  status: number;
  ok: boolean;
  data: T | null;
}

export async function fetchData<T = unknown>(url: string, options: RequestInit = {}): Promise<FetchResponse<T>> {
  if (!import.meta.env.VITE_BACKEND_URL) {
    throw new Error('No backend url set');
  }

  try {

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${url}`, options);
    const status = res.status;
    const ok = res.ok;

    const body = await res.json();

    return {
      message: body.message,
      status: res.status,
      ok: res.ok,
      data: body.data,
    }

  } catch (error) {
    throw new Error("Fetch error: " + error);
  }
}