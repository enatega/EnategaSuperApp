import apiClient from "../../../general/api/apiClient";
import type {
  ClearRecentSearchesResponse,
  DeleteRecentSearchResponse,
  RecentSearchesResponse,
  RecentSearchItem,
  SaveRecentSearchPayload,
  SearchServicesParams,
  SearchServicesResponse,
  SearchRecommendationsResponse,
  SearchServiceCentersParams,
  SearchServiceCentersResponse,
} from "./searchServiceTypes";

const SEARCH_BASE = "/api/v1/apps/home-services/search";

export const searchService = {
  getRecommendations: (limit = 100): Promise<SearchRecommendationsResponse> =>
    apiClient.get<SearchRecommendationsResponse>(
      `${SEARCH_BASE}/recommendations`,
      { limit },
    ),

  getRecentSearches: (
    offset = 0,
    limit = 10,
    search?: string,
  ): Promise<RecentSearchesResponse> =>
    apiClient.get<RecentSearchesResponse>(`${SEARCH_BASE}/recent-searches`, {
      offset,
      limit,
      ...(search && { search }),
    }),

  saveRecentSearch: (
    payload: SaveRecentSearchPayload,
  ): Promise<RecentSearchItem> =>
    apiClient.post<RecentSearchItem>(`${SEARCH_BASE}/recent-searches`, payload),

  deleteRecentSearch: (id: string): Promise<DeleteRecentSearchResponse> =>
    apiClient.delete<DeleteRecentSearchResponse>(
      `${SEARCH_BASE}/recent-searches/${id}`,
    ),

  clearRecentSearches: (): Promise<ClearRecentSearchesResponse> =>
    apiClient.delete<ClearRecentSearchesResponse>(
      `${SEARCH_BASE}/recent-searches`,
    ),

  searchServices: (
    params: SearchServicesParams,
  ): Promise<SearchServicesResponse> =>
    apiClient.get<SearchServicesResponse>(
      `${SEARCH_BASE}/services`,
      params as Record<string, unknown>,
    ),

  searchServiceCenters: (params: SearchServiceCentersParams): Promise<SearchServiceCentersResponse> =>
    apiClient.get<SearchServiceCentersResponse>(
      `${SEARCH_BASE}/service-centers`,
      params as Record<string, unknown>,
    ),
};