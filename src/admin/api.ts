const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function getToken() {
  return localStorage.getItem("admin_token");
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Accept", "application/json");

  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(res.status, data?.message || "Request failed");
  }
  return data as T;
}

export async function apiJson<T>(path: string, body: unknown, options: RequestInit = {}) {
  return apiFetch<T>(path, {
    ...options,
    method: options.method || "POST",
    headers: { ...(options.headers || {}), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

