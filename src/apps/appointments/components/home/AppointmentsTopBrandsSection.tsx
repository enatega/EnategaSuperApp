import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import HorizontalList from '../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../general/components/SectionActionHeader';
import type { AppointmentTopBrand } from '../../api/types';
import { useAppointmentTopBrands } from '../../hooks/useDiscoveryQueries';
import AppointmentsBrandSkeleton from './AppointmentsBrandSkeleton';
import AppointmentsSectionEmptyState from './AppointmentsSectionEmptyState';
import AppointmentsTopBrandCard from './AppointmentsTopBrandCard';

type Props = {
  title: string;
  actionLabel: string;
  emptyTitle: string;
  emptyMessage: string;
  onActionPress: () => void;
  onItemPress: (brand: AppointmentTopBrand) => void;
  canOpenBrand?: (brand: AppointmentTopBrand) => boolean;
};

export default function AppointmentsTopBrandsSection({
  title,
  actionLabel,
  emptyTitle,
  emptyMessage,
  onActionPress,
  onItemPress,
  canOpenBrand,
}: Props) {
  const { data: brands = [], isPending } = useAppointmentTopBrands({ limit: 8 });

  return (
    <View style={styles.section}>
      <SectionActionHeader
        title={title}
        actionLabel={brands.length ? actionLabel : undefined}
        onActionPress={onActionPress}
      />

      {isPending ? (
        <AppointmentsBrandSkeleton />
      ) : !brands.length ? (
        <AppointmentsSectionEmptyState
          title={emptyTitle}
          message={emptyMessage}
        />
      ) : (
        <HorizontalList
          data={brands}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              onPress={() => onItemPress(item)}
              disabled={canOpenBrand ? !canOpenBrand(item) : false}
            >
              <AppointmentsTopBrandCard brand={item} />
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
