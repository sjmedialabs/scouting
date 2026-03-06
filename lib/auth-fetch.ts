export async function authFetch(url: string, options: RequestInit = {}) {
  if (typeof window === "undefined") {
    throw new Error("authFetch client-only");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Auth token missing");
  }

  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}
