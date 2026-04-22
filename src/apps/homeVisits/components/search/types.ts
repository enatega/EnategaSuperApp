import type { RefObject } from "react";
import type {
  SearchServiceItem,
  SearchServiceCenterItem,
} from "../../api/searchServiceTypes";
import type { TextInput, TextInputProps } from "react-native";
import type {
  RecentSearchItem,
  SearchRecommendation,
} from "../../api/searchServiceTypes";
import type { SearchAddressSheetConfig } from "../../hooks/searchFlow/queryTypes";
import type { ReactNode } from "react";

export type ServiceCardScrollerProps = {
  services: SearchServiceItem[];
  onSeeAllPress?: () => void;
  onServicePress?: (service: SearchServiceItem) => void;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  horizontal?: boolean;
};

export type ServiceCenterCardScrollerProps = {
  serviceCenters: SearchServiceCenterItem[];
  onSeeAllPress?: () => void;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
};

export type SearchResultsProps = {
  isSearchActive: boolean;
  shouldSearchServiceCenters: boolean;
  isSearchLoading: boolean;
  hasNoResults: boolean;
  services: SearchServiceItem[];
  serviceCenters: SearchServiceCenterItem[];
  isFetchingMoreServices?: boolean;
  isFetchingMoreServiceCenters?: boolean;
  onLoadMoreServices?: () => void;
  onLoadMoreServiceCenters?: () => void;
  horizontal: boolean
};

export type SearchMainContainerProps = {
  colors: {
    background: string;
    border: string;
    mutedText: string;
    surface: string;
    text: string;
  };
  t: (key: string) => string;
  inputRef: RefObject<TextInput | null>;
  searchQuery: string;
  recommendations: SearchRecommendation[];
  recentSearches: RecentSearchItem[];
  services: SearchServiceItem[];
  serviceCenters: SearchServiceCenterItem[];
  selectedAddressLabel?: string | null;
  shouldSearchServiceCenters: boolean;
  isSearchActive: boolean;
  isLoadingRecommendations: boolean;
  isSearchLoading: boolean;
  isFetchingMoreServices: boolean;
  isFetchingMoreServiceCenters: boolean;
  deletingRecentSearchId: string | null;
  isDeletingRecentSearch: boolean;
  isClearingRecentSearches: boolean;
  showIdleState: boolean;
  showRecentSearches: boolean;
  hasNoResults: boolean;
  handleChangeText: (text: string) => void;
  handleFocus: () => void;
  handleBlur: () => void;
  handleClear: () => void;
  dismissKeyboard: () => void;
  handleSubmitEditing: () => void;
  handleSuggestionPress: (term: string) => void;
  handleRecentSearchPress: (term: string) => void;
  handleLoadMoreServices: () => void;
  handleLoadMoreServiceCenters: () => void;
  onDeleteRecentSearch: (id: string) => void;
  onClearRecentSearches: () => void;
  addressSheet: SearchAddressSheetConfig;
  children?: ReactNode;
};

export type SearchResultsSkeletonProps = {
  showServiceCenters?: boolean;
};

export type SearchSuggestionsSkeletonProps = Record<string, never>;

export type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onFocus?: TextInputProps["onFocus"];
  onBlur?: TextInputProps["onBlur"];
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
  autoFocus?: boolean;
};
