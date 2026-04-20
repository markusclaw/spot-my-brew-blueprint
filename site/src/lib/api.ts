const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://spotmybrew-api.workers.dev";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((error as { error?: string }).error || "API error");
  }
  return res.json() as Promise<T>;
}

// Convenience methods
export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body: unknown) => apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) => apiFetch<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  del: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};
