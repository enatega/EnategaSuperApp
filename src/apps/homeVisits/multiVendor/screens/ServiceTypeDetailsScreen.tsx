import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../general/components/SectionActionHeader';
import Text from '../../../../general/components/Text';
import {
  DiscoveryCategoryCard,
  DiscoveryCategorySkeleton,
  DiscoverySectionState,
} from '../../../../general/components/discovery';
import type { DiscoveryCategoryItem } from '../../../../general/components/discovery';
import useAddress from '../../../../general/hooks/useAddress';
import { useTheme } from '../../../../general/theme/theme';
import { homeVisitsKeys } from '../../api/queryKeys';
import HomeVisitsSelectedFilterChips from '../../components/filters/HomeVisitsSelectedFilterChips';
import HomeVisitsSeeAllFilterSheet from '../../screens/SeeAllScreen/components/HomeVisitsSeeAllFilterSheet';
import HomeVisitsSeeAllHeader from '../../screens/SeeAllScreen/components/HomeVisitsSeeAllHeader';
import useHomeVisitsSeeAllScreenState from '../../screens/SeeAllScreen/useHomeVisitsSeeAllScreenState';
import DealsSection from '../components/DealsSection';
import NearbyServicesSection from '../components/NearbyServicesSection';
import ProvidersSection from '../components/ProvidersSection';
import useMultiVendorMainServiceCategories from '../hooks/useMultiVendorMainServiceCategories';
import useMultiVendorMainServices from '../hooks/useMultiVendorMainServices';
import type { MultiVendorStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<
  MultiVendorStackParamList,
  'MultiVendorServiceTypeDetails'
>;

type ScreenRouteProp = RouteProp<
  MultiVendorStackParamList,
  'MultiVendorServiceTypeDetails'
>;

function ServiceTypeTabs({
  items,
  selectedMainServiceId,
  onSelectMainService,
}: {
  items: DiscoveryCategoryItem[];
  selectedMainServiceId: string | null;
  onSelectMainService: (mainServiceId: string) => void;
}) {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.tabsContainer, { borderBottomColor: colors.border }]}>
      <ScrollView
        horizontal
        contentContainerStyle={styles.tabsContent}
        showsHorizontalScrollIndicator={false}
      >
        {items.map((item) => {
          const isSelected = item.id === selectedMainServiceId;

          return (
            <Pressable
              key={item.id}
              onPress={() => onSelectMainService(item.id)}
              style={[
                styles.tab,
                {
                  borderBottomColor: isSelected
                    ? colors.primary
                    : 'transparent',
                },
              ]}
            >
              <Text
                weight={isSelected ? 'semiBold' : 'medium'}
                numberOfLines={1}
                style={{
                  color: isSelected ? colors.primary : colors.mutedText,
                  fontSize: typography.size.xs2,
                  lineHeight: typography.lineHeight.sm,
                }}
              >
                {item.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function ServiceTypeDetailsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const queryClient = useQueryClient();
  const { latitude, longitude } = useAddress();
  const state = useHomeVisitsSeeAllScreenState({ t });
  const [selectedMainServiceId, setSelectedMainServiceId] = useState<
    string | null
  >(route.params?.initialMainServiceId ?? null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: mainServices = [], isPending: areMainServicesPending } =
    useMultiVendorMainServices();
  const {
    data: categories = [],
    isPending: areCategoriesPending,
    isError: hasCategoriesError,
  } = useMultiVendorMainServiceCategories(selectedMainServiceId, {
    enabled: Boolean(selectedMainServiceId),
  });

  useEffect(() => {
    if (
      selectedMainServiceId &&
      mainServices.some((service) => service.id === selectedMainServiceId)
    ) {
      return;
    }

    if (mainServices.length > 0) {
      setSelectedMainServiceId(mainServices[0].id);
    }
  }, [mainServices, selectedMainServiceId]);

  useEffect(() => {
    if (categories.length === 0) {
      if (selectedCategoryId !== null) {
        setSelectedCategoryId(null);
      }
      return;
    }

    const hasSelectedCategory = selectedCategoryId
      ? categories.some((category) => category.id === selectedCategoryId)
      : false;

    if (!hasSelectedCategory) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  const selectedMainServiceName = useMemo(() => {
    const selected = mainServices.find(
      (service) => service.id === selectedMainServiceId,
    );

    return selected?.name ?? route.params?.title ?? t('multi_vendor_service_type_title');
  }, [mainServices, route.params?.title, selectedMainServiceId, t]);

  const handleMainServiceSelect = useCallback((mainServiceId: string) => {
    setSelectedMainServiceId(mainServiceId);
    setSelectedCategoryId(null);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      await queryClient.refetchQueries({
        queryKey: homeVisitsKeys.discovery(),
        type: 'active',
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

  const handleCategoriesSeeAll = useCallback(() => {
    if (!selectedMainServiceId) {
      return;
    }

    navigation.navigate('MultiVendorSeeAll', {
      queryType: 'nearby-services',
      scope: 'multi-vendor',
      title: selectedMainServiceName,
      mainServiceId: selectedMainServiceId,
      categoryId: selectedCategoryId ?? undefined,
      latitude,
      longitude,
      cardType: 'service',
    });
  }, [
    latitude,
    longitude,
    navigation,
    selectedCategoryId,
    selectedMainServiceId,
    selectedMainServiceName,
  ]);

  const isCategoryEmpty =
    !areCategoriesPending && !hasCategoriesError && categories.length === 0;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <HomeVisitsSeeAllHeader
        searchPlaceholder={t('home_visits_see_all_search_placeholder')}
        searchValue={state.searchText}
        onSearchChangeText={state.setSearchText}
        isSearchEditable
        onOpenFilters={state.openFilters}
        onMapPress={() => {}}
        isSearchVisible
        isFilterVisible
        isMapVisible={false}
      />
      <View style={styles.chipsWrap}>
        <HomeVisitsSelectedFilterChips
          chips={state.chips}
          clearAllLabel={t('clear_all')}
          onRemoveChip={state.removeChip}
          onClearAll={state.clearAllFilters}
        />
      </View>

      <ServiceTypeTabs
        items={mainServices}
        selectedMainServiceId={selectedMainServiceId}
        onSelectMainService={handleMainServiceSelect}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={(
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              void handleRefresh();
            }}
            tintColor={colors.primary}
          />
        )}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <SectionActionHeader
            actionLabel={
              categories.length > 0 ? t('single_vendor_see_all') : undefined
            }
            title={selectedMainServiceName}
            onActionPress={handleCategoriesSeeAll}
          />

          {areCategoriesPending || areMainServicesPending ? (
            <DiscoveryCategorySkeleton />
          ) : hasCategoriesError ? (
            <DiscoverySectionState
              tone="error"
              title={t('single_vendor_home_section_error_title')}
              message={t('single_vendor_home_section_error_message')}
            />
          ) : isCategoryEmpty ? (
            <DiscoverySectionState
              title={t('single_vendor_home_section_empty_title')}
              message={t('multi_vendor_service_type_categories_empty')}
            />
          ) : (
            <HorizontalList
              data={categories}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.categoryListContent}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedCategoryId;

                return (
                  <DiscoveryCategoryCard
                    imageUrl={item.imageUrl}
                    title={item.name}
                    onPress={() =>
                      setSelectedCategoryId((current) =>
                        current === item.id ? null : item.id,
                      )
                    }
                    imageWrapStyle={{
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    }}
                    titleStyle={{
                      color: isSelected ? colors.primary : colors.text,
                    }}
                  />
                );
              }}
            />
          )}
        </View>

        <ProvidersSection
          title={t('multi_vendor_top_centers_title')}
          emptyMessage={t('multi_vendor_top_centers_empty')}
          scope="top-centers"
          mainServiceId={selectedMainServiceId}
          latitude={latitude}
          longitude={longitude}
        />
        <NearbyServicesSection
          categoryId={selectedCategoryId}
          filters={state.appliedFilters}
          mainServiceId={selectedMainServiceId}
          latitude={latitude}
          longitude={longitude}
          search={state.debouncedSearch}
        />
        <DealsSection
          categoryId={selectedCategoryId}
          filters={state.appliedFilters}
          mainServiceId={selectedMainServiceId}
          latitude={latitude}
          longitude={longitude}
          search={state.debouncedSearch}
        />
        <ProvidersSection
          title={t('multi_vendor_service_providers_title')}
          emptyMessage={t('multi_vendor_service_providers_empty')}
          scope="service-providers"
          mainServiceId={selectedMainServiceId}
          latitude={latitude}
          longitude={longitude}
        />
      </ScrollView>

      <HomeVisitsSeeAllFilterSheet
        visible={state.isFilterSheetVisible}
        filters={state.draftFilters}
        isApplyDisabled={!state.hasDraftFilters && !state.hasAppliedFilters}
        onClose={state.closeFilters}
        onApply={state.applyFilters}
        onClear={state.clearDraftFilters}
        onSelectStock={state.selectStock}
        onSelectPriceTiers={state.selectPriceTiers}
        onSelectSortBy={state.selectSortBy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categoryListContent: {
    paddingRight: 16,
  },
  chipsWrap: {
    paddingHorizontal: 16,
  },
  content: {
    gap: 16,
    paddingBottom: 28,
    paddingTop: 16,
  },
  screen: {
    flex: 1,
  },
  section: {
    gap: 12,
    paddingHorizontal: 16,
  },
  separator: {
    width: 12,
  },
  tab: {
    alignItems: 'center',
    borderBottomWidth: 3,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  tabsContainer: {
    borderBottomWidth: 1,
  },
  tabsContent: {
    minWidth: '100%',
    paddingHorizontal: 16,
  },
});
