import type { TextInputProps } from "react-native";

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


export type RecentSearchProps = {
  search: string;
  onDeletePress: () => void;
  onItemPress: () => void;
  isDeleting?: boolean;
  isDeleteDisabled?: boolean;
};


export type RecentSearchItem = {
  id: string;
  term: string;
  normalizedTerm: string;
  createdAt: string;
  updatedAt: string;
};


export type RecentSearchesProps = {
  items: RecentSearchItem[];
  onDeletePress: (id: string) => void;
  onDeleteAllPress: () => void;
  onItemPress: (term: string) => void;
  deletingRecentSearchId?: string | null;
  isDeletingRecentSearch?: boolean;
  isClearingRecentSearches?: boolean;
};


export type SearchChipProps = {
  label: string;
  onPress: (label: string) => void;
};


export type SearchRecommendation = {
  id: string;
  name: string;
  imageUrl: string;
};


export type SearchSuggestionsProps = {
  recommendations: SearchRecommendation[];
  onSuggestionPress: (name: string) => void;
};


export type EmptySearchProps = {
  title?: string;
  subtitle?: string;
  showIcon?: boolean;
};