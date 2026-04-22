import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../general/theme/theme';
import type { HomeVisitsSingleVendorServiceBookingScreenResponse } from '../../types/serviceDetails';
import ServiceDetailsFooter from './ServiceDetailsFooter';
import ServiceDetailsHeroSummary from './ServiceDetailsHeroSummary';
import ServiceDetailsOptionsSection from './ServiceDetailsOptionsSection';

type Props = {
  data: HomeVisitsSingleVendorServiceBookingScreenResponse;
  onBack: () => void;
  onClose: () => void;
  onBookService: () => void;
  onRatingPress?: () => void;
};

function formatPrice(value: number | null | undefined) {
  if (value == null) {
    return null;
  }

  return `$${value.toLocaleString()}`;
}

export default function ServiceDetailsContent({
  data,
  onBack,
  onClose,
  onBookService,
  onRatingPress,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();

  const basePrice = formatPrice(data.basePrice);
  const totalPrice = formatPrice(data.pricingSummary.totalPrice);
  const durationLabel = data.pricingSummary.estimatedDurationLabel;
  const serviceCountLabel =
    data.pricingSummary.serviceCount === 1
      ? t('service_details_service_singular')
      : t('service_details_service_plural');

  React.useEffect(() => {
    console.log('[ServiceDetailsContent] render snapshot', {
      serviceId: data.serviceId,
      title: data.title,
      basePrice,
      totalPrice,
      durationLabel,
      serviceCount: data.pricingSummary.serviceCount,
      serviceCountLabel,
      serviceTypeSections: data.serviceTypeSections.map((section) => ({
        groupId: section.groupId,
        heading: section.heading,
        options: section.options.length,
      })),
      additionalServiceSections: data.additionalServiceSections.map((section) => ({
        groupId: section.groupId,
        heading: section.heading,
        options: section.options.length,
      })),
    });
  }, [
    basePrice,
    data.additionalServiceSections,
    data.pricingSummary.serviceCount,
    data.serviceId,
    data.serviceTypeSections,
    data.title,
    durationLabel,
    serviceCountLabel,
    totalPrice,
  ]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: insets.bottom + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ServiceDetailsHeroSummary
          data={data}
          basePrice={basePrice}
          durationLabel={durationLabel}
          onBack={onBack}
          onClose={onClose}
          onRatingPress={onRatingPress}
        />

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {data.serviceTypeSections.map((section) => (
          <ServiceDetailsOptionsSection
            key={section.groupId}
            section={section}
            titleFallback={t('service_details_service_type_fallback')}
            variant="radio"
          />
        ))}

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {data.additionalServiceSections.map((section) => (
          <ServiceDetailsOptionsSection
            key={section.groupId}
            section={section}
            titleFallback={t('service_details_additional_services_fallback')}
            variant="checkbox"
          />
        ))}
      </ScrollView>

      <ServiceDetailsFooter
        durationLabel={durationLabel}
        onBookService={onBookService}
        serviceCount={data.pricingSummary.serviceCount}
        serviceCountLabel={serviceCountLabel}
        totalPrice={totalPrice}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});
