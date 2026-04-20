import type { RefObject } from "react";
import type {
  SearchProductItem,
  SearchStoreItem,
} from "../../api/searchServiceTypes";
import type { TextInput, TextInputProps } from "react-native";
import type {
  RecentSearchItem,
  SearchRecommendation,
} from "../../api/searchServiceTypes";
import type { SearchAddressSheetConfig } from "../../hooks/searchFlow/types";
import type { ReactNode } from "react";

export type ProductMiniCardScrollerProps = {
  products: SearchProductItem[];
  onSeeAllPress?: () => void;
  onProductPress?: (product: SearchProductItem) => void;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
};

export type StoreCardScrollerProps = {
  stores: SearchStoreItem[];
  onSeeAllPress?: () => void;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
};

export type SearchResultsProps = {
  isSearchActive: boolean;
  shouldSearchStores: boolean;
  isSearchLoading: boolean;
  hasNoResults: boolean;
  products: SearchProductItem[];
  stores: SearchStoreItem[];
  isFetchingMoreProducts?: boolean;
  isFetchingMoreStores?: boolean;
  onLoadMoreProducts?: () => void;
  onLoadMoreStores?: () => void;
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
  products: SearchProductItem[];
  stores: SearchStoreItem[];
  selectedAddressLabel?: string | null;
  shouldSearchStores: boolean;
  isSearchActive: boolean;
  isLoadingRecommendations: boolean;
  isSearchLoading: boolean;
  isFetchingMoreProducts: boolean;
  isFetchingMoreStores: boolean;
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
  handleLoadMoreProducts: () => void;
  handleLoadMoreStores: () => void;
  onDeleteRecentSearch: (id: string) => void;
  onClearRecentSearches: () => void;
  addressSheet: SearchAddressSheetConfig;
  children?: ReactNode;
};

export type SearchResultsSkeletonProps = {
  showStores?: boolean;
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
