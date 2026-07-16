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
  detail?: string | string[];
};

type ExtendedAxiosRequestConfig = AxiosRequestConfig & {
  skipSessionExpiryHandling?: boolean;
  suppressTransientSuccessStreamWarning?: boolean;
};

function sanitizeHeaders(headers: unknown): Record<string, unknown> | undefined {
  if (!headers || typeof headers !== 'object') {
    return undefined;
  }

  const entries = Object.entries(headers as Record<string, unknown>);

  return Object.fromEntries(
    entries.map(([key, value]) => {
      const normalizedKey = key.toLowerCase();

      if (normalizedKey === 'authorization') {
        return [key, '[redacted]'];
      }

      return [key, value];
    }),
  );
}

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

  return hasAuthFailureSignal;
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

export type ApiNetworkFailureDetails = {
  url?: string;
  method?: string;
  baseURL?: string;
  timeout?: number;
  params?: unknown;
  data?: unknown;
  headers?: Record<string, unknown>;
  requestStatus?: unknown;
  requestReadyState?: unknown;
  rawResponse?: string;
  responseData?: unknown;
};

function normalizeApiMessageValue(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    const joinedValue = value
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .join('\n')
      .trim();

    return joinedValue.length > 0 ? joinedValue : undefined;
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : undefined;
  }

  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function parseRawResponse(rawResponse?: string): unknown {
  const trimmedResponse = rawResponse?.trim();

  if (!trimmedResponse) {
    return undefined;
  }

  try {
    return JSON.parse(trimmedResponse) as unknown;
  } catch {
    if (trimmedResponse.startsWith('<')) {
      return undefined;
    }

    return trimmedResponse;
  }
}

function isTransportNoiseMessage(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  const normalizedValue = value.trim().toLowerCase();
  return (
    normalizedValue === 'stream was reset: cancel' ||
    normalizedValue === 'canceled' ||
    normalizedValue === 'cancelled' ||
    normalizedValue === 'network error'
  );
}

function isSuccessfulStatus(status: number): boolean {
  return status >= 200 && status < 300;
}

function getSafeNetworkFailureMessage(
  status: number,
  recoveredMessage: string | undefined,
  fallbackMessage: string | undefined,
): string {
  if (recoveredMessage && !isTransportNoiseMessage(recoveredMessage)) {
    return recoveredMessage;
  }

  if (status >= 400) {
    return 'Something went wrong.';
  }

  if (fallbackMessage && !isTransportNoiseMessage(fallbackMessage)) {
    return fallbackMessage;
  }

  return 'Network error – please check your connection.';
}

export function extractApiErrorMessage(source: unknown): string | undefined {
  const directMessage = normalizeApiMessageValue(source);

  if (directMessage && !isTransportNoiseMessage(directMessage)) {
    return directMessage;
  }

  if (!isRecord(source)) {
    return undefined;
  }

  const nestedMessage =
    normalizeApiMessageValue(source.message) ??
    normalizeApiMessageValue(source.error) ??
    normalizeApiMessageValue(source.detail);

  if (nestedMessage && !isTransportNoiseMessage(nestedMessage)) {
    return nestedMessage;
  }

  if ('responseData' in source) {
    const responseDataMessage = extractApiErrorMessage(source.responseData);
    if (responseDataMessage) {
      return responseDataMessage;
    }
  }

  if (typeof source.rawResponse === 'string') {
    return extractApiErrorMessage(parseRawResponse(source.rawResponse));
  }

  return undefined;
}

function extractApiErrorCode(source: unknown): string | undefined {
  if (!isRecord(source) || typeof source.code !== 'string') {
    return undefined;
  }

  const trimmedCode = source.code.trim();
  return trimmedCode.length > 0 ? trimmedCode : undefined;
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
    const responseData = axiosError.response?.data;
    const message = extractApiErrorMessage(responseData);
    const suppressTransientSuccessStreamWarning = Boolean(
      (axiosError.config as ExtendedAxiosRequestConfig | undefined)
        ?.suppressTransientSuccessStreamWarning,
    );

    const requestDetails = {
      url: axiosError.config?.url,
      method: axiosError.config?.method,
      baseURL: axiosError.config?.baseURL,
      timeout: axiosError.config?.timeout,
      params: axiosError.config?.params,
      data: axiosError.config?.data,
      headers: sanitizeHeaders(axiosError.config?.headers),
    };

    if (!axiosError.response) {
      const rawRequest = axiosError.request as
        | { _response?: unknown; responseText?: unknown; status?: unknown; readyState?: unknown }
        | undefined;
      const networkFailureDetails: ApiNetworkFailureDetails = {
        ...requestDetails,
        requestStatus: rawRequest?.status,
        requestReadyState: rawRequest?.readyState,
        rawResponse:
          typeof rawRequest?._response === 'string'
            ? rawRequest._response
            : typeof rawRequest?.responseText === 'string'
              ? rawRequest.responseText
              : undefined,
      };
      networkFailureDetails.responseData = parseRawResponse(
        networkFailureDetails.rawResponse,
      );
      const recoveredMessage =
        extractApiErrorMessage(networkFailureDetails.responseData) ??
        extractApiErrorMessage(networkFailureDetails);
      const recoveredCode = extractApiErrorCode(networkFailureDetails.responseData);
      const normalizedStatus =
        typeof networkFailureDetails.requestStatus === 'number'
          ? networkFailureDetails.requestStatus
          : status;
      const safeMessage = getSafeNetworkFailureMessage(
        normalizedStatus,
        recoveredMessage,
        axiosError.message,
      );
      const isTransientSuccessfulResponse = isSuccessfulStatus(normalizedStatus);
      const logPayload = {
        message: axiosError.message,
        code: axiosError.code,
        hasRequest: Boolean(axiosError.request),
        ...networkFailureDetails,
      };

      if (isTransientSuccessfulResponse) {
        if (!suppressTransientSuccessStreamWarning) {
          console.warn('[API] successful response stream was lost before Axios could parse it', logPayload);
        }
      } else {
        console.error('[API] network request failed before response', logPayload);
      }

      return new ApiError(
        safeMessage,
        normalizedStatus,
        recoveredCode
        ?? (isTransientSuccessfulResponse
          ? 'TRANSIENT_RESPONSE_STREAM_LOST'
          : recoveredMessage
            ? undefined
            : 'NETWORK_ERROR'),
        networkFailureDetails,
      );
    } else {
      console.error('[API] request failed with response', {
        ...requestDetails,
        message: axiosError.message,
        code: axiosError.code,
        status,
        responseData,
        responseHeaders: sanitizeHeaders(axiosError.response.headers),
      });
    }

    return new ApiError(
      message ?? responseData?.error ?? axiosError.message ?? 'Request failed',
      status,
      extractApiErrorCode(responseData),
      responseData,
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
  suppressTransientSuccessStreamWarning?: boolean;
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
      suppressTransientSuccessStreamWarning: options.suppressTransientSuccessStreamWarning,
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
