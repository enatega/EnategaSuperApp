import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AppPopup from '../../../../../general/components/AppPopup';
import Text from '../../../../../general/components/Text';
import { showToast } from '../../../../../general/components/AppToast';
import useDebouncedValue from '../../../../../general/hooks/useDebouncedValue';
import { useTheme } from '../../../../../general/theme/theme';
import { useStoreProducts, useStoreView } from '../../../hooks';
import type {
  DeliveryNearbyStore,
  DeliveryStoreTimings,
} from '../../../api/types';
import StoreDetailListHeader from '../../components/StoreDetails/StoreDetailListHeader';
import StoreDetailProductsList from '../../components/StoreDetails/StoreDetailProductsList';
import StoreDetailsScreenSkeleton from '../../components/StoreDetails/StoreDetailsScreenSkeleton';
import { useToggleFavouriteMutation } from '../../hooks/useToggleFavouriteMutation';
// import { data } from './storedetaiolsData';

type StoreDetailsParamList = {
  StoreDetails: {
    store?: DeliveryNearbyStore;
  };
};

const SEARCH_DEBOUNCE_MS = 450;
const MIN_SEARCH_QUERY_LENGTH = 2;

function getTodayStoreHours(
  storeTimings?: DeliveryStoreTimings | null,
  fallback?: string,
) {
  if (!storeTimings) {
    return fallback ?? null;
  }

  const dayKey = new Intl.DateTimeFormat('en-US', { weekday: 'long' })
    .format(new Date())
    .toLowerCase();
  const daySchedule = storeTimings[dayKey];

  if (!daySchedule) {
    return fallback ?? null;
  }

  if (!daySchedule.is_active || daySchedule.slots.length === 0) {
    return fallback ?? null;
  }

  const firstSlot = daySchedule.slots[0];

  if (!firstSlot?.open || !firstSlot?.close) {
    return fallback ?? null;
  }

  return `${firstSlot.open} - ${firstSlot.close}`;
}

export default function StoreDetailsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation();
  const route = useRoute<RouteProp<StoreDetailsParamList, 'StoreDetails'>>();
  const [searchValue, setSearchValue] = useState('');
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const selectedStore = route.params?.store;
  const storeId = selectedStore?.storeId ?? '';
  const [optimisticFav, setOptimisticFav] = useState<boolean | null>(null);

  const { mutate: toggleFavourite, isPending: isTogglingFavourite } = useToggleFavouriteMutation({
    storeId,
    onSuccess: (data) => {
      // Clear optimistic state — storeView refetch will provide truth
      setOptimisticFav(null);
      showToast.success(
        data.isFavorite
          ? t('favourites_toggle_added')
          : t('favourites_toggle_removed'),
      );
    },
    onError: () => {
      setOptimisticFav(null);
      showToast.error(t('favourites_toggle_error'));
    },
  });

  const normalizedSearchValue = useMemo(
    () => searchValue.replace(/\s+/g, ' ').trim(),
    [searchValue],
  );
  const debouncedSearchValue = useDebouncedValue(normalizedSearchValue, SEARCH_DEBOUNCE_MS);
  const effectiveSearchValue =
    normalizedSearchValue.length >= MIN_SEARCH_QUERY_LENGTH ? debouncedSearchValue : '';

  const {
    data: storeData,
    error: storeError,
    isPending: isStorePending,
  } = useStoreView(storeId, { enabled: Boolean(storeId) });

  const handleFavouritePress = useCallback(() => {
    setOptimisticFav((prev) => {
      const current = prev ?? storeData?.isFavorited ?? selectedStore?.isFavorite ?? false;
      return !current;
    });
    toggleFavourite({ storeId });
  }, [storeId, storeData, selectedStore, toggleFavourite]);

  const {
    data: productsData,
    error: productsError,
    fetchNextPage,
    hasNextPage,
    isFetched: hasFetchedProducts,
    isFetchingNextPage,
    refetch: refetchProducts,
  } = useStoreProducts(
    storeId,
    {
      search: effectiveSearchValue || undefined,
      selectedCategoryId: selectedCategoryId ?? undefined,
      selectedSubcategoryId: selectedSubcategoryId ?? undefined,
    },
    {
      enabled: Boolean(storeId),
    },
  );

  useEffect(() => {
    setIsInfoModalVisible(false);
    setSearchValue('');
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
  }, [storeId]);

  const store = storeData;
  const categories = store?.categories ?? [];
  const subcategories = store?.subcategories ?? [];
  const products = useMemo(
    () => productsData?.pages.flatMap((page) => page.items) ?? [],
    [productsData],
  );
  const activeCategoryId = selectedCategoryId;
  const activeCategory = useMemo(
    () => categories.find((category) => category.id === activeCategoryId) ?? null,
    [activeCategoryId, categories],
  );
  const visibleSubcategories = useMemo(() => {
    if (activeCategory == null) {
      return [];
    }

    const activeCategorySubcategoryIds = Array.isArray(activeCategory.subcategoryIds)
      ? activeCategory.subcategoryIds
      : null;

    return activeCategorySubcategoryIds
      ? subcategories.filter((subcategory) =>
          activeCategorySubcategoryIds.includes(subcategory.id),
        )
      : subcategories;
  }, [activeCategory, subcategories]);
  const activeSubcategoryId = selectedSubcategoryId;

  useEffect(() => {
    if (visibleSubcategories.length === 0) {
      if (selectedSubcategoryId !== null) {
        setSelectedSubcategoryId(null);
      }

      return;
    }

    const hasSelectedVisibleSubcategory = visibleSubcategories.some(
      (subcategory) => subcategory.id === selectedSubcategoryId,
    );

    if (!hasSelectedVisibleSubcategory) {
      setSelectedSubcategoryId(visibleSubcategories[0].id);
    }
  }, [selectedSubcategoryId, visibleSubcategories]);

  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setSelectedCategoryId(categoryId);

    if (!categoryId) {
      setSelectedSubcategoryId(null);
      return;
    }

    const nextCategory = categories.find((category) => category.id === categoryId) ?? null;
    const nextCategorySubcategoryIds = Array.isArray(nextCategory?.subcategoryIds)
      ? nextCategory.subcategoryIds
      : null;
    const nextVisibleSubcategories = nextCategorySubcategoryIds
      ? subcategories.filter((subcategory) =>
          nextCategorySubcategoryIds.includes(subcategory.id),
        )
      : subcategories;

    setSelectedSubcategoryId(nextVisibleSubcategories[0]?.id ?? null);
  }, [categories, subcategories]);

  const handleSubcategorySelect = useCallback((subcategoryId: string) => {
    setSelectedSubcategoryId(subcategoryId);
  }, []);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOpenInfoModal = useCallback(() => {
    setIsInfoModalVisible(true);
  }, []);

  const handleCloseInfoModal = useCallback(() => {
    setIsInfoModalVisible(false);
  }, []);

  const handleLoadMoreProducts = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const storeName = store?.name ?? selectedStore?.name ?? t('store_details_store_name');
  const rating = store?.averageRating ?? selectedStore?.averageRating ?? null;
  const reviewCount = store?.reviewCount ?? selectedStore?.reviewCount ?? null;
  const deliveryFee =
    typeof store?.baseFee === 'number'
      ? `$${store.baseFee}`
      : typeof selectedStore?.baseFee === 'number'
        ? `$${selectedStore.baseFee}`
        : null;
  const distance =
    typeof selectedStore?.distanceKm === 'number'
      ? `${selectedStore.distanceKm.toFixed(1)} km`
      : null;
  const coverImageUrl =
    store?.coverImage ?? selectedStore?.coverImage ?? 'https://placehold.co/1400x800.png';
  const logoImageUrl = store?.logo ?? selectedStore?.logo ?? 'https://placehold.co/176x176.png';
  const heroTitle = '';
  const hours = getTodayStoreHours(store?.storeTimings, t('store_details_hours_unavailable'));
  const phone = store?.contact?.phone ?? null;
  const email = store?.contact?.email ?? null;
  const sectionTitle = activeCategory?.name ?? t('store_details_all_offered_items');
  const shouldShowProductSkeletons = !hasFetchedProducts && !productsData && !productsError;
  const productsContentKey = [
    activeCategoryId ?? 'offers',
    activeSubcategoryId ?? 'all',
    effectiveSearchValue || 'all',
  ].join(':');
  const headerComponent = useMemo(
    () => (
      <StoreDetailListHeader
        activeCategoryId={activeCategoryId}
        activeSubcategoryId={activeSubcategoryId}
        categories={categories}
        coverImageUrl={coverImageUrl}
        deliveryFee={deliveryFee}
        distance={distance}
        email={email}
        heroTitle={heroTitle}
        hours={hours}
        logoImageUrl={logoImageUrl}
        onBackPress={handleBackPress}
        onCategorySelect={handleCategorySelect}
        onFavouritePress={handleFavouritePress}
        onInfoPress={handleOpenInfoModal}
        onSearchChange={setSearchValue}
        onSubcategorySelect={handleSubcategorySelect}
        phone={phone}
        rating={rating}
        reviewCount={reviewCount}
        isFavourite={optimisticFav ?? storeData?.isFavorited ?? selectedStore?.isFavorite ?? false}
        isFavouriteLoading={isTogglingFavourite}
        searchValue={searchValue}
        sectionTitle={sectionTitle}
        storeName={storeName}
        subcategories={visibleSubcategories}
      />
    ),
    [
      activeCategoryId,
      activeSubcategoryId,
      categories,
      coverImageUrl,
      deliveryFee,
      distance,
      email,
      heroTitle,
      hours,
      logoImageUrl,
      handleBackPress,
      handleCategorySelect,
      handleFavouritePress,
      handleOpenInfoModal,
      handleSubcategorySelect,
      phone,
      rating,
      reviewCount,
      optimisticFav,
      isTogglingFavourite,
      searchValue,
      sectionTitle,
      storeName,
      visibleSubcategories,
    ],
  );

  if (!storeId) {
    return (
      <View style={[styles.centeredState, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedText }}>{t('store_details_store_missing')}</Text>
      </View>
    );
  }

  if (isStorePending && !storeData) {
    return <StoreDetailsScreenSkeleton />;
  }

  if (storeError && !storeData) {
    return (
      <View style={[styles.centeredState, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedText }}>{t('store_details_load_error')}</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={colors.primary} size="small" />
            </View>
          ) : null
        }
        ListHeaderComponent={headerComponent}
        contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}
        contentInsetAdjustmentBehavior="never"
        data={PRODUCT_LIST_DATA}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMoreProducts}
        onEndReachedThreshold={0.4}
        renderItem={() => (
          <StoreDetailProductsList
            activeCategoryId={activeCategoryId}
            categories={categories}
            contentLayoutKey={productsContentKey}
            emptyText={t('store_details_no_items')}
            errorText={productsError?.message ?? t('store_details_load_error')}
            hasError={Boolean(productsError)}
            hasFetchedProducts={hasFetchedProducts}
            onCategorySelect={handleCategorySelect}
            onRetry={() => {
              void refetchProducts();
            }}
            products={products}
            shouldShowProductSkeletons={shouldShowProductSkeletons}
            storeId={storeId}
          />
        )}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: colors.background }}
      />

      <AppPopup
        description={store?.description?.trim() || t('store_details_about_fallback')}
        dismissOnOverlayPress
        onRequestClose={handleCloseInfoModal}
        primaryAction={{
          label: t('store_details_close'),
          onPress: handleCloseInfoModal,
        }}
        showPrimaryAction={false}
        title={t('store_details_about_title')}
        visible={isInfoModalVisible}
        
      />
    </>
  );
}

const PRODUCT_LIST_DATA = [{ id: 'store-detail-products' }] as const;

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  centeredState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  footerLoader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});
