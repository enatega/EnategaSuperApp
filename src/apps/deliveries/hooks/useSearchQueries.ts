import {
  useQuery,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import { deliveryKeys } from "../api/queryKeys";
import { searchService } from "../api/searchService";
import type { ApiError } from "../../../general/api/apiClient";
import type {
  RecentSearchesResponse,
  SearchProductsResponse,
  SearchRecommendationsResponse,
  SearchStoresResponse,
} from "../api/searchServiceTypes";
import type {
  SearchLocationParams,
  SearchQueryOptions,
  UseRecentSearchesOptions,
  UseSearchRecommendationsOptions,
} from "./searchFlow/queryTypes";

const SEARCH_LIMIT = 10;

export function useSearchRecommendations(
  options?: UseSearchRecommendationsOptions,
) {
  return useQuery<SearchRecommendationsResponse, ApiError>({
    queryKey: deliveryKeys.recommendations(),
    queryFn: () => searchService.getRecommendations(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useRecentSearches(options?: UseRecentSearchesOptions) {
  return useQuery<RecentSearchesResponse, ApiError>({
    queryKey: deliveryKeys.recentSearches(),
    queryFn: () => searchService.getRecentSearches(0, SEARCH_LIMIT),
    staleTime: 1 * 60 * 1000,
    ...options,
  });
}

export function useProductSearch(
  keyword: string,
  params?: SearchLocationParams,
  options?: SearchQueryOptions,
) {
  return useInfiniteQuery<
    SearchProductsResponse,
    ApiError,
    InfiniteData<SearchProductsResponse>,
    ReturnType<typeof deliveryKeys.productSearch>,
    number
  >({
    queryKey: deliveryKeys.productSearch(
      keyword,
      params?.latitude,
      params?.longitude,
    ),
    queryFn: ({ pageParam }) =>
      searchService.searchProducts({
        keyword,
        offset: pageParam,
        limit: SEARCH_LIMIT,
        latitude: params?.latitude,
        longitude: params?.longitude,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    enabled: options?.enabled ?? keyword.length > 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useStoreSearch(
  keyword: string,
  params?: SearchLocationParams,
  options?: SearchQueryOptions,
) {
  return useInfiniteQuery<
    SearchStoresResponse,
    ApiError,
    InfiniteData<SearchStoresResponse>,
    ReturnType<typeof deliveryKeys.storeSearch>,
    number
  >({
    queryKey: deliveryKeys.storeSearch(
      keyword,
      params?.latitude,
      params?.longitude,
    ),
    queryFn: ({ pageParam }) =>
      searchService.searchStores({
        keyword,
        offset: pageParam,
        limit: SEARCH_LIMIT,
        latitude: params?.latitude,
        longitude: params?.longitude,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    enabled: options?.enabled ?? keyword.length > 0,
    staleTime: 2 * 60 * 1000,
  });
}
