import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import VerticalList from '../../../../general/components/VerticalList';
import { useTheme } from '../../../../general/theme/theme';
import type {
  AppointmentBookingSelection,
  AppointmentMobileServiceDetail,
  AppointmentServiceCustomizationSection,
  AppointmentStoreService,
} from '../../api/types';
import AppointmentServiceSelectionRow from './AppointmentServiceSelectionRow';
import AppointmentServicesSkeleton from './AppointmentServicesSkeleton';

type Props = {
  isLoading: boolean;
  onServicePress: (service: AppointmentStoreService) => void;
  onVariantPress: (
    service: AppointmentStoreService,
    variant: AppointmentServiceCustomizationSection,
  ) => void;
  selections: AppointmentBookingSelection[];
  selectedServices: AppointmentStoreService[];
  selectedServiceIds: string[];
  services: AppointmentStoreService[];
  emptyLabel: string;
  serviceDetailsById?: Record<string, AppointmentMobileServiceDetail>;
};

export default function AppointmentServicesSectionList({
  emptyLabel,
  isLoading,
  onServicePress,
  onVariantPress,
  selections,
  selectedServiceIds,
  selectedServices,
  serviceDetailsById = {},
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
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AppointmentServiceSelectionRow
          isSelected={safeSelectedIds.includes(item.id)}
          item={
            selectedServices.find((service) => service.id === item.id) ?? item
          }
          onPress={onServicePress}
          onVariantPress={onVariantPress}
          customizationSections={
            serviceDetailsById[item.id]?.customizationSections
          }
          deal={serviceDetailsById[item.id]?.deal}
          selectedVariantGroupId={
            selections
              .find((selection) => selection.serviceId === item.id)
              ?.selectedOptions?.find((option) =>
                serviceDetailsById[item.id]?.customizationSections.some(
                  (section) =>
                    section.type?.toLowerCase() === 'variation' &&
                    section.groupId === option.groupId,
                ),
              )?.groupId ?? null
          }
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
