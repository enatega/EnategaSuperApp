import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { deliveryKeys } from "../api/queryKeys";
import { searchService } from "../api/searchService";
import type { ApiError } from "../../../general/api/apiClient";
import type {
  RecentSearchItem,
  SaveRecentSearchPayload,
  DeleteRecentSearchResponse,
  ClearRecentSearchesResponse,
} from "../api/searchServiceTypes";

export function useSaveRecentSearch(
  options?: UseMutationOptions<
    RecentSearchItem,
    ApiError,
    SaveRecentSearchPayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation<RecentSearchItem, ApiError, SaveRecentSearchPayload>({
    mutationFn: searchService.saveRecentSearch,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: deliveryKeys.recentSearches(),
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export function useDeleteRecentSearch(
  options?: UseMutationOptions<DeleteRecentSearchResponse, ApiError, string>,
) {
  const queryClient = useQueryClient();

  return useMutation<DeleteRecentSearchResponse, ApiError, string>({
    mutationFn: searchService.deleteRecentSearch,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: deliveryKeys.recentSearches(),
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

export function useClearRecentSearches(
  options?: UseMutationOptions<ClearRecentSearchesResponse, ApiError, void>,
) {
  const queryClient = useQueryClient();

  return useMutation<ClearRecentSearchesResponse, ApiError, void>({
    mutationFn: searchService.clearRecentSearches,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: deliveryKeys.recentSearches(),
      });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
