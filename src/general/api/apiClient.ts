import axios, { AxiosError, AxiosHeaders, AxiosInstance, AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { apiConfig } from '../config/apiConfig';
import { resetToAuth } from '../navigation/rootNavigation';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const TOKEN_KEY = 'super_app_auth_token';
const REFRESH_TOKEN_KEY = 'super_app_refresh_token';
let isHandlingSessionExpiry = false;

function redirectToAuthWithRetry() {
  const navigated = resetToAuth();
  if (navigated) {
    return;
  }

  // Navigation container may not be ready at the exact interceptor tick.
  // Retry briefly to ensure we still land on shared Home.
  let attempts = 0;
  const maxAttempts = 8;
  const timer = setInterval(() => {
    attempts += 1;
    const done = resetToAuth();
    if (done || attempts >= maxAttempts) {
      clearInterval(timer);
    }
  }, 150);
}

function toLowerCaseMessage(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .join(' ')
      .toLowerCase();
  }

  if (typeof value === 'string') {
    return value.toLowerCase();
  }

  return '';
}

type ApiErrorResponseData = {
  message?: string | string[];
  code?: string;
  error?: string;
};

type ExtendedAxiosRequestConfig = AxiosRequestConfig & {
  skipSessionExpiryHandling?: boolean;
};

function hasMissingAuthHeaderSignal(responseData?: ApiErrorResponseData): boolean {
  const messageText = toLowerCaseMessage(responseData?.message);
  const errorText = toLowerCaseMessage(responseData?.error);
  const codeText = toLowerCaseMessage(responseData?.code);
  const combinedAuthText = `${messageText} ${errorText} ${codeText}`.trim();

  return (
    combinedAuthText.includes('auth header is missing') ||
    combinedAuthText.includes('authorization header is missing')
  );
}

function isLikelyAuthExpiry(status: number, responseData?: ApiErrorResponseData): boolean {
  const messageText = toLowerCaseMessage(responseData?.message);
  const errorText = toLowerCaseMessage(responseData?.error);
  const codeText = toLowerCaseMessage(responseData?.code);
  const combinedAuthText = `${messageText} ${errorText} ${codeText}`.trim();

  const hasAuthFailureSignal =
    combinedAuthText.includes('token session expired') ||
    combinedAuthText.includes('session expired') ||
    combinedAuthText.includes('invalid token') ||
    combinedAuthText.includes('token expired') ||
    combinedAuthText.includes('jwt expired') ||
    combinedAuthText.includes('auth header is missing') ||
    combinedAuthText.includes('authorization header is missing') ||
    combinedAuthText.includes('unauthorized');

  // 401/419/440 are strong authentication/session-expiry signals.
  if ([401, 419, 440].includes(status)) {
    return true;
  }

  // 403 is often business authorization; only treat it as auth-expiry when
  // backend text also explicitly indicates an expired/invalid session/token.
  if (status === 403) {
    return hasAuthFailureSignal;
  }

  // Some business-validation responses can include words like "unauthorized"
  // without meaning the auth session is expired.
  // Only treat 400 as session expiry when auth headers are explicitly missing.
  if (status === 400) {
    return hasMissingAuthHeaderSignal(responseData);
  }

  return false;
}

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
// Axios instance with auth header + base config
// ---------------------------------------------------------------------------
const httpClient: AxiosInstance = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(async (config) => {
  if (config.headers && (config.headers as Record<string, string>)['x-skip-auth']) {
    delete (config.headers as Record<string, string>)['x-skip-auth'];
    return config;
  }

  const token = await tokenManager.getToken();

  if (token) {
    const headers = AxiosHeaders.from(config.headers ?? {});
    headers.set('Authorization', `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status ?? 0;
    const responseData = error.response?.data as ApiErrorResponseData | undefined;
    const skipSessionExpiryHandling = Boolean(
      (error.config as AxiosRequestConfig & { skipSessionExpiryHandling?: boolean } | undefined)
        ?.skipSessionExpiryHandling,
    );
    const hasAuthHeader = Boolean(
      (error.config?.headers as Record<string, unknown> | undefined)?.Authorization,
    );
    const storedToken = await tokenManager.getToken();
    const hasMissingAuthHeaderError = hasMissingAuthHeaderSignal(responseData);
    const shouldHandleSessionExpiry =
      !skipSessionExpiryHandling &&
      isLikelyAuthExpiry(status, responseData) &&
      (hasAuthHeader || Boolean(storedToken) || hasMissingAuthHeaderError);

    if (shouldHandleSessionExpiry && !isHandlingSessionExpiry) {
      isHandlingSessionExpiry = true;

      try {
        await tokenManager.clearAll();
        redirectToAuthWithRetry();
      } finally {
        isHandlingSessionExpiry = false;
      }
    }

    return Promise.reject(error);
  },
);

function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponseData>;
    const status = axiosError.response?.status ?? 0;
    const data = axiosError.response?.data;
    const message = Array.isArray(data?.message)
      ? data.message.filter(Boolean).join('\n')
      : data?.message;

    return new ApiError(
      message ?? data?.error ?? axiosError.message ?? 'Request failed',
      status,
      data?.code,
      data,
    );
  }

  return new ApiError('Network error – please check your connection.', 0, 'NETWORK_ERROR');
}

// ---------------------------------------------------------------------------
// Core request wrapper
// ---------------------------------------------------------------------------
export type ApiRequestOptions = {
  skipSessionExpiryHandling?: boolean;
  skipAuth?: boolean;
  headers?: Record<string, string>;
};

async function request<T>(
  config: AxiosRequestConfig,
  options: ApiRequestOptions = {},
): Promise<T> {
  try {
    const requestConfig: ExtendedAxiosRequestConfig = {
      ...config,
      skipSessionExpiryHandling: options.skipSessionExpiryHandling,
      headers: options.skipAuth
        ? { ...config.headers, ...options.headers, 'x-skip-auth': '1' }
        : { ...config.headers, ...options.headers },
    };
    const response = await httpClient.request<T>(requestConfig);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}

// ---------------------------------------------------------------------------
// Convenience methods (mirroring a typical HTTP client API)
// ---------------------------------------------------------------------------
const apiClient = {
  get: <T>(
    path: string,
    params?: Record<string, unknown>,
    options?: ApiRequestOptions,
  ) => request<T>({ method: 'GET', url: path, params }, options),

  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>({ method: 'POST', url: path, data: body }, options),

  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>({ method: 'PATCH', url: path, data: body }, options),

  put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    request<T>({ method: 'PUT', url: path, data: body }, options),

  delete: <T>(path: string, options?: ApiRequestOptions) =>
    request<T>({ method: 'DELETE', url: path }, options),
};

export default apiClient;
