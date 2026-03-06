export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  return fetch(url, {
    ...options,
    credentials: "include", // ⭐ THIS IS THE KEY
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
}
