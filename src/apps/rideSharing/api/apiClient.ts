import * as SecureStore from 'expo-secure-store';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const BASE_URL =
  process.env.EXPO_PUBLIC_RIDE_SHARING_API_URL ??
  'https://api.example.com/ride-sharing';

const TOKEN_KEY = 'ride_sharing_auth_token';
const REFRESH_TOKEN_KEY = 'ride_sharing_refresh_token';

// ---------------------------------------------------------------------------
// Custom error class with typed metadata
// ---------------------------------------------------------------------------
export class ApiError extends Error {
  status: number;
  code?: string;
  data?: unknown;

  constructor(message: string, status: number, code?: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

// ---------------------------------------------------------------------------
// Token helpers (using expo-secure-store for sensitive data – never AsyncStorage)
// ---------------------------------------------------------------------------
export const tokenManager = {
  getToken: () => SecureStore.getItemAsync(TOKEN_KEY),
  setToken: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
  removeToken: () => SecureStore.deleteItemAsync(TOKEN_KEY),
  getRefreshToken: () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) =>
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: () => SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  clearAll: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};

// ---------------------------------------------------------------------------
// Refresh‑token mutex – prevents multiple concurrent refresh calls
// ---------------------------------------------------------------------------
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(newToken: string) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

async function refreshAuthToken(): Promise<string> {
  const refreshToken = await tokenManager.getRefreshToken();
  if (!refreshToken) throw new ApiError('No refresh token', 401, 'NO_REFRESH_TOKEN');

  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    await tokenManager.clearAll();
    throw new ApiError('Session expired. Please log in again.', 401, 'SESSION_EXPIRED');
  }

  const data = await response.json();
  await tokenManager.setToken(data.token);
  await tokenManager.setRefreshToken(data.refreshToken);
  return data.token;
}

// ---------------------------------------------------------------------------
// Core fetch wrapper with auth, error handling & token refresh
// ---------------------------------------------------------------------------
interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Set to `true` to skip auth header (e.g. for login/register). */
  skipAuth?: boolean;
  /** Set to `true` if this is a token-refresh retry (prevents infinite loop). */
  _isRetry?: boolean;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, skipAuth, _isRetry, ...fetchOptions } = options;

  // ── Build headers ──────────────────────────────────────────────────
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = await tokenManager.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  // ── Make the request ───────────────────────────────────────────────
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    // Network error (no internet, DNS failure, timeout, etc.)
    throw new ApiError(
      'Network error – please check your connection.',
      0,
      'NETWORK_ERROR',
    );
  }

  // ── Handle 401 → silent token refresh ──────────────────────────────
  if (response.status === 401 && !_isRetry && !skipAuth) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshAuthToken();
        onTokenRefreshed(newToken);

        // Retry original request with new token
        return request<T>(path, { ...options, _isRetry: true });
      } catch {
        await tokenManager.clearAll();
        throw new ApiError(
          'Session expired. Please log in again.',
          401,
          'SESSION_EXPIRED',
        );
      } finally {
        isRefreshing = false;
      }
    }

    // Another request is already refreshing – queue this one
    return new Promise<T>((resolve, reject) => {
      addRefreshSubscriber(async () => {
        try {
          const result = await request<T>(path, { ...options, _isRetry: true });
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  // ── Parse error responses ──────────────────────────────────────────
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(
      (errorBody as Record<string, string>)?.message ??
      `Request failed with status ${response.status}`,
      response.status,
      (errorBody as Record<string, string>)?.code,
      errorBody,
    );
  }

  // ── Handle empty responses (204 No Content) ────────────────────────
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Convenience methods (mirroring a typical HTTP client API)
// ---------------------------------------------------------------------------
const apiClient = {
  get: <T>(path: string, params?: Record<string, unknown>) => {
    const url = params ? `${path}?${buildQueryString(params)}` : path;
    return request<T>(url, { method: 'GET' });
  },

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body }),

  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body }),

  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  }
  return searchParams.toString();
}

export default apiClient;
