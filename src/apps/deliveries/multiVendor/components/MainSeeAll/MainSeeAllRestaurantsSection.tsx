import React from 'react';
import { StyleSheet, View } from 'react-native';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import { DiscoveryResultsSkeleton, DiscoverySectionState } from '../../../components/discovery';
import StoreCard from '../../../components/storeCard/StoreCard';
import type { DeliveryNearbyStore } from '../../../api/types';

type Props = {
  title: string;
  actionLabel: string;
  items: DeliveryNearbyStore[];
  isPending: boolean;
  isError: boolean;
  isVertical?: boolean;
  onSeeAllPress: () => void;
  emptyTitle: string;
  emptyMessage: string;
  errorTitle: string;
  errorMessage: string;
};

export default function MainSeeAllRestaurantsSection({
  title,
  actionLabel,
  items,
  isPending,
  isError,
  isVertical = false,
  onSeeAllPress,
  emptyTitle,
  emptyMessage,
  errorTitle,
  errorMessage,
}: Props) {
  const isEmpty = !isPending && !isError && items.length === 0;
  const shouldShowSeeAll = !isPending && !isError && items.length > 0;

  return (
    <View style={styles.section}>
      <SectionActionHeader
        title={title}
        actionLabel={shouldShowSeeAll ? actionLabel : undefined}
        onActionPress={onSeeAllPress}
      />

      {isPending ? (
        <DiscoveryResultsSkeleton />
      ) : isError ? (
        <DiscoverySectionState tone="error" title={errorTitle} message={errorMessage} />
      ) : isEmpty ? (
        <DiscoverySectionState title={emptyTitle} message={emptyMessage} />
      ) : isVertical ? (
        <View style={styles.verticalContent}>
          {items.map((item) => (
            <StoreCard key={item.storeId} store={item} layout="fullWidth" />
          ))}
        </View>
      ) : (
        <HorizontalList
          data={items}
          keyExtractor={(item) => item.storeId}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <StoreCard store={item} />}
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
  verticalContent: {
    gap: 12,
  },
});
