export type ApiEnvironment = 'development' | 'staging' | 'production' | 'local';

const DEFAULT_ENV: ApiEnvironment = 'production';//'local' 

const API_BASE_URLS: Record<ApiEnvironment, string> = {
  development: 'https://enatega-super-app-production.up.railway.app',
  staging: 'https://enatega-super-app-production.up.railway.app',
  production: 'https://enatega-super-app-production.up.railway.app',
  local: 'http://192.168.1.233:3000',
};

const envOverride = process.env.EXPO_PUBLIC_API_ENV as ApiEnvironment | undefined;
const baseUrlOverride = process.env.EXPO_PUBLIC_API_BASE_URL;

const resolvedEnv = envOverride ?? DEFAULT_ENV;
const resolvedBaseUrl = baseUrlOverride ?? API_BASE_URLS[resolvedEnv];

function normalizeBaseUrl(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export const apiConfig = {
  env: resolvedEnv,
  baseUrl: normalizeBaseUrl(resolvedBaseUrl),
} as const;
