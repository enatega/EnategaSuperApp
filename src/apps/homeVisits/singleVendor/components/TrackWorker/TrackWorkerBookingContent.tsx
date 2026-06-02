import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useWalletSavedCardsQuery } from '../../../../../general/api/walletSavedCardsService';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type {
  HomeVisitsSingleVendorBookingDetails,
  HomeVisitsSingleVendorBookingServiceItem,
} from '../../api/types';
import type { TrackWorkerStage } from '../../utils/trackWorkerStatus';
import {
  formatAmount,
  isContactVisible,
} from '../../utils/trackWorkerFormatters';

const cashImage = require('../../../assets/images/cash.png');
const visaImage = require('../../../assets/images/visa.png');

type Props = {
  data?: HomeVisitsSingleVendorBookingDetails | null;
  stage: TrackWorkerStage;
  services: HomeVisitsSingleVendorBookingServiceItem[];
  isServiceDetailsExpanded: boolean;
  onToggleServiceDetails: () => void;
  onPressContactWorker: () => void;
};

type AddOnLine = {
  label: string;
  amount: number | null;
};

export default function TrackWorkerBookingContent({
  data,
  stage,
  services,
  isServiceDetailsExpanded,
  onToggleServiceDetails,
  onPressContactWorker,
}: Props) {
  const { t } = useTranslation('homeVisits');
  const { colors } = useTheme();
  const addOnLines = React.useMemo(() => resolveAddOnLines(data), [data]);
  const hasAddOns = addOnLines.length > 0;
  const summary = data?.summary;
  const isPaymentStage = stage === 'payment';
  const savedCardsQuery = useWalletSavedCardsQuery('home-services');
  const hasSavedCard = (savedCardsQuery.data?.cards?.length ?? 0) > 0;
  const baseServiceCharge = getFirstNumeric([summary?.baseServiceCharge]);
  const hourlyRate = getFirstNumeric([summary?.hourlyRate]);
  const itemsUsedAmount = getFirstNumeric([summary?.itemsUsedAmount]);
  const taxAmount = getFirstNumeric([summary?.taxAmount]);
  const shouldShowSummaryItemsUsed = itemsUsedAmount !== null && !hasAddOns;

  return (
    <>
      {isContactVisible(stage) ? (
        <Pressable
          onPress={onPressContactWorker}
          style={[styles.actionRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}
        >
          <View style={styles.actionLeft}>
            <MaterialCommunityIcons color={colors.text} name="message-outline" size={22} />
            <View>
              <Text style={[styles.contactTitle, { color: colors.text }]} weight="medium">
                {t('single_vendor_track_worker_contact_title')}
              </Text>
              <Text style={[styles.contactSubtitle, { color: colors.mutedText }]} weight="medium">
                {t('single_vendor_track_worker_contact_subtitle')}
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons color={colors.iconMuted} name="chevron-right" size={24} />
        </Pressable>
      ) : null}

      <View style={[styles.section, { borderTopColor: colors.border }]}> 
        <Text style={[styles.sectionTitle, { color: colors.text }]} weight="bold">
          {t('single_vendor_track_worker_appointment_details')}
        </Text>

        <View style={styles.keyValueRow}>
          <Text style={[styles.valueLabel, { color: colors.mutedText }]} weight="medium">
            {t('single_vendor_track_worker_booking_number')}
          </Text>
          <Text style={[styles.valueLabel, { color: colors.text }]} weight="semiBold">
            {data?.orderId ? `#${data.orderId.slice(-6)}` : '—'}
          </Text>
        </View>

        <View style={styles.keyValueRow}>
          <Text style={[styles.valueLabel, { color: colors.mutedText }]} weight="medium">
            {t('single_vendor_track_worker_appointment_address')}
          </Text>
          <Text
            numberOfLines={2}
            style={[styles.addressValue, { color: colors.text }]}
            weight="medium"
          >
            {data?.address ?? t('single_vendor_track_worker_address_fallback')}
          </Text>
        </View>
      </View>

      <View style={[styles.section, { borderTopColor: colors.border }]}> 
        <Pressable onPress={onToggleServiceDetails} style={styles.sectionHeaderRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]} weight="bold">
              {t('single_vendor_booking_service_title')}
            </Text>
            <Text style={[styles.sectionSubtitle, { color: colors.mutedText }]} weight="medium">
              {t('single_vendor_booking_service_subtitle')}
            </Text>
          </View>
          <MaterialCommunityIcons
            color={colors.iconMuted}
            name={isServiceDetailsExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
          />
        </Pressable>

        {isServiceDetailsExpanded ? (
          <>
            {services.map((service, index) => (
              <View key={`${service.productId ?? service.name ?? 'service'}-${index}`}>
                <View style={styles.serviceRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.serviceTitle, { color: colors.text }]} weight="medium">
                      {service.name ?? t('single_vendor_bookings_title')}
                    </Text>
                    <Text style={[styles.serviceMeta, { color: colors.mutedText }]} weight="medium">
                      {resolveServiceDurationLabel(service, t)}
                    </Text>
                  </View>
                  <Text style={[styles.serviceTitle, { color: colors.text }]} weight="medium">
                    {formatAmount(
                      resolveServiceAmount({
                        baseServiceCharge,
                        isPaymentStage,
                        service,
                        servicesCount: services.length,
                      }),
                    )}
                  </Text>
                </View>
              </View>
            ))}

            {isPaymentStage && baseServiceCharge !== null ? (
              <>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <Text style={[styles.paymentTitle, { color: colors.text }]} weight="bold">
                  Pricing
                </Text>
                <View style={styles.totalRow}>
                  <Text style={[styles.serviceTitle, { color: colors.mutedText }]} weight="medium">
                    Base Service Charges
                  </Text>
                  <Text style={[styles.serviceTitle, { color: colors.text }]} weight="medium">
                    {formatAmount(baseServiceCharge)}
                  </Text>
                </View>

                <View style={styles.totalRow}>
                  <Text style={[styles.serviceTitle, { color: colors.mutedText }]} weight="medium">
                    Hourly Rate
                  </Text>
                  <Text style={[styles.serviceTitle, { color: colors.text }]} weight="medium">
                    {hourlyRate !== null ? `${formatAmount(hourlyRate)}/hr` : '$-/hr'}
                  </Text>
                </View>

                {shouldShowSummaryItemsUsed ? (
                  <View style={styles.totalRow}>
                    <Text style={[styles.serviceTitle, { color: colors.mutedText }]} weight="medium">
                      Items Used
                    </Text>
                    <Text style={[styles.serviceTitle, { color: colors.text }]} weight="medium">
                      {formatAmount(itemsUsedAmount)}
                    </Text>
                  </View>
                ) : null}

                {taxAmount !== null ? (
                  <View style={styles.totalRow}>
                    <Text style={[styles.serviceTitle, { color: colors.mutedText }]} weight="medium">
                      Tax
                    </Text>
                    <Text style={[styles.serviceTitle, { color: colors.text }]} weight="medium">
                      {formatAmount(taxAmount)}
                    </Text>
                  </View>
                ) : null}
              </>
            ) : null}

            {hasAddOns ? (
              <>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <Text style={[styles.paymentTitle, { color: colors.text }]} weight="bold">
                  Add-On Charges
                </Text>
                {addOnLines.map((item, index) => (
                  <View key={`${item.label}-${index}`} style={styles.totalRow}>
                    <Text style={[styles.serviceTitle, { color: colors.mutedText }]} weight="medium">
                      {item.label}
                    </Text>
                    <Text style={[styles.serviceTitle, { color: colors.text }]} weight="medium">
                      {formatAmount(item.amount)}
                    </Text>
                  </View>
                ))}
              </>
            ) : null}

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {stage === 'payment' ? (
              <>
                <View style={styles.paymentMethodRow}>
                  <Image
                    source={hasSavedCard ? visaImage : cashImage}
                    style={styles.paymentMethodIcon}
                    resizeMode="contain"
                  />
                  <Text style={[styles.paymentMethod, { color: colors.text }]} weight="semiBold">
                    {hasSavedCard
                      ? t('single_vendor_track_worker_online_payment')
                      : t('review_confirm_payment_title')}
                  </Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              </>
            ) : null}

            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]} weight="semiBold">
                {t('single_vendor_booking_total')}
              </Text>
              <Text style={[styles.totalValue, { color: colors.text }]} weight="semiBold">
                {formatAmount(data?.totalAmount ?? data?.summary?.totalAmount ?? data?.summary?.subtotal)}
              </Text>
            </View>
          </>
        ) : null}
      </View>
    </>
  );
}

function resolveServiceDurationLabel(
  service: HomeVisitsSingleVendorBookingServiceItem,
  t: (key: string) => string,
) {
  const quantity = typeof service.quantity === 'number' && service.quantity > 0 ? service.quantity : null;
  const durationLabel = `${service.durationLabel ?? ''}`.trim();

  if (quantity && durationLabel) {
    return `${quantity}${shortenDurationLabel(durationLabel)}`;
  }

  return durationLabel || t('single_vendor_booking_service_duration');
}

function shortenDurationLabel(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.startsWith('hour')) {
    return 'hr';
  }
  if (normalized.startsWith('day')) {
    return 'day';
  }

  return label;
}

function resolveAddOnLines(data?: HomeVisitsSingleVendorBookingDetails | null): AddOnLine[] {
  if (!data) {
    return [];
  }

  const rawUsedItems = Array.isArray((data as { usedItems?: unknown[] }).usedItems)
    ? ((data as { usedItems?: unknown[] }).usedItems as unknown[])
    : [];

  const mappedUsedItems = rawUsedItems
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

      const amount = getFirstNumeric([
        record.totalPrice,
        record.amount,
        record.price,
        record.totalAmount,
      ]);

      return { label, amount };
    })
    .filter((item): item is AddOnLine => Boolean(item));

  if (mappedUsedItems.length > 0) {
    return mappedUsedItems;
  }

  const itemsUsedAmount = getFirstNumeric([
    data.summary?.itemsUsedAmount,
    (data as { itemsUsedAmount?: unknown }).itemsUsedAmount,
  ]);

  if (itemsUsedAmount && itemsUsedAmount > 0) {
    return [{ label: 'Items Used', amount: itemsUsedAmount }];
  }

  return [];
}

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

function resolveServiceAmount({
  service,
  isPaymentStage,
  servicesCount,
  baseServiceCharge,
}: {
  service: HomeVisitsSingleVendorBookingServiceItem;
  isPaymentStage: boolean;
  servicesCount: number;
  baseServiceCharge: number | null;
}) {
  if (isPaymentStage && servicesCount === 1 && baseServiceCharge !== null) {
    return baseServiceCharge;
  }

  return service.totalPrice;
}

const styles = StyleSheet.create({
  actionLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  actionRow: {
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    paddingVertical: 14,
  },
  addressValue: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    marginLeft: 16,
    textAlign: 'right',
  },
  contactSubtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  contactTitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  keyValueRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  paymentMethod: {
    fontSize: 16,
    lineHeight: 24,
  },
  paymentMethodIcon: {
    height: 24,
    width: 34,
  },
  paymentMethodRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  paymentTitle: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 8,
    marginTop: 2,
  },
  section: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 0,
    paddingBottom: 16,
    paddingTop: 16,
  },
  sectionHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 28,
  },
  serviceMeta: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 2,
  },
  serviceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  serviceTitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  totalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    minHeight: 30,
  },
  totalLabel: {
    fontSize: 14,
    lineHeight: 22,
  },
  totalValue: {
    fontSize: 14,
    lineHeight: 22,
  },
  valueLabel: {
    fontSize: 14,
    lineHeight: 22,
  },
});
