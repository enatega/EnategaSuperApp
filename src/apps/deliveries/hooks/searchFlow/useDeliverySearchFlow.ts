import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../general/theme/theme";
import useDebouncedValue from "../../../../general/hooks/useDebouncedValue";
import {
  useProductSearch,
  useRecentSearches,
  useSearchRecommendations,
  useStoreSearch,
} from "../useSearchQueries";
import useRecentSearchActions from "./useRecentSearchActions";
import useSearchKeyboardState from "./useSearchKeyboardState";
import {
  DEFAULT_SEARCH_LOCATION,
  type DeliverySearchFlowOptions,
} from "./types";

export default function useDeliverySearchFlow(
  options?: DeliverySearchFlowOptions,
) {
  const { colors } = useTheme();
  const { t } = useTranslation("deliveries");
  const { inputRef, isFocused, dismissKeyboard, handleFocus, handleBlur } =
    useSearchKeyboardState();

  const location = options?.location ?? DEFAULT_SEARCH_LOCATION;
  const shouldSearchStores = options?.searchStores ?? false;
  const debounceMs = options?.debounceMs ?? 600;

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, debounceMs);
  const trimmedQuery = searchQuery.trim();
  const trimmedDebouncedQuery = debouncedQuery.trim();
  const isWaitingForDebounce =
    trimmedQuery.length > 0 && trimmedQuery !== trimmedDebouncedQuery;

  const { data: recommendationsData, isLoading: isLoadingRecommendations } =
    useSearchRecommendations();
  const { data: recentSearchesData } = useRecentSearches();
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isFetchingNextPage: isFetchingMoreProducts,
    hasNextPage: hasMoreProducts,
    fetchNextPage: fetchMoreProducts,
  } = useProductSearch(trimmedDebouncedQuery, location);
  const {
    data: storesData,
    isLoading: isLoadingStores,
    isFetchingNextPage: isFetchingMoreStores,
    hasNextPage: hasMoreStores,
    fetchNextPage: fetchMoreStores,
  } = useStoreSearch(trimmedDebouncedQuery, location, {
    enabled: shouldSearchStores && trimmedDebouncedQuery.length > 0,
  });

  const recommendations = recommendationsData ?? [];
  const recentSearches = recentSearchesData?.items ?? [];
  const products = productsData?.pages.flatMap((page) => page.items) ?? [];
  const stores = shouldSearchStores
    ? (storesData?.pages.flatMap((page) => page.items) ?? [])
    : [];
  const {
    deletingRecentSearchId,
    isDeletingRecentSearch,
    isClearingRecentSearches,
    resetSavedTerm,
    handleDeleteRecentSearch,
    handleClearRecentSearches,
  } = useRecentSearchActions(trimmedDebouncedQuery);

  const showRecentSearches =
    isFocused && trimmedQuery.length === 0 && recentSearches.length > 0;

  const showIdleState = trimmedQuery.length === 0 && !showRecentSearches;
  const isSearchActive = trimmedQuery.length > 0;
  const isSearchLoading =
    isSearchActive &&
    (isWaitingForDebounce ||
      isLoadingProducts ||
      (shouldSearchStores && isLoadingStores));
  const hasNoResults =
    isSearchActive &&
    trimmedDebouncedQuery.length > 0 &&
    !isSearchLoading &&
    products.length === 0 &&
    stores.length === 0;

  const handleChangeText = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleClear = useCallback(() => {
    setSearchQuery("");
    resetSavedTerm();
  }, [resetSavedTerm]);

  const handleSubmitEditing = useCallback(() => {
    if (!trimmedQuery) {
      return;
    }
    dismissKeyboard();
  }, [dismissKeyboard, trimmedQuery]);

  const handleSuggestionPress = useCallback(
    (term: string) => {
      setSearchQuery(term);
      handleFocus();
    },
    [handleFocus],
  );

  const handleRecentSearchPress = useCallback(
    (term: string) => {
      setSearchQuery(term);
      requestAnimationFrame(() => {
        dismissKeyboard();
      });
    },
    [dismissKeyboard],
  );

  const handleLoadMoreProducts = useCallback(() => {
    if (hasMoreProducts && !isFetchingMoreProducts) {
      fetchMoreProducts();
    }
  }, [fetchMoreProducts, hasMoreProducts, isFetchingMoreProducts]);

  const handleLoadMoreStores = useCallback(() => {
    if (!shouldSearchStores) {
      return;
    }

    if (hasMoreStores && !isFetchingMoreStores) {
      fetchMoreStores();
    }
  }, [
    fetchMoreStores,
    hasMoreStores,
    isFetchingMoreStores,
    shouldSearchStores,
  ]);

  const handleAddressPress = useCallback(() => {
    options?.onAddressPress?.();
  }, [options]);

  return {
    colors,
    t,
    inputRef,
    searchQuery,
    recommendations,
    recentSearches,
    products,
    stores,
    isSearchActive,
    isLoadingRecommendations,
    isSearchLoading,
    isFetchingMoreProducts,
    isFetchingMoreStores: shouldSearchStores ? isFetchingMoreStores : false,
    deletingRecentSearchId,
    isDeletingRecentSearch,
    isClearingRecentSearches,
    showIdleState,
    showRecentSearches,
    hasNoResults,
    shouldSearchStores,
    handleChangeText,
    handleFocus,
    handleBlur,
    handleClear,
    dismissKeyboard,
    handleSubmitEditing,
    handleSuggestionPress,
    handleRecentSearchPress,
    handleLoadMoreProducts,
    handleLoadMoreStores,
    onDeleteRecentSearch: handleDeleteRecentSearch,
    onClearRecentSearches: handleClearRecentSearches,
    onAddressPress: handleAddressPress,
  };
}
