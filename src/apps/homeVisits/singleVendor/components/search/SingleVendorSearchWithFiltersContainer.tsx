import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../../../general/theme/theme";
import { useTranslation } from "react-i18next";
import useSingleVendorSearchFlow from "../../hooks/useSingleVendorSearchFlow";
import SearchResults from "../../../components/search/SearchResults";
import RecentSearches from "../../../../../general/components/search/RecentSearches";
import SearchSuggestions from "../../../../../general/components/search/SearchSuggestions";
import SearchSuggestionsSkeleton from "../../../../../general/components/search/SearchSuggestionsSkeleton";
import AddressSelectionBottomSheet from "../../../../../general/components/address/AddressSelectionBottomSheet";
import HomeVisitsSearchInputWithFilter from "../../../components/search/HomeVisitsSearchInputWithFilter";
import HomeVisitsSelectedFilterChips from "../../../components/filters/HomeVisitsSelectedFilterChips";
import HomeVisitsSearchFilterSheet from "../../../components/search/HomeVisitsSearchFilterSheet";
import { Pressable } from "react-native";
import Text from "../../../../../general/components/Text";
import Icon from "../../../../../general/components/Icon";
import { typography } from "../../../../../general/theme/typography";

export default function SingleVendorSearchWithFiltersContainer() {
  const { colors } = useTheme();
  const { t } = useTranslation("general");
  const searchFlow = useSingleVendorSearchFlow();

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        <HomeVisitsSearchInputWithFilter
          searchValue={searchFlow.searchQuery}
          onSearchChangeText={searchFlow.handleChangeText}
          searchPlaceholder={t("search_input_placeholder")}
          onOpenFilters={searchFlow.openFilters}
          isFilterVisible={
            searchFlow.services.length > 0 ||
            searchFlow.serviceCenters.length > 0
          }
          onSubmitEditing={searchFlow.handleSubmitEditing}
          onClear={searchFlow.handleClear}
          onFocus={searchFlow.handleFocus}
          onBlur={searchFlow.handleBlur}
        />

        {searchFlow.hasAppliedFilters && (
          <HomeVisitsSelectedFilterChips
            chips={searchFlow.chips}
            clearAllLabel={t("clear_all")}
            onRemoveChip={searchFlow.removeChip}
            onClearAll={searchFlow.clearAllFilters}
          />
        )}

        <View style={styles.content}>
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

          {searchFlow.showIdleState ? (
            <View style={styles.idleState}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("multi_vendor_address_label")}
                onPress={searchFlow.addressSheet.onOpen}
                style={styles.addressButton}
              >
                <Text
                  color={colors.mutedText}
                  variant="caption"
                  style={styles.addressPrefix}
                >
                  {t("searching_near")}
                </Text>
                <Text
                  numberOfLines={1}
                  weight="medium"
                  style={styles.addressValue}
                >
                  {searchFlow.selectedAddressLabel ??
                    t("multi_vendor_address_label")}
                </Text>
                <Icon
                  type="Ionicons"
                  name="chevron-down"
                  size={16}
                  color={colors.text}
                />
              </Pressable>

              {searchFlow.isLoadingRecommendations ? (
                <SearchSuggestionsSkeleton />
              ) : (
                <SearchSuggestions
                  recommendations={searchFlow.recommendations}
                  onSuggestionPress={searchFlow.handleSuggestionPress}
                />
              )}
            </View>
          ) : null}

          <SearchResults
            isSearchActive={searchFlow.isSearchActive}
            shouldSearchServiceCenters={searchFlow.shouldSearchServiceCenters}
            isSearchLoading={searchFlow.isSearchLoading}
            hasNoResults={searchFlow.hasNoResults}
            services={searchFlow.services}
            serviceCenters={searchFlow.serviceCenters}
            isFetchingMoreServices={searchFlow.isFetchingMoreServices}
            isFetchingMoreServiceCenters={
              searchFlow.isFetchingMoreServiceCenters
            }
            onLoadMoreServices={searchFlow.handleLoadMoreServices}
            onLoadMoreServiceCenters={searchFlow.handleLoadMoreServiceCenters}
            horizontal={false}
          />
        </View>
      </View>

      <AddressSelectionBottomSheet
        addresses={searchFlow.addressSheet?.addresses}
        isLoading={searchFlow.addressSheet?.isLoading}
        isVisible={searchFlow.addressSheet?.isVisible}
        onAddAddress={searchFlow.addressSheet?.onAddAddress}
        onClose={searchFlow.addressSheet?.onClose}
        onSelectAddress={searchFlow.addressSheet?.onSelectAddress}
        onUseCurrentLocation={searchFlow.addressSheet?.onUseCurrentLocation}
        selectingAddressId={searchFlow.addressSheet?.selectingAddressId}
        selectedAddressId={searchFlow.addressSheet?.selectedAddressId}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  content: {
    flex: 1,
  },
  idleState: {
    gap: 12,
  },
  addressButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 8,
    paddingBottom: 4,
  },
  addressPrefix: {
    fontSize: typography.size.xs2,
    lineHeight: typography.lineHeight.sm,
  },
  addressValue: {
    flex: 1,
    fontSize: typography.size.xs2,
    lineHeight: typography.lineHeight.sm,
  },
});
