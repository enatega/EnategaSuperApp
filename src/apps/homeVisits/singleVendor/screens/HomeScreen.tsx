import SingleVendorSpecialOffersBanner from "../components/HomeScreen/SingleVendorSpecialOffersBanner";
import React, { useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddressSelectionBottomSheet from "../../../../general/components/address/AddressSelectionBottomSheet";
import { showToast } from "../../../../general/components/AppToast";
import { useTheme } from "../../../../general/theme/theme";
import useAddress from "../../../../general/hooks/useAddress";
import useAddressSelectionSheet from "../../../../general/hooks/useAddressSelectionSheet";
import useSavedAddresses from "../../../../general/hooks/useSavedAddresses";
import useSelectSavedAddress from "../../../../general/hooks/useSelectSavedAddress";
import { createSelectedDeliveryAddress } from "../../../../general/utils/address";
import SingleVendorCategorySection from "../components/HomeScreen/SingleVendorCategorySection";
import DealsSection from "../components/HomeScreen/DealsSection";
import MostPopularServicesSection from "../components/HomeScreen/MostPopularServicesSection";
import NearbyYourLocationSection from "../components/HomeScreen/NearbyYourLocationSection";
import ActiveServiceCard from "../components/HomeScreen/ActiveServiceCard";
import type { HomeVisitsSingleVendorNavigationParamList } from "../navigation/types";
import useSingleVendorActiveBooking from "../hooks/useSingleVendorActiveBooking";
import useSingleVendorSearchFlow from "../hooks/useSingleVendorSearchFlow";
import useSingleVendorCategories from "../hooks/useSingleVendorCategories";
import HomeVisitsSearchFilterSheet from "../../components/search/HomeVisitsSearchFilterSheet";
import SearchResults from "../../components/search/SearchResults";
import RecentSearches from "../../../../general/components/search/RecentSearches";
import useProfile from "../../../../general/hooks/useProfile";
import HomeHeroSection from "../components/HomeScreen/composed/HomeHeroSection";
import QuickCategoriesRow from "../components/HomeScreen/composed/QuickCategoriesRow";

type Props = Record<string, never>;
const QUICK_CATEGORY_LIMIT = 5;

export default function SingleVendorHomeScreen({}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation("homeVisits");
  const { t: tGeneral } = useTranslation("general");
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>
    >();
  const searchFlow = useSingleVendorSearchFlow();
  const { user } = useProfile("home-services");
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch,
  } = useSavedAddresses("home-services");
  const { data: categories = [] } = useSingleVendorCategories();
  const { selectedAddress } = useAddress();
  const { data: activeBooking } = useSingleVendorActiveBooking();
  const quickCategories = React.useMemo(
    () => categories.slice(0, QUICK_CATEGORY_LIMIT),
    [categories],
  );
  const apiSelectedAddress = React.useMemo(
    () => createSelectedDeliveryAddress(addresses),
    [addresses],
  );
  const resolvedSelectedAddress = apiSelectedAddress ?? selectedAddress;
  const { selectSavedAddress, selectingAddressId } =
    useSelectSavedAddress("home-services");
  const {
    isVisible: isAddressSheetVisible,
    open: handleOpenAddressSheet,
    close: handleCloseAddressSheet,
  } = useAddressSelectionSheet({
    addressesCount: addresses.length,
    isLoading: isAddressesLoading,
  });

  const handleSelectAddress = useCallback(
    async (address: (typeof addresses)[number]) => {
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
      origin: "single-vendor-home",
      appPrefix: "home-services",
    });
  }, [handleCloseAddressSheet, navigation]);

  const handleUseCurrentLocation = useCallback(() => {
    handleCloseAddressSheet();
    navigation.navigate("AddressChooseOnMap", {
      origin: "single-vendor-home",
      appPrefix: "home-services",
    });
  }, [handleCloseAddressSheet, navigation]);
  const greetingName = React.useMemo(() => {
    const fullName = user?.name?.trim() ?? "";
    if (!fullName) {
      return t("home_visits_support_guest_name");
    }

    return fullName.split(" ")[0];
  }, [t, user?.name]);
  const avatarUri = user?.image ?? undefined;
  const showSearchResults =
    searchFlow.isSearchActive || searchFlow.showRecentSearches;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: activeBooking
              ? insets.bottom + tabBarHeight + 120
              : insets.bottom + 28,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeroSection
          addresses={addresses}
          avatarUri={avatarUri}
          clearAllLabel={tGeneral("clear_all")}
          greetingName={greetingName}
          onAddressPress={handleOpenAddressSheet}
          onOpenNotifications={() =>
            navigation.navigate("SingleVendorNotifications")
          }
          searchFlow={searchFlow}
          searchPlaceholder={tGeneral("search_input_placeholder")}
          tGeneralNotificationsTitle={tGeneral("notifications_title")}
        />

        {showSearchResults ? (
          <View style={styles.searchStateSection}>
            {searchFlow.showRecentSearches ? (
              <RecentSearches
                items={searchFlow.recentSearches}
                onItemPress={searchFlow.handleRecentSearchPress}
                onDeletePress={searchFlow.onDeleteRecentSearch}
                onDeleteAllPress={searchFlow.onClearRecentSearches}
                deletingRecentSearchId={searchFlow.deletingRecentSearchId}
                isDeletingRecentSearch={searchFlow.isDeletingRecentSearch}
                isClearingRecentSearches={searchFlow.isClearingRecentSearches}
              />
            ) : null}
            <SearchResults
              isSearchActive={searchFlow.isSearchActive}
              shouldSearchServiceCenters={false}
              isSearchLoading={searchFlow.isSearchLoading}
              hasNoResults={searchFlow.hasNoResults}
              services={searchFlow.services}
              serviceCenters={[]}
              isFetchingMoreServices={searchFlow.isFetchingMoreServices}
              isFetchingMoreServiceCenters={false}
              onLoadMoreServices={searchFlow.handleLoadMoreServices}
              onLoadMoreServiceCenters={searchFlow.handleLoadMoreServiceCenters}
              horizontal={false}
            />
          </View>
        ) : (
          <>
            <QuickCategoriesRow
              items={quickCategories}
              onPressItem={(item) =>
                navigation.navigate("SeeAllScreen", {
                  scope: "single-vendor",
                  queryType: "category-services",
                  title: item.name,
                  cardType: "service",
                  categoryId: item.id,
                })
              }
            />

            <SingleVendorSpecialOffersBanner />
            <SingleVendorCategorySection />
            <MostPopularServicesSection />
            <NearbyYourLocationSection
              latitude={resolvedSelectedAddress?.latitude}
              longitude={resolvedSelectedAddress?.longitude}
            />
            <DealsSection />
          </>
        )}
      </ScrollView>
      {activeBooking && !isAddressSheetVisible ? (
        <View
          pointerEvents="box-none"
          style={[
            styles.activeCardFloatingContainer,
            { bottom: 10 },
          ]}
        >
          <ActiveServiceCard
            booking={activeBooking}
            onPress={() => {
              navigation.navigate("SingleVendorTrackWorker", {
                orderId: activeBooking.orderId,
                source: "home_active_service",
              });
            }}
          />
        </View>
      ) : null}
      <AddressSelectionBottomSheet
        addresses={addresses}
        isLoading={isAddressesLoading}
        isVisible={isAddressSheetVisible}
        onAddAddress={handleAddAddressPress}
        onClose={handleCloseAddressSheet}
        onSelectAddress={handleSelectAddress}
        onUseCurrentLocation={handleUseCurrentLocation}
        selectingAddressId={selectingAddressId}
        selectedAddressId={selectedAddress?.id}
      />
      <HomeVisitsSearchFilterSheet
        visible={searchFlow.isFilterSheetVisible}
        filters={searchFlow.draftFilters}
        isApplyDisabled={
          !searchFlow.hasDraftFilters && !searchFlow.hasAppliedFilters
        }
        onClose={searchFlow.closeFilters}
        onApply={searchFlow.applyFilters}
        onClear={searchFlow.clearDraftFilters}
        onSelectSortBy={searchFlow.selectSortBy}
        onSelectRatings={searchFlow.selectRatings}
        onSelectAvailability={searchFlow.selectAvailability}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    gap: 16,
  },
  searchStateSection: {
    paddingHorizontal: 16,
    gap: 20,
  },
  activeCardFloatingContainer: {
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 20,
  },
});
