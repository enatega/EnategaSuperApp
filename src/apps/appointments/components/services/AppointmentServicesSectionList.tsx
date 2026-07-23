import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import VerticalList from '../../../../general/components/VerticalList';
import { useTheme } from '../../../../general/theme/theme';
import type { AppointmentStoreService } from '../../api/types';
import AppointmentServiceSelectionRow from './AppointmentServiceSelectionRow';
import AppointmentServicesSkeleton from './AppointmentServicesSkeleton';

type Props = {
  isLoading: boolean;
  onServicePress: (service: AppointmentStoreService) => void;
  selectedServiceIds: string[];
  services: AppointmentStoreService[];
  emptyLabel: string;
};

export default function AppointmentServicesSectionList({
  emptyLabel,
  isLoading,
  onServicePress,
  selectedServiceIds,
  services,
}: Props) {
  const { colors, typography } = useTheme();
  const safeServices = Array.isArray(services) ? services : [];
  const safeSelectedIds = Array.isArray(selectedServiceIds) ? selectedServiceIds : [];

  if (isLoading) {
    return <AppointmentServicesSkeleton />;
  }

  if (safeServices.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={{ color: colors.mutedText, fontSize: typography.size.sm }}>{emptyLabel}</Text>
      </View>
    );
  }

  return (
    <VerticalList
      contentContainerStyle={styles.contentContainer}
      data={safeServices}
      estimatedItemSize={92}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AppointmentServiceSelectionRow
          isSelected={safeSelectedIds.includes(item.id)}
          item={item}
          onPress={onServicePress}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 36,
  },
  emptyState: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
});
