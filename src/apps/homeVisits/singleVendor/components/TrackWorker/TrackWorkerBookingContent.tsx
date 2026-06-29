import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useWalletSavedCardsQuery } from '../../../../../general/api/walletSavedCardsService';
import Button from '../../../../../general/components/Button';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import SavedCardRow from '../../../components/wallet/SavedCardRow';
import type {
  HomeVisitsSingleVendorBookingDetails,
  HomeVisitsSingleVendorBookingServiceItem,
} from '../../api/types';
import type { TrackWorkerStage } from '../../utils/trackWorkerStatus';
import {
  formatAmount,
  isContactVisible,
} from '../../utils/trackWorkerFormatters';

function formatWeekdaySummary(weekdays?: number[] | null) {
  if (!weekdays?.length) {
    return null;
  }

  return weekdays
    .map((day) =>
      new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(
        new Date(2024, 0, 7 + day),
      ),
    )
    .join(', ');
}

type Props = {
  data?: HomeVisitsSingleVendorBookingDetails | null;
  stage: TrackWorkerStage;
  services: HomeVisitsSingleVendorBookingServiceItem[];
  isServiceDetailsExpanded: boolean;
  onToggleServiceDetails: () => void;
  onPressContactWorker: () => void;
  onPressChangePaymentMethod: () => void;
  onPressAddPaymentMethod: () => void;
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
  onPressChangePaymentMethod,
  onPressAddPaymentMethod,
}: Props) {
  const { t } = useTranslation('homeVisits');
  const { colors } = useTheme();
  const addOnLines = React.useMemo(() => resolveAddOnLines(data), [data]);
  const hasAddOns = addOnLines.length > 0;
  const summary = data?.summary;
  const isPaymentStage = stage === 'payment';
  const savedCardsQuery = useWalletSavedCardsQuery('home-services');
  const savedCards = savedCardsQuery.data?.cards ?? [];
  const selectedCard = savedCards.find((card) => card.isDefault) ?? savedCards[0] ?? null;
  const hasSavedCard = Boolean(selectedCard);
  const laborAmount = getFirstNumeric([summary?.laborAmount, summary?.baseServiceCharge]);
  const hourlyRate = getFirstNumeric([summary?.hourlyRate]);
  const workingHours = getFirstNumeric([summary?.workingHours]);
  const materialsAmount = getFirstNumeric([summary?.materialsAmount, summary?.itemsUsedAmount]);
  const subtotalAmount = getFirstNumeric([summary?.subtotalAmount, summary?.subtotal]);
  const taxAmount = getFirstNumeric([summary?.taxAmount]);
  const shouldShowSummaryItemsUsed = materialsAmount !== null && !hasAddOns;
  const assignedWorkers = data?.assignedWorkers ?? [];
  const assignedTeamLabel = React.useMemo(() => {
    if (assignedWorkers.length === 0 && !data?.assignedWorker) {
      return null;
    }

    const roster = assignedWorkers.length > 0 ? assignedWorkers : data?.assignedWorker ? [data.assignedWorker] : [];
    const supervisorId = data?.supervisorWorkerId ?? data?.assignedWorker?.id;

    return roster
      .map((worker) => {
        const name = worker.name?.trim() || 'Worker';
        const isSupervisor = worker.id === supervisorId || worker.role === 'supervisor';
        return isSupervisor ? `${name} (Lead)` : name;
      })
      .join(', ');
  }, [assignedWorkers, data?.assignedWorker, data?.supervisorWorkerId]);
  const contractDaysLabel = React.useMemo(
    () => formatWeekdaySummary(data?.selectedWeekdays),
    [data?.selectedWeekdays],
  );

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

        {assignedTeamLabel ? (
          <View style={styles.keyValueRow}>
            <Text style={[styles.valueLabel, { color: colors.mutedText }]} weight="medium">
              Assigned team
            </Text>
            <Text
              numberOfLines={3}
              style={[styles.addressValue, { color: colors.text, textAlign: 'right', flex: 1 }]}
              weight="medium"
            >
              {assignedTeamLabel}
            </Text>
          </View>
        ) : null}

        {data?.bookingType === 'contract' ? (
          <>
            <View style={styles.keyValueRow}>
              <Text style={[styles.valueLabel, { color: colors.mutedText }]} weight="medium">
                Contract plan
              </Text>
              <Text style={[styles.valueLabel, { color: colors.text }]} weight="semiBold">
                {data.contractType === 'yearly'
                  ? 'Yearly'
                  : data.contractType === 'monthly'
                    ? 'Monthly'
                    : 'Contract'}
              </Text>
            </View>

            {contractDaysLabel ? (
              <View style={styles.keyValueRow}>
                <Text style={[styles.valueLabel, { color: colors.mutedText }]} weight="medium">
                  Visit days
                </Text>
                <Text
                  numberOfLines={2}
                  style={[styles.addressValue, { color: colors.text, textAlign: 'right', flex: 1 }]}
                  weight="medium"
                >
                  {contractDaysLabel}
                </Text>
              </View>
            ) : null}
          </>
        ) : null}
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
                        laborAmount,
                        isPaymentStage,
                        service,
                        servicesCount: services.length,
                      }),
                    )}
                  </Text>
                </View>
              </View>
            ))}

            {isPaymentStage && laborAmount !== null ? (
              <>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <Text style={[styles.paymentTitle, { color: colors.text }]} weight="bold">
                  Pricing
                </Text>
                <View style={styles.totalRow}>
                  <Text style={[styles.serviceTitle, { color: colors.mutedText }]} weight="medium">
                    Labor
                  </Text>
                  <Text style={[styles.serviceTitle, { color: colors.text }]} weight="medium">
                    {formatAmount(laborAmount)}
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

                {workingHours !== null ? (
                  <View style={styles.totalRow}>
                    <Text style={[styles.serviceTitle, { color: colors.mutedText }]} weight="medium">
                      Working Hours
                    </Text>
                    <Text style={[styles.serviceTitle, { color: colors.text }]} weight="medium">
                      {`${workingHours.toFixed(1)} hrs`}
                    </Text>
                  </View>
                ) : null}

                {shouldShowSummaryItemsUsed ? (
                  <View style={styles.totalRow}>
                    <Text style={[styles.serviceTitle, { color: colors.mutedText }]} weight="medium">
                      Items Used
                    </Text>
                    <Text style={[styles.serviceTitle, { color: colors.text }]} weight="medium">
                      {formatAmount(materialsAmount)}
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
                <View
                  style={[
                    styles.paymentMethodCard,
                    { borderColor: colors.border, backgroundColor: colors.background },
                  ]}
                >
                  <View style={styles.paymentMethodHeader}>
                    <Text style={[styles.paymentTitle, { color: colors.text }]} weight="bold">
                      Payment method
                    </Text>
                    <Text style={[styles.paymentMethodHint, { color: colors.mutedText }]} weight="medium">
                      {hasSavedCard ? 'Default card' : t('review_confirm_payment_title')}
                    </Text>
                  </View>

                  {selectedCard ? (
                    <View style={styles.paymentMethodContent}>
                      <SavedCardRow
                        brand={selectedCard.brand}
                        holderName={selectedCard.name?.trim() || `${selectedCard.brand.toUpperCase()} Card`}
                        subtitle={`•••• •••• •••• ${selectedCard.last4}`}
                        secondarySubtitle={`${String(selectedCard.expMonth).padStart(2, '0')}/${String(selectedCard.expYear).slice(-2)}`}
                        isDefault={selectedCard.isDefault}
                        onPress={onPressChangePaymentMethod}
                      />
                      <Text style={[styles.paymentMethodNote, { color: colors.mutedText }]} weight="medium">
                        This card will be charged when you tap Pay Now.
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.noCardWrap}>
                      <MaterialCommunityIcons color={colors.iconMuted} name="credit-card-outline" size={24} />
                      <View style={styles.noCardCopy}>
                        <Text style={[styles.noCardTitle, { color: colors.text }]} weight="semiBold">
                          No saved card yet
                        </Text>
                        <Text style={[styles.noCardSubtitle, { color: colors.mutedText }]} weight="medium">
                          Add a card to continue with payment.
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.paymentActionRow}>
                    {hasSavedCard ? (
                      <Button
                        label="Change card"
                        onPress={onPressChangePaymentMethod}
                        variant="secondary"
                        icon={<MaterialCommunityIcons color={colors.text} name="swap-horizontal" size={18} />}
                        style={styles.paymentActionButton}
                      />
                    ) : null}
                    <Button
                      label={hasSavedCard ? 'Add card' : 'Add card to pay'}
                      onPress={onPressAddPaymentMethod}
                      variant={hasSavedCard ? 'ghost' : 'primary'}
                      icon={<MaterialCommunityIcons color={hasSavedCard ? colors.primary : colors.text} name="plus" size={18} />}
                      style={styles.paymentActionButton}
                    />
                  </View>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              </>
            ) : null}

            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]} weight="semiBold">
                {t('single_vendor_booking_total')}
              </Text>
              <Text style={[styles.totalValue, { color: colors.text }]} weight="semiBold">
                {formatAmount(data?.totalAmount ?? data?.summary?.totalAmount ?? subtotalAmount)}
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
  laborAmount,
}: {
  service: HomeVisitsSingleVendorBookingServiceItem;
  isPaymentStage: boolean;
  servicesCount: number;
  laborAmount: number | null;
}) {
  if (isPaymentStage && servicesCount === 1 && laborAmount !== null) {
    return laborAmount;
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
  paymentMethodCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  paymentMethodHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  paymentMethodContent: {
    gap: 8,
  },
  paymentMethodHint: {
    fontSize: 12,
    lineHeight: 18,
  },
  paymentMethodNote: {
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  paymentActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentActionButton: {
    flex: 1,
  },
  noCardWrap: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  noCardCopy: {
    flex: 1,
    gap: 2,
  },
  noCardTitle: {
    fontSize: 15,
    lineHeight: 21,
  },
  noCardSubtitle: {
    fontSize: 12,
    lineHeight: 18,
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
