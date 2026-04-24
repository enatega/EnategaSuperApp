import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Skeleton from '../../../../../general/components/Skeleton';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type { HomeVisitsSingleVendorBookingServiceItem } from '../../api/types';

type Props = {
  isLoading: boolean;
  services: HomeVisitsSingleVendorBookingServiceItem[];
  totalAmount: string;
  resolveDurationLabel: (label: string | null | undefined, fallback: string) => string;
  formatAmount: (value?: number | string | null) => string;
  resolveServiceTotalPrice: (service: HomeVisitsSingleVendorBookingServiceItem) => number | null;
};

export default function BookingDetailsServicesSection({
  formatAmount,
  isLoading,
  resolveDurationLabel,
  resolveServiceTotalPrice,
  services,
  totalAmount,
}: Props) {
  const { t } = useTranslation('homeVisits');
  const { colors, typography } = useTheme();

  return (
    <View style={styles.section}>
      <Text
        style={{
          color: colors.text,
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.lg2,
        }}
        weight="bold"
      >
        {t('single_vendor_booking_service_title')}
      </Text>
      <Text
        style={{
          color: colors.mutedText,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
          marginBottom: 8,
        }}
        weight="medium"
      >
        {t('single_vendor_booking_service_subtitle')}
      </Text>

      {isLoading ? (
        <Skeleton
          height={66}
          width="100%"
        />
      ) : (
        <View>
          {services.map((service, index) => (
            <View key={`${service.productId ?? service.name ?? 'service'}-${index}`}>
              <View style={styles.serviceRow}>
                <View style={styles.serviceText}>
                  <Text
                    style={{
                      color: colors.text,
                      fontSize: typography.size.sm2,
                      lineHeight: typography.lineHeight.md,
                    }}
                    weight="medium"
                  >
                    {service.name ?? t('single_vendor_bookings_title')}
                  </Text>
                  <Text
                    style={{
                      color: colors.mutedText,
                      fontSize: typography.size.sm2,
                      lineHeight: typography.lineHeight.md,
                    }}
                    weight="medium"
                  >
                    {resolveDurationLabel(
                      service.durationLabel,
                      t('single_vendor_booking_service_duration'),
                    )}
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: typography.size.sm2,
                    lineHeight: typography.lineHeight.md,
                  }}
                  weight="medium"
                >
                  {formatAmount(resolveServiceTotalPrice(service))}
                </Text>
              </View>
              {index < services.length - 1 ? (
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: colors.border },
                  ]}
                />
              ) : null}
            </View>
          ))}

          {services.length === 0 ? (
            <Text
              style={{
                color: colors.mutedText,
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.md,
              }}
              weight="medium"
            >
              {t('single_vendor_home_section_empty_message')}
            </Text>
          ) : null}
        </View>
      )}

      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <View style={styles.totalRow}>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
          weight="medium"
        >
          {t('single_vendor_booking_total')}
        </Text>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
          weight="medium"
        >
          {totalAmount}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    marginVertical: 8,
  },
  section: {
    paddingTop: 14,
  },
  serviceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  serviceText: {
    flex: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
});
