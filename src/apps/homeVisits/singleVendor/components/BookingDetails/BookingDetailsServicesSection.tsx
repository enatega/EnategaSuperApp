import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Skeleton from '../../../../../general/components/Skeleton';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type {
  HomeVisitsSingleVendorBookingDetails,
  HomeVisitsSingleVendorBookingServiceItem,
} from '../../api/types';

type Props = {
  details?: HomeVisitsSingleVendorBookingDetails | null;
  isLoading: boolean;
  services: HomeVisitsSingleVendorBookingServiceItem[];
  totalAmount: string;
  resolveDurationLabel: (label: string | null | undefined, fallback: string) => string;
  formatAmount: (value?: number | string | null) => string;
  resolveServiceTotalPrice: (service: HomeVisitsSingleVendorBookingServiceItem) => number | null;
};

export default function BookingDetailsServicesSection({
  details,
  formatAmount,
  isLoading,
  resolveDurationLabel,
  resolveServiceTotalPrice,
  services,
  totalAmount,
}: Props) {
  const { t } = useTranslation('homeVisits');
  const { colors, typography } = useTheme();
  const pricingRows = React.useMemo(() => {
    const summary = details?.summary;
    if (!summary) {
      return [];
    }

    const rows: Array<{ label: string; value: string }> = [];
    const laborAmount = getFirstNumeric([
      summary.laborAmount,
      summary.baseServiceCharge,
    ]);
    const hourlyRate = getFirstNumeric([summary.hourlyRate]);
    const workingHours = getFirstNumeric([summary.workingHours]);
    const itemsUsedAmount = getFirstNumeric([
      summary.itemsUsedAmount,
      summary.materialsAmount,
    ]);
    const subtotalAmount = getFirstNumeric([
      summary.subtotalAmount,
      summary.subtotal,
    ]);
    const discountAmount = getFirstNumeric([summary.discountAmount]);
    const taxAmount = getFirstNumeric([summary.taxAmount]);
    const deliveryFee = getFirstNumeric([summary.deliveryFee]);
    const packingCharges = getFirstNumeric([summary.packingCharges]);
    const riderTip = getFirstNumeric([summary.riderTip]);
    const addOnLines = resolveAddOnLines(details);

    if (laborAmount !== null) {
      rows.push({
        label: t('single_vendor_booking_price_labor'),
        value: formatAmount(laborAmount),
      });
    }

    if (hourlyRate !== null) {
      rows.push({
        label: t('single_vendor_booking_price_hourly_rate'),
        value: `${formatAmount(hourlyRate)}/hr`,
      });
    }

    if (workingHours !== null) {
      rows.push({
        label: t('single_vendor_booking_price_working_hours'),
        value: `${workingHours.toFixed(1)} hrs`,
      });
    }

    if (itemsUsedAmount !== null && itemsUsedAmount > 0 && addOnLines.length === 0) {
      rows.push({
        label: t('single_vendor_booking_price_items_used'),
        value: formatAmount(itemsUsedAmount),
      });
    }

    if (subtotalAmount !== null) {
      rows.push({
        label: t('single_vendor_booking_price_subtotal'),
        value: formatAmount(subtotalAmount),
      });
    }

    if (discountAmount !== null && discountAmount > 0) {
      rows.push({
        label: t('single_vendor_booking_price_discount'),
        value: `- ${formatAmount(discountAmount)}`,
      });
    }

    if (taxAmount !== null) {
      rows.push({
        label: t('single_vendor_booking_price_tax'),
        value: formatAmount(taxAmount),
      });
    }

    if (deliveryFee !== null && deliveryFee > 0) {
      rows.push({
        label: t('single_vendor_booking_price_delivery_fee'),
        value: formatAmount(deliveryFee),
      });
    }

    if (packingCharges !== null && packingCharges > 0) {
      rows.push({
        label: t('single_vendor_booking_price_packing_charges'),
        value: formatAmount(packingCharges),
      });
    }

    if (riderTip !== null && riderTip > 0) {
      rows.push({
        label: t('single_vendor_booking_price_tip'),
        value: formatAmount(riderTip),
      });
    }

    addOnLines.forEach((item) => {
      rows.push({
        label: item.label,
        value: formatAmount(item.amount),
      });
    });

    return rows;
  }, [details, formatAmount, t]);

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

      {pricingRows.length > 0 ? (
        <>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.md,
              lineHeight: typography.lineHeight.md,
              marginBottom: 8,
            }}
            weight="bold"
          >
            {t('single_vendor_booking_price_summary_title')}
          </Text>

          {pricingRows.map((row, index) => (
            <View key={`${row.label}-${index}`} style={styles.totalRow}>
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                }}
                weight="medium"
              >
                {row.label}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                }}
                weight="medium"
              >
                {row.value}
              </Text>
            </View>
          ))}
        </>
      ) : null}

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

type AddOnLine = {
  label: string;
  amount: number | null;
};

function getFirstNumeric(values: unknown[]) {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = Number.parseFloat(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return null;
}

function resolveAddOnLines(
  details?: HomeVisitsSingleVendorBookingDetails | null,
): AddOnLine[] {
  if (!details) {
    return [];
  }

  const rawUsedItems = Array.isArray((details as { usedItems?: unknown[] }).usedItems)
    ? ((details as { usedItems?: unknown[] }).usedItems as unknown[])
    : [];

  return rawUsedItems
    .map((item): AddOnLine | null => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const record = item as Record<string, unknown>;
      const label =
        typeof record.itemName === 'string'
          ? record.itemName
          : typeof record.name === 'string'
            ? record.name
            : typeof record.title === 'string'
              ? record.title
              : null;

      if (!label) {
        return null;
      }

      const quantity = getFirstNumeric([record.quantity]);
      const unit = typeof record.unit === 'string' ? record.unit.trim() : '';
      const detailSuffix =
        quantity !== null && quantity > 0
          ? ` x${quantity}${unit ? ` ${unit}` : ''}`
          : '';

      return {
        label: `${label}${detailSuffix}`,
        amount: getFirstNumeric([
          record.totalPrice,
          record.amount,
          record.price,
          record.totalAmount,
        ]),
      };
    })
    .filter((item): item is AddOnLine => Boolean(item));
}
