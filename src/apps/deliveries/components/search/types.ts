import type { TextInputProps } from "react-native";
import type {
  RecentSearchItem,
  SearchRecommendation,
} from "../../api/searchServiceTypes";

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onFocus?: TextInputProps["onFocus"];
  onBlur?: TextInputProps["onBlur"];
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
  autoFocus?: boolean;
}

export interface SearchSuggestionsProps {
  recommendations: SearchRecommendation[];
  onSuggestionPress: (name: string) => void;
}

export interface SearchChipProps {
  label: string;
  onPress: (label: string) => void;
}

export interface RecentSearchProps {
  search: string;
  onDeletePress: () => void;
  onItemPress: () => void;
  isDeleting?: boolean;
  isDeleteDisabled?: boolean;
}

export interface RecentSearchesProps {
  items: RecentSearchItem[];
  onDeletePress: (id: string) => void;
  onDeleteAllPress: () => void;
  onItemPress: (term: string) => void;
  deletingRecentSearchId?: string | null;
  isDeletingRecentSearch?: boolean;
  isClearingRecentSearches?: boolean;
}

export interface EmptySearchProps {
  title?: string;
  subtitle?: string;
  showIcon?: boolean;
}

export interface SearchResultsSkeletonProps {
  showStores?: boolean;
}
