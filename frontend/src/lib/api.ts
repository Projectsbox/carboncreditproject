export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function api<T>(path: string, options: { method?: HttpMethod; body?: unknown; token?: string } = {}): Promise<T> {
  const { method = 'GET', body, token } = options;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}


