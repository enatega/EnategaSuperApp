import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { AppointmentOrderAgainItem } from '../../api/types';
import AppointmentsProviderSkeleton from '../../components/home/AppointmentsProviderSkeleton';
import AppointmentsSectionEmptyState from '../../components/home/AppointmentsSectionEmptyState';
import { useSingleVendorCategories } from '../hooks/useSingleVendorDiscovery';
import SingleVendorCategoryServiceRow from './SingleVendorCategoryServiceRow';

type Props = {
  emptyTitle: string;
  emptyMessage: string;
  onItemPress: (item: AppointmentOrderAgainItem) => void;
  onFavoritePress: (item: AppointmentOrderAgainItem) => void;
  favoritePendingProductId?: string;
  favoriteOverrides: Record<string, boolean>;
};

export default function SingleVendorCategoryServicesSection({
  emptyTitle,
  emptyMessage,
  onItemPress,
  onFavoritePress,
  favoritePendingProductId,
  favoriteOverrides,
}: Props) {
  const { data: categories = [], isPending } = useSingleVendorCategories();

  return (
    <View style={styles.wrapper}>
      {isPending ? (
        <View style={styles.loading}>
          <AppointmentsProviderSkeleton />
        </View>
      ) : categories.length === 0 ? (
        <View style={styles.empty}>
          <AppointmentsSectionEmptyState
            title={emptyTitle}
            message={emptyMessage}
          />
        </View>
      ) : (
        categories.map((category) => (
          <SingleVendorCategoryServiceRow
            category={category}
            emptyTitle={emptyTitle}
            emptyMessage={emptyMessage}
            key={category.id}
            onItemPress={onItemPress}
            onFavoritePress={onFavoritePress}
            favoritePendingProductId={favoritePendingProductId}
            favoriteOverrides={favoriteOverrides}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    paddingHorizontal: 16,
  },
  loading: {
    paddingHorizontal: 16,
  },
  wrapper: {
    gap: 14,
  },
});
