import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import { useStoreProducts, useStoreView } from '../../../hooks';
import type {
  DeliveryNearbyStore,
  DeliveryStoreDetailsProduct,
  DeliveryStoreTimings,
} from '../../../api/types';
import {
  getStoreDetailSwipeTargetCategoryId,
  type StoreDetailSwipeDirection,
} from '../../hooks/useStoreDetailSwiper';
import StoreDetailListHeader from '../../components/StoreDetails/StoreDetailListHeader';
import StoreDetailMenuCard from '../../components/StoreDetails/StoreDetailMenuCard';
import StoreDetailMenuCardSkeleton from '../../components/StoreDetails/StoreDetailMenuCardSkeleton';
import StoreDetailsScreenSkeleton from '../../components/StoreDetails/StoreDetailsScreenSkeleton';
// import { data } from './storedetaiolsData';

type StoreDetailsParamList = {
  StoreDetails: {
    store?: DeliveryNearbyStore;
  };
};

const SEARCH_DEBOUNCE_MS = 400;
const STORE_DETAIL_PRODUCT_SKELETON_ITEMS = Array.from({ length: 4 }, (_, index) => ({
  id: `store-detail-product-skeleton-${index}`,
  isSkeleton: true as const,
}));

type StoreDetailSkeletonItem = (typeof STORE_DETAIL_PRODUCT_SKELETON_ITEMS)[number];
type StoreDetailListItem =
  | DeliveryStoreDetailsProduct
  | StoreDetailSkeletonItem;

function isStoreDetailSkeletonItem(item: StoreDetailListItem): item is StoreDetailSkeletonItem {
  return (item as StoreDetailSkeletonItem).isSkeleton === true;
}

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
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const selectedStore = route.params?.store;
  const storeId = selectedStore?.storeId ?? '';

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchValue(searchValue.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchValue]);

  const {
    data: storeData,
    error: storeError,
    isPending: isStorePending,
  } = useStoreView(
    storeId,
    {
      enabled: Boolean(storeId),
    },
  );
  console.log('storrrrr_data',JSON.stringify(storeData,null,2));
  

  const {
    data: productsData,
    error: productsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isProductsPending,
  } = useStoreProducts(
    storeId,
    {
      search: debouncedSearchValue || undefined,
      selectedCategoryId: selectedCategoryId ?? undefined,
      selectedSubcategoryId: selectedSubcategoryId ?? undefined,
    },
    {
      enabled: Boolean(storeId),
    },
  );
console.log('productsData_Data___',JSON.stringify(productsData,null,2));

  useEffect(() => {
    setSearchValue('');
    setDebouncedSearchValue('');
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
  }, [storeId]);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(null);
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategoryId(subcategoryId);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleLoadMoreProducts = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const store = storeData;
  const products = productsData?.pages.flatMap((page) => page.items) ?? [];
  const categories = store?.categories ?? [];
  const subcategories = store?.subcategories ?? [];
  const activeCategoryId = selectedCategoryId;
  const activeSubcategoryId = selectedSubcategoryId;
  const activeCategory = categories.find((category) => category.id === activeCategoryId) ?? null;

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
  const heroTitle = store?.tagLine ?? store?.description ?? t('store_details_hero_title');
  const hours = getTodayStoreHours(store?.storeTimings, t('store_details_hours_unavailable'));
  const phone = store?.contact?.phone ?? null;
  const email = store?.contact?.email ?? null;
  const sectionTitle = activeCategory?.name ?? t('store_details_all_offered_items');
  const shouldShowProductSkeletons = isProductsPending && !productsData;
  const listData: StoreDetailListItem[] = shouldShowProductSkeletons
    ? STORE_DETAIL_PRODUCT_SKELETON_ITEMS
    : products;

  const handleCategorySwipe = (direction: StoreDetailSwipeDirection) => {
    const nextCategoryId = getStoreDetailSwipeTargetCategoryId({
      activeCategoryId,
      categories,
      direction,
    });

    if (typeof nextCategoryId === 'undefined' || nextCategoryId === activeCategoryId) {
      return;
    }

    handleCategorySelect(nextCategoryId);
  };

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

  if ((storeError && !storeData) || (productsError && !productsData)) {
    return (
      <View style={[styles.centeredState, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedText }}>{t('store_details_load_error')}</Text>
      </View>
    );
  }

  return (
    <FlatList<StoreDetailListItem>
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={{ color: colors.mutedText }}>{t('store_details_no_items')}</Text>
        </View>
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator color={colors.primary} size="small" />
          </View>
        ) : null
      }
      ListHeaderComponent={
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
          onSearchChange={setSearchValue}
          onSubcategorySelect={handleSubcategorySelect}
          phone={phone}
          rating={rating}
          reviewCount={reviewCount}
          searchValue={searchValue}
          sectionTitle={sectionTitle}
          storeName={storeName}
          subcategories={subcategories}
        />
      }
      columnWrapperStyle={styles.column}
      contentContainerStyle={[styles.content, { backgroundColor: colors.background }]}
      contentInsetAdjustmentBehavior="automatic"
      data={listData}
      keyExtractor={(item) => item.id}
      numColumns={2}
      onEndReached={handleLoadMoreProducts}
      onEndReachedThreshold={0.4}
      renderItem={({ item }) =>
        isStoreDetailSkeletonItem(item) ? (
          <StoreDetailMenuCardSkeleton />
        ) : (
          <StoreDetailMenuCard item={item} onSwipeCategory={handleCategorySwipe} />
        )
      }
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.background }}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  column: {
    gap: 12,
    paddingHorizontal: 16,
  },
  centeredState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emptyState: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  footerLoader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});
