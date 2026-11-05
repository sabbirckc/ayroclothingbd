const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('clothspace_token');
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('clothspace_token', token);
  }
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('clothspace_token');
    localStorage.removeItem('clothspace_user');
  }
}

  export async function apiRequest<T = any>(
    endpoint: string,
    options: FetchOptions = {},
    retry = true
  ): Promise<T> {
    const { params, headers, ...rest } = options;

    let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    let token = getToken();

    // If token is missing in localStorage, attempt proactive fetch from same-origin route
    if (!token && typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/auth/token');
        if (res.ok) {
          const data = await res.json();
          if (data?.token) {
            token = data.token;
            setToken(data.token);
          }
        }
      } catch {
        // Continue
      }
    }

    const reqHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    };

    if (token) {
      reqHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...rest,
      headers: reqHeaders,
      credentials: 'include',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // If 401 occurs and retry is allowed, re-fetch fresh session token from same-origin Next.js and retry once
      if (response.status === 401 && retry && typeof window !== 'undefined') {
        try {
          const res = await fetch('/api/auth/token');
          if (res.ok) {
            const freshData = await res.json();
            if (freshData?.token && freshData.token !== token) {
              setToken(freshData.token);
              return await apiRequest<T>(endpoint, options, false);
            }
          }
        } catch {
          // Fall through to throw
        }
      }

      const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data;
  }

  export const api = {
    get: <T = any>(endpoint: string, options?: FetchOptions) =>
      apiRequest<T>(endpoint, { ...options, method: 'GET' }),
    post: <T = any>(endpoint: string, body?: any, options?: FetchOptions) =>
      apiRequest<T>(endpoint, {
        ...options,
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      }),
    put: <T = any>(endpoint: string, body?: any, options?: FetchOptions) =>
      apiRequest<T>(endpoint, {
        ...options,
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      }),
    patch: <T = any>(endpoint: string, body?: any, options?: FetchOptions) =>
      apiRequest<T>(endpoint, {
        ...options,
        method: 'PATCH',
        body: body ? JSON.stringify(body) : undefined,
      }),
    delete: <T = any>(endpoint: string, options?: FetchOptions) =>
      apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
  };

