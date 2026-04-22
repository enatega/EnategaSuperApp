import { useCallback, useMemo, useState } from "react";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { showToast } from "../../../../general/components/AppToast";
import { useTheme } from "../../../../general/theme/theme";
import useDebouncedValue from "../../../../general/hooks/useDebouncedValue";
import type { ProfileAddress } from "../../../../general/api/profileService";
import type { AddressFlowOrigin } from "../../../../general/navigation/addressFlowTypes";
import type { DeliveriesStackParamList } from "../../navigation/types";
import {
  useProductSearch,
  useRecentSearches,
  useSearchRecommendations,
  useStoreSearch,
} from "../useSearchQueries";
import useAddress from "../../../../general/hooks/useAddress";
import useAddressSelectionSheet from "../../../../general/hooks/useAddressSelectionSheet";
import useRecentSearchActions from "./useRecentSearchActions";
import useSavedAddresses from "../../../../general/hooks/useSavedAddresses";
import useSearchKeyboardState from "../../../../general/hooks/searchFlow/useSearchKeyboardState";
import useSelectSavedAddress from "../../../../general/hooks/useSelectSavedAddress";
import { type DeliverySearchFlowOptions } from "./types";

type DeliveriesNavigationProp =
  NativeStackNavigationProp<DeliveriesStackParamList>;

type SearchRouteName =
  | "MultiVendorTabSearch"
  | "SingleVendorTabSearch"
  | "ChainTabSearch";

function getAddressFlowOrigin(routeName: string): AddressFlowOrigin {
  if (routeName === "MultiVendorTabSearch") {
    return "multi-vendor-home";
  }

  if (routeName === "ChainTabSearch") {
    return "chain-home";
  }

  return "single-vendor-home";
}

export default function useDeliverySearchFlow(
  options?: DeliverySearchFlowOptions,
) {
  const navigation = useNavigation<DeliveriesNavigationProp>();
  const route =
    useRoute<
      RouteProp<Record<SearchRouteName, object | undefined>, SearchRouteName>
    >();
  const { colors } = useTheme();
  const { t } = useTranslation("deliveries");
  const { inputRef, isFocused, dismissKeyboard, handleFocus, handleBlur } =
    useSearchKeyboardState();
  const origin = getAddressFlowOrigin(route.name);
  const { latitude, longitude, selectedAddress, selectedAddressLabel } =
    useAddress();
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch,
  } = useSavedAddresses("deliveries");
  const { selectSavedAddress, selectingAddressId } = useSelectSavedAddress("deliveries");
  const {
    isVisible: isAddressSheetVisible,
    open: handleOpenAddressSheet,
    close: handleCloseAddressSheet,
  } = useAddressSelectionSheet({
    addressesCount: addresses.length,
    isLoading: isAddressesLoading,
  });

  const location = useMemo(
    () => ({
      latitude: options?.location?.latitude ?? latitude,
      longitude: options?.location?.longitude ?? longitude,
    }),
    [
      latitude,
      longitude,
      options?.location?.latitude,
      options?.location?.longitude,
    ],
  );
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

  const handleSelectAddress = useCallback(
    async (address: ProfileAddress) => {
      try {
        const isSelected = await selectSavedAddress(address.id);

        if (!isSelected) {
          return;
        }

        void refetch();
        handleCloseAddressSheet();
      } catch {
        showToast.error(t("address_select_error"));
      }
    },
    [handleCloseAddressSheet, refetch, selectSavedAddress, t],
  );

  const handleAddAddressPress = useCallback(() => {
    handleCloseAddressSheet();
    navigation.navigate("AddressSearch", { 
      appPrefix: "deliveries",
      origin 
    });
  }, [handleCloseAddressSheet, navigation, origin]);

  const handleUseCurrentLocation = useCallback(() => {
    handleCloseAddressSheet();
    navigation.navigate("AddressChooseOnMap", { 
      appPrefix: "deliveries",
      origin 
    });
  }, [handleCloseAddressSheet, navigation, origin]);

  return {
    colors,
    t,
    inputRef,
    searchQuery,
    recommendations,
    recentSearches,
    products,
    stores,
    selectedAddressLabel,
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
    addressSheet: {
      addresses,
      isLoading: isAddressesLoading,
      isVisible: isAddressSheetVisible,
      onAddAddress: handleAddAddressPress,
      onClose: handleCloseAddressSheet,
      onSelectAddress: handleSelectAddress,
      onUseCurrentLocation: handleUseCurrentLocation,
      selectingAddressId,
      selectedAddressId: selectedAddress?.id,
      onOpen: handleOpenAddressSheet,
    },
  };
}
