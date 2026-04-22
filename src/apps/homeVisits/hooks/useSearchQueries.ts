import {
  useQuery,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import { homeVisitsKeys } from "../api/queryKeys";
import { searchService } from "../api/searchService";
import type { ApiError } from "../../../general/api/apiClient";
import type {
  RecentSearchesResponse,
  SearchServicesResponse,
  SearchRecommendationsResponse,
  SearchServiceCentersResponse,
} from "../api/searchServiceTypes";
import type {
  SearchLocationParams,
  SearchQueryOptions,
  UseRecentSearchesOptions,
  UseSearchRecommendationsOptions,
} from "./useSearchTypes";

const SEARCH_LIMIT = 10;

export function useSearchRecommendations(
  options?: UseSearchRecommendationsOptions,
) {
  return useQuery<SearchRecommendationsResponse, ApiError>({
    queryKey: homeVisitsKeys.recommendations(),
    queryFn: () => searchService.getRecommendations(),
    staleTime: 10 * 60 * 1000,
    ...options,
  });
}

export function useRecentSearches(options?: UseRecentSearchesOptions) {
  return useQuery<RecentSearchesResponse, ApiError>({
    queryKey: homeVisitsKeys.recentSearches(),
    queryFn: () => searchService.getRecentSearches(0, SEARCH_LIMIT),
    staleTime: 1 * 60 * 1000,
    ...options,
  });
}

export function useServiceSearch(
  keyword: string,
  params?: SearchLocationParams & {
    categoryId?: string;
    sort_by?: 'best_match' | 'top_rated' | 'nearest';
    ratings?: number;
    availability?: 'standard' | 'emergency';
  },
  options?: SearchQueryOptions,
) {
  const filterParams = {
    sort_by: params?.sort_by,
    ratings: params?.ratings,
    availability: params?.availability,
  };

  return useInfiniteQuery<
    SearchServicesResponse,
    ApiError,
    InfiniteData<SearchServicesResponse>,
    ReturnType<typeof homeVisitsKeys.serviceSearch>,
    number
  >({
    queryKey: homeVisitsKeys.serviceSearch(
      keyword,
      params?.latitude,
      params?.longitude,
      filterParams,
    ),
    queryFn: ({ pageParam }) =>
      searchService.searchServices({
        keyword,
        offset: pageParam,
        limit: SEARCH_LIMIT,
        // latitude: params?.latitude,
        // longitude: params?.longitude,
        categoryId: params?.categoryId,
        sort_by: params?.sort_by,
        ratings: params?.ratings,
        availability: params?.availability,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    enabled: options?.enabled ?? keyword.length > 0,
    staleTime: 2 * 60 * 1000,
  });
}

export function useServiceCenterSearch(
  keyword: string,
  params?: SearchLocationParams & {
    categoryId?: string;
    sort_by?: 'best_match' | 'top_rated' | 'nearest';
    ratings?: number;
    availability?: 'standard' | 'emergency';
  },
  options?: SearchQueryOptions,
) {
  const filterParams = {
    sort_by: params?.sort_by,
    ratings: params?.ratings,
    availability: params?.availability,
  };

  return useInfiniteQuery<
    SearchServiceCentersResponse,
    ApiError,
    InfiniteData<SearchServiceCentersResponse>,
    ReturnType<typeof homeVisitsKeys.serviceCenterSearch>,
    number
  >({
    queryKey: homeVisitsKeys.serviceCenterSearch(
      keyword,
      params?.latitude,
      params?.longitude,
      filterParams,
    ),
    queryFn: ({ pageParam }) =>
      searchService.searchServiceCenters({
        keyword,
        offset: pageParam,
        limit: SEARCH_LIMIT,
        latitude: params?.latitude,
        longitude: params?.longitude,
        categoryId: params?.categoryId,
        sort_by: params?.sort_by,
        ratings: params?.ratings,
        availability: params?.availability,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    enabled: options?.enabled ?? keyword.length > 0,
    staleTime: 2 * 60 * 1000,
  });
}