export type ApiEnvironment = 'development' | 'staging' | 'production' | 'local';

const DEFAULT_ENV: ApiEnvironment = 'production';

const envOverride = process.env.EXPO_PUBLIC_API_ENV as ApiEnvironment | undefined;
const baseUrlOverride = process.env.EXPO_PUBLIC_API_BASE_URL;

const resolvedEnv = envOverride ?? DEFAULT_ENV;
const resolvedBaseUrl = baseUrlOverride;

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

if (!resolvedBaseUrl) {
  throw new Error('Missing EXPO_PUBLIC_API_BASE_URL environment variable');
}

export const apiConfig = {
  env: resolvedEnv,
  baseUrl: normalizeBaseUrl(resolvedBaseUrl),
} as const;
