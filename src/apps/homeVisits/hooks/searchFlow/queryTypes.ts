import type {
  InfiniteData,
  UseQueryOptions,
} from "@tanstack/react-query";
import type { ApiError } from "../../../../general/api/apiClient";
import type {
  RecentSearchesResponse,
  SearchServicesResponse,
  SearchRecommendationsResponse,
  SearchServiceCentersResponse,
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

export type ServiceSearchData = InfiniteData<SearchServicesResponse>;
export type ServiceCenterSearchData = InfiniteData<SearchServiceCentersResponse>;

export type SearchLocation = {
  latitude?: number;
  longitude?: number;
};

export type SearchAddressSheetConfig = {
  addresses: import("../../../../general/api/profileService").ProfileAddress[];
  isLoading?: boolean;
  isVisible: boolean;
  onOpen: () => void;
  onAddAddress: () => void;
  onClose: () => void;
  onSelectAddress: (
    address: import("../../../../general/api/profileService").ProfileAddress,
  ) => void;
  onUseCurrentLocation: () => void;
  selectingAddressId?: string | null;
  selectedAddressId?: string;
};

export type HomeVisitsSearchFlowOptions = {
  location?: SearchLocation;
  searchServiceCenters?: boolean;
  debounceMs?: number;
};