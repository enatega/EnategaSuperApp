import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import HorizontalList from '../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../general/components/SectionActionHeader';
import type { AppointmentProvider } from '../../api/types';
import { useAppointmentNearbyProviders } from '../../hooks/useDiscoveryQueries';
import AppointmentsProviderCard from './AppointmentsProviderCard';
import AppointmentsProviderSkeleton from './AppointmentsProviderSkeleton';
import AppointmentsSectionEmptyState from './AppointmentsSectionEmptyState';

type Props = {
  title: string;
  actionLabel: string;
  emptyTitle: string;
  emptyMessage: string;
  onActionPress: () => void;
  onItemPress: (provider: AppointmentProvider) => void;
};

export default function AppointmentsNearbyProvidersSection({
  title,
  actionLabel,
  emptyTitle,
  emptyMessage,
  onActionPress,
  onItemPress,
}: Props) {
  const { data: providers = [], isPending } = useAppointmentNearbyProviders({
    limit: 8,
  });

  return (
    <View style={styles.section}>
      <SectionActionHeader
        title={title}
        actionLabel={providers.length ? actionLabel : undefined}
        onActionPress={onActionPress}
      />

      {isPending ? (
        <AppointmentsProviderSkeleton />
      ) : !providers.length ? (
        <AppointmentsSectionEmptyState
          title={emptyTitle}
          message={emptyMessage}
        />
      ) : (
        <HorizontalList
          data={providers}
          keyExtractor={(item) => item.storeId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <Pressable accessibilityRole="button" onPress={() => onItemPress(item)}>
              <AppointmentsProviderCard provider={item} />
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
