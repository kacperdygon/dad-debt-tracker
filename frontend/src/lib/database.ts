export interface FetchResponse<T = unknown> {
  message: string;
  status: number;
  ok: boolean;
  data: T | null;
}

export async function fetchData<T = unknown>(url: string, options: RequestInit = {}): Promise<FetchResponse<T>> {

  try {

    const urlStart = import.meta.env.PROD ? import.meta.env.VITE_BACKEND_URL : window.location.origin; // proxy works in dev mode

    const res = await fetch(`${urlStart}/${url}`, options);

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