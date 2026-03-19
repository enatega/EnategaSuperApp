import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { apiConfig } from '../config/apiConfig';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const TOKEN_KEY = 'super_app_auth_token';
const REFRESH_TOKEN_KEY = 'super_app_refresh_token';

type ApiErrorResponseData = {
  message?: string | string[];
  code?: string;
  error?: string;
};

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
  paramsSerializer: {
    indexes: null,
  },
});

httpClient.interceptors.request.use(async (config) => {
  if (config.headers && (config.headers as Record<string, string>)['x-skip-auth']) {
    delete (config.headers as Record<string, string>)['x-skip-auth'];
    return config;
  }

  const token = await tokenManager.getToken();
  console.log('token______',token);
  
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    } as AxiosRequestConfig['headers'];
  }
  return config;
});

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
  skipAuth?: boolean;
  headers?: Record<string, string>;
};

async function request<T>(
  config: AxiosRequestConfig,
  options: ApiRequestOptions = {},
): Promise<T> {
  try {
    const response = await httpClient.request<T>({
      ...config,
      headers: options.skipAuth
        ? { ...config.headers, ...options.headers, 'x-skip-auth': '1' }
        : { ...config.headers, ...options.headers },
    });
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
