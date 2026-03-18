import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import Skeleton from '../../../../../general/components/Skeleton';
import { useStoreDetails } from '../../../hooks';
import type {
  DeliveryNearbyStore,
  DeliveryStoreDetailsProduct,
  DeliveryStoreTimings,
} from '../../../api/types';
import StoreDetailListHeader from '../../components/StoreDetails/StoreDetailListHeader';
import StoreDetailMenuCard from '../../components/StoreDetails/StoreDetailMenuCard';
// import { data } from './storedetaiolsData';

type StoreDetailsParamList = {
  StoreDetails: {
    store?: DeliveryNearbyStore;
  };
};

const STORE_DETAILS_LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 400;

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

  const { data, isPending, error } = useStoreDetails(
    storeId,
    {
      offset: 0,
      limit: STORE_DETAILS_LIMIT,
      search: debouncedSearchValue || undefined,
      selectedCategoryId: selectedCategoryId ?? undefined,
      selectedSubcategoryId: selectedSubcategoryId ?? undefined,
    },
    {
      enabled: Boolean(storeId),
    },
  );
  console.log('store_Data_rrr',JSON.stringify(data,null,2));
  

  useEffect(() => {
    setSearchValue('');
    setDebouncedSearchValue('');
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
  }, [storeId]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId(null);
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    setSelectedSubcategoryId(subcategoryId);
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const store = data?.store;
  const filters = data?.filters;
  const products = data?.products.items ?? [];
  const categories = filters?.categories ?? [];
  const subcategories = filters?.subcategories ?? [];
  const activeCategoryId = filters?.selectedCategoryId ?? selectedCategoryId;
  const activeSubcategoryId = filters?.selectedSubcategoryId ?? selectedSubcategoryId;
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

  if (!storeId) {
    return (
      <View style={[styles.centeredState, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedText }}>{t('store_details_store_missing')}</Text>
      </View>
    );
  }

  if (isPending && !data) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Skeleton height={240} width="100%" borderRadius={0} />
        <View style={styles.loadingContent}>
          <Skeleton height={88} width={88} borderRadius={12} />
          <Skeleton height={24} width="60%" borderRadius={6} />
          <Skeleton height={18} width="80%" borderRadius={6} />
          <Skeleton height={46} width="100%" borderRadius={12} />
          <Skeleton height={44} width="100%" borderRadius={0} />
          <Skeleton height={180} width="100%" borderRadius={12} />
        </View>
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={[styles.centeredState, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.mutedText }}>{t('store_details_load_error')}</Text>
      </View>
    );
  }

  return (
    <FlatList<DeliveryStoreDetailsProduct>
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={{ color: colors.mutedText }}>{t('store_details_no_items')}</Text>
        </View>
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
      data={products}
      keyExtractor={(item) => item.productId}
      numColumns={2}
      renderItem={({ item }) => <StoreDetailMenuCard item={item} />}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.background }}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
  },
  loadingContent: {
    gap: 16,
    padding: 16,
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
});
