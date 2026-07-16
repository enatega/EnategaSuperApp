import { ApiError } from './apiClient';

const TRANSIENT_SUCCESS_STATUS_MIN = 200;
const TRANSIENT_SUCCESS_STATUS_MAX = 299;
const TRANSIENT_MAP_REQUEST_ATTEMPTS = 3;

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function shouldRetryTransientMapRequest(error: unknown) {
  return (
    error instanceof ApiError
    && error.code === 'TRANSIENT_RESPONSE_STREAM_LOST'
    && error.status >= TRANSIENT_SUCCESS_STATUS_MIN
    && error.status <= TRANSIENT_SUCCESS_STATUS_MAX
  );
}

export async function retryTransientMapRequest<T>(
  request: () => Promise<T>,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < TRANSIENT_MAP_REQUEST_ATTEMPTS; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      lastError = error;

      if (!shouldRetryTransientMapRequest(error)) {
        throw error;
      }

      if (attempt === TRANSIENT_MAP_REQUEST_ATTEMPTS - 1) {
        throw error;
      }

      await delay(150 * (attempt + 1));
    }
  }

  throw lastError;
}
