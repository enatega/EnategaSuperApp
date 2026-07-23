import React from 'react';
import { StyleSheet, View } from 'react-native';
import HorizontalList from '../../../../general/components/HorizontalList';
import Skeleton from '../../../../general/components/Skeleton';

const ITEMS = Array.from({ length: 3 }, (_, index) => `provider-skeleton-${index}`);

export default function AppointmentsProviderSkeleton() {
  return (
    <HorizontalList
      data={ITEMS}
      keyExtractor={(item) => item}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={() => (
        <View style={styles.card}>
          <Skeleton height={136} width={250} borderRadius={10} />
          <View style={styles.copy}>
            <Skeleton height={16} width={120} borderRadius={6} />
            <Skeleton height={12} width={210} borderRadius={6} />
            <Skeleton height={12} width={156} borderRadius={6} />
            <Skeleton height={12} width={96} borderRadius={6} />
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    width: 250,
  },
  copy: {
    gap: 6,
    paddingHorizontal: 4,
  },
  listContent: {
    paddingRight: 16,
  },
  separator: {
    width: 12,
  },
});
