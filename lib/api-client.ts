// API Client for frontend data fetching

const API_BASE = "";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_BASE}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const response = await authFetch(url, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: (email: string, password: string, role: string) =>
    fetchAPI<{ success: boolean; user: any; token: string }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
      },
    ),

  register: (data: {
    email: string;
    password: string;
    name: string;
    role: string;
    companyName?: string;
  }) =>
    fetchAPI<{ success: boolean; user: any; token: string }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    ),

  logout: () =>
    fetchAPI<{ success: boolean }>("/api/auth/logout", { method: "POST" }),

  me: () => fetchAPI<{ user: any; provider?: any }>("/api/auth/me"),
};

// Projects API
export const projectsAPI = {
  list: (params?: {
    clientId?: string;
    status?: string;
    category?: string;
    page?: string;
    limit?: string;
  }) =>
    fetchAPI<{ projects: any[]; pagination: any }>("/api/projects", { params }),

  get: (id: string) => fetchAPI<{ project: any }>(`/api/projects/${id}`),

  create: (data: {
    title: string;
    description: string;
    category: string;
    budget?: string;
    timeline?: string;
    skills?: string[];
  }) =>
    fetchAPI<{ success: boolean; project: any }>("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<any>) =>
    fetchAPI<{ success: boolean; project: any }>(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI<{ success: boolean }>(`/api/projects/${id}`, { method: "DELETE" }),
};

// Proposals API
export const proposalsAPI = {
  list: (params?: {
    projectId?: string;
    status?: string;
    page?: string;
    limit?: string;
  }) =>
    fetchAPI<{ proposals: any[]; pagination: any }>("/api/proposals", {
      params,
    }),

  get: (id: string) => fetchAPI<{ proposal: any }>(`/api/proposals/${id}`),

  create: (data: {
    projectId: string;
    proposedBudget: number;
    proposedTimeline?: string;
    coverLetter: string;
  }) =>
    fetchAPI<{ success: boolean; proposal: any }>("/api/proposals", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<any>) =>
    fetchAPI<{ success: boolean; proposal: any }>(`/api/proposals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI<{ success: boolean }>(`/api/proposals/${id}`, {
      method: "DELETE",
    }),
};

// Providers API
export const providersAPI = {
  list: (params?: {
    location?: string;
    service?: string;
    minRating?: string;
    featured?: string;
    page?: string;
    limit?: string;
  }) =>
    fetchAPI<{ providers: any[]; pagination: any }>("/api/providers", {
      params,
    }),

  get: (id: string) =>
    fetchAPI<{ provider: any; reviews: any[] }>(`/api/providers/${id}`),

  update: (id: string, data: Partial<any>) =>
    fetchAPI<{ success: boolean; provider: any }>(`/api/providers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Reviews API
export const reviewsAPI = {
  list: (params?: { providerId?: string; page?: string; limit?: string }) =>
    fetchAPI<{ reviews: any[]; pagination: any }>("/api/reviews", { params }),

  create: (data: {
    providerId: string;
    projectId: string;
    rating: number;
    title: string;
    content: string;
    qualityRating?: number;
    scheduleRating?: number;
    costRating?: number;
    willingToReferRating?: number;
    pros?: string[];
    cons?: string[];
  }) =>
    fetchAPI<{ success: boolean; review: any }>("/api/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// CMS API
export const cmsAPI = {
  getHero: () => fetchAPI<{ content: any }>("/api/cms/hero"),

  updateHero: (data: any) =>
    fetchAPI<{ success: boolean; content: any }>("/api/cms/hero", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getCategories: () => fetchAPI<{ categories: any[] }>("/api/cms/categories"),
};

// Users API (Admin)
export const usersAPI = {
  list: (params?: { role?: string; page?: string; limit?: string }) =>
    fetchAPI<{ users: any[]; pagination: any }>("/api/users", { params }),

  get: (id: string) => fetchAPI<{ user: any }>(`/api/users/${id}`),

  update: (id: string, data: Partial<any>) =>
    fetchAPI<{ success: boolean; user: any }>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchAPI<{ success: boolean }>(`/api/users/${id}`, { method: "DELETE" }),
};
