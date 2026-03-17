import type {
  InfiniteData,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { ApiError } from "../../../../general/api/apiClient";
import type {
  RecentSearchesResponse,
  SearchProductsResponse,
  SearchRecommendationsResponse,
  SearchStoresResponse,
} from "../../api/searchServiceTypes";

export type UseSearchRecommendationsOptions = Omit<
  UseQueryOptions<SearchRecommendationsResponse, ApiError>,
  "queryKey" | "queryFn"
>;

export type UseRecentSearchesOptions = Omit<
  UseQueryOptions<RecentSearchesResponse, ApiError>,
  "queryKey" | "queryFn"
>;

export type SearchLocationParams = {
  latitude?: number;
  longitude?: number;
};

export type SearchQueryOptions = {
  enabled?: boolean;
};

export type ProductSearchData = InfiniteData<SearchProductsResponse>;
export type StoreSearchData = InfiniteData<SearchStoresResponse>;
