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
import type { HomeVisitsStackParamList } from "../../navigation/types";
import {
  useServiceSearch,
  useRecentSearches,
  useSearchRecommendations,
  useServiceCenterSearch,
} from "../useSearchQueries";
import useAddress from "../../../../general/hooks/useAddress";
import useAddressSelectionSheet from "../../../../general/hooks/useAddressSelectionSheet";
import useRecentSearchActions from "./useRecentSearchActions";
import useSavedAddresses from "../../../../general/hooks/useSavedAddresses";
import useSearchKeyboardState from "../../../../general/hooks/searchFlow/useSearchKeyboardState";
import useSelectSavedAddress from "../../../../general/hooks/useSelectSavedAddress";
import useHomeVisitsSearchFilterState from "./useHomeVisitsSearchFilterState";
import { type HomeVisitsSearchFlowOptions } from "./queryTypes";

type HomeVisitsNavigationProp =
  NativeStackNavigationProp<HomeVisitsStackParamList>;

type SearchRouteName =
  | "MultiVendorTabSearch"
  | "SingleVendorTabSearch"
  | "ChainTabSearch";

  // Todo apr 21: need to look into it after multivenor and chain navigation is implemented.
function getAddressFlowOrigin(routeName: string): AddressFlowOrigin {
  if (routeName === "MultiVendorTabSearch") {
    return "multi-vendor-home";
  }

  if (routeName === "ChainTabSearch") {
    return "chain-home";
  }

  return "single-vendor-home";
}

export default function useHomeVisitsSearchFlow(
  options?: HomeVisitsSearchFlowOptions,
) {
  const navigation = useNavigation<HomeVisitsNavigationProp>();
  const route =
    useRoute<
      RouteProp<Record<SearchRouteName, object | undefined>, SearchRouteName>
    >();
  const { colors } = useTheme();
  const { t } = useTranslation("homeVisits");
  const { t: tGeneral } = useTranslation("general");
  const { inputRef, isFocused, dismissKeyboard, handleFocus, handleBlur } =
    useSearchKeyboardState();
  const origin = getAddressFlowOrigin(route.name);
  const { latitude, longitude, selectedAddress, selectedAddressLabel } =
    useAddress();
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch,
  } = useSavedAddresses("home-services");
  const { selectSavedAddress, selectingAddressId } = useSelectSavedAddress("home-services");
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
  const shouldSearchServiceCenters = options?.searchServiceCenters ?? false;
  const debounceMs = options?.debounceMs ?? 600;

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebouncedValue(searchQuery, debounceMs);
  
  const filterState = useHomeVisitsSearchFilterState({ t: tGeneral });
  const trimmedQuery = searchQuery.trim();
  const trimmedDebouncedQuery = debouncedQuery.trim();
  const isWaitingForDebounce =
    trimmedQuery.length > 0 && trimmedQuery !== trimmedDebouncedQuery;

  const { data: recommendationsData, isLoading: isLoadingRecommendations } =
    useSearchRecommendations();
  const { data: recentSearchesData } = useRecentSearches();
  const {
    data: servicesData,
    isLoading: isLoadingServices,
    isFetchingNextPage: isFetchingMoreServices,
    hasNextPage: hasMoreServices,
    fetchNextPage: fetchMoreServices,
  } = useServiceSearch(trimmedDebouncedQuery, {
    ...location,
    sort_by: filterState.appliedFilters.sortBy,
    ratings: filterState.appliedFilters.ratings,
    availability: filterState.appliedFilters.availability,
  });
  const {
    data: serviceCentersData,
    isLoading: isLoadingServiceCenters,
    isFetchingNextPage: isFetchingMoreServiceCenters,
    hasNextPage: hasMoreServiceCenters,
    fetchNextPage: fetchMoreServiceCenters,
  } = useServiceCenterSearch(trimmedDebouncedQuery, {
    ...location,
    sort_by: filterState.appliedFilters.sortBy,
    ratings: filterState.appliedFilters.ratings,
    availability: filterState.appliedFilters.availability,
  }, {
    enabled: shouldSearchServiceCenters && trimmedDebouncedQuery.length > 0,
  });

  const recommendations = recommendationsData ?? [];
  const recentSearches = recentSearchesData?.items ?? [];
  const services = servicesData?.pages.flatMap((page) => page.items) ?? [];
  const serviceCenters = shouldSearchServiceCenters
    ? (serviceCentersData?.pages.flatMap((page) => page.items) ?? [])
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
      isLoadingServices ||
      (shouldSearchServiceCenters && isLoadingServiceCenters));
  const hasNoResults =
    isSearchActive &&
    trimmedDebouncedQuery.length > 0 &&
    !isSearchLoading &&
    services.length === 0 &&
    serviceCenters.length === 0;

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

  const handleLoadMoreServices = useCallback(() => {
    if (hasMoreServices && !isFetchingMoreServices) {
      fetchMoreServices();
    }
  }, [fetchMoreServices, hasMoreServices, isFetchingMoreServices]);

  const handleLoadMoreServiceCenters = useCallback(() => {
    if (!shouldSearchServiceCenters) {
      return;
    }

    if (hasMoreServiceCenters && !isFetchingMoreServiceCenters) {
      fetchMoreServiceCenters();
    }
  }, [
    fetchMoreServiceCenters,
    hasMoreServiceCenters,
    isFetchingMoreServiceCenters,
    shouldSearchServiceCenters,
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
      appPrefix: "home-services",
      origin 
    });
  }, [handleCloseAddressSheet, navigation, origin]);

  const handleUseCurrentLocation = useCallback(() => {
    handleCloseAddressSheet();
    navigation.navigate("AddressChooseOnMap", { 
      appPrefix: "home-services",
      origin 
    });
  }, [handleCloseAddressSheet, navigation, origin]);

  const handleFiltersChange = useCallback(() => {
    // This will be handled by the filter state hook
  }, []);

  return {
    colors,
    t,
    inputRef,
    searchQuery,
    recommendations,
    recentSearches,
    services,
    serviceCenters,
    selectedAddressLabel,
    isSearchActive,
    isLoadingRecommendations,
    isSearchLoading,
    isFetchingMoreServices,
    isFetchingMoreServiceCenters: shouldSearchServiceCenters ? isFetchingMoreServiceCenters : false,
    deletingRecentSearchId,
    isDeletingRecentSearch,
    isClearingRecentSearches,
    showIdleState,
    showRecentSearches,
    hasNoResults,
    shouldSearchServiceCenters,
    handleChangeText,
    handleFocus,
    handleBlur,
    handleClear,
    dismissKeyboard,
    handleSubmitEditing,
    handleSuggestionPress,
    handleRecentSearchPress,
    handleFiltersChange,
    handleLoadMoreServices,
    handleLoadMoreServiceCenters,
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
    // Filter state
    ...filterState,
  };
}