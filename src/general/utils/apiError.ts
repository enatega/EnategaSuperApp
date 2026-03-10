import { ApiError } from '../api/apiClient';

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (error instanceof ApiError) {
    const serverMessage = error.message?.trim();
    return serverMessage || fallbackMessage;
  }

  if (error instanceof Error) {
    const message = error.message?.trim();
    return message || fallbackMessage;
  }

  return fallbackMessage;
}
