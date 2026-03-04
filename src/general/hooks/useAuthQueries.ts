import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { authKeys } from '../api/queryKeys';
import { authSession, AuthSession } from '../auth/authSession';
import type { ApiError } from '../api/apiClient';

type AuthSessionQueryOptions = Omit<
  UseQueryOptions<AuthSession, ApiError>,
  'queryKey' | 'queryFn'
> & {
  cache?: boolean;
};

export function useAuthSessionQuery(options?: AuthSessionQueryOptions) {
  const { cache = true, ...rest } = options ?? {};

  return useQuery<AuthSession, ApiError>({
    queryKey: authKeys.session(),
    queryFn: authSession.getSession,
    staleTime: cache ? 30 * 1000 : 0,
    gcTime: cache ? 10 * 60 * 1000 : 0,
    ...rest,
  });
}
