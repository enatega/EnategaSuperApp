import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import HorizontalList from '../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../general/components/SectionActionHeader';
import type { AppointmentOrderAgainItem } from '../../api/types';
import AppointmentsOrderAgainCard from './AppointmentsOrderAgainCard';
import AppointmentsProviderSkeleton from './AppointmentsProviderSkeleton';
import AppointmentsSectionEmptyState from './AppointmentsSectionEmptyState';

type Props = {
  title: string;
  items: AppointmentOrderAgainItem[];
  isPending: boolean;
  emptyTitle: string;
  emptyMessage: string;
  actionLabel?: string;
  onActionPress?: () => void;
  onItemPress: (item: AppointmentOrderAgainItem) => void;
  onFavoritePress?: (item: AppointmentOrderAgainItem) => void;
  favoritePendingProductId?: string;
  favoriteOverrides?: Record<string, boolean>;
};

export default function AppointmentsServicesRail({
  title,
  items,
  isPending,
  emptyTitle,
  emptyMessage,
  actionLabel,
  onActionPress,
  onItemPress,
  onFavoritePress,
  favoritePendingProductId,
  favoriteOverrides = {},
}: Props) {
  return (
    <View style={styles.section}>
      <SectionActionHeader
        title={title}
        actionLabel={items.length ? actionLabel : undefined}
        onActionPress={onActionPress}
      />
      {isPending ? (
        <AppointmentsProviderSkeleton />
      ) : items.length === 0 ? (
        <AppointmentsSectionEmptyState
          title={emptyTitle}
          message={emptyMessage}
        />
      ) : (
        <HorizontalList
          data={items}
          keyExtractor={(item) => item.productId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              onPress={() => onItemPress(item)}
            >
              <AppointmentsOrderAgainCard
                item={item}
                isFavorite={
                  favoriteOverrides[item.productId] ?? item.isFavorite ?? false
                }
                isFavoritePending={
                  favoritePendingProductId === item.productId
                }
                onFavoritePress={onFavoritePress}
              />
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingRight: 16,
  },
  section: {
    gap: 12,
    paddingHorizontal: 16,
  },
  separator: {
    width: 12,
  },
});
