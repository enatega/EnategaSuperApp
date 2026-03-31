import type { UseMutationOptions } from '@tanstack/react-query';
import type { ApiError } from '../api/apiClient';
import { useLogout } from './useAuthMutations';
import { resetToSharedHome } from '../navigation/rootNavigation';

export function useAppLogout(options?: UseMutationOptions<void, ApiError, void>) {
  return useLogout({
    ...options,
    onSuccess: async (data, variables, onMutateResult, context) => {
      // `useLogout` already clears the persisted auth session, including the stored token.
      resetToSharedHome();
      await options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
