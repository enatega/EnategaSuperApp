import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
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
  resolvePaymentMethodLabel,
} from '../../utils/trackWorkerFormatters';

type Props = {
  data?: HomeVisitsSingleVendorBookingDetails | null;
  stage: TrackWorkerStage;
  services: HomeVisitsSingleVendorBookingServiceItem[];
  isServiceDetailsExpanded: boolean;
  onToggleServiceDetails: () => void;
  onPressContactWorker: () => void;
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
            numberOfLines={1}
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
                      {service.durationLabel ?? t('single_vendor_booking_service_duration')}
                    </Text>
                  </View>
                  <Text style={[styles.serviceTitle, { color: colors.text }]} weight="medium">
                    {formatAmount(service.totalPrice)}
                  </Text>
                </View>
              </View>
            ))}

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {stage === 'payment' ? (
              <>
                <Text style={[styles.paymentTitle, { color: colors.text }]} weight="bold">
                  {t('single_vendor_track_worker_payment_by')}
                </Text>
                <Text style={[styles.paymentMethod, { color: colors.text }]} weight="semiBold">
                  {resolvePaymentMethodLabel(data?.paymentMethod, t)}
                </Text>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              </>
            ) : null}

            <View style={styles.totalRow}>
              <Text style={[styles.serviceTitle, { color: colors.text }]} weight="medium">
                {t('single_vendor_booking_total')}
              </Text>
              <Text style={[styles.serviceTitle, { color: colors.text }]} weight="medium">
                {formatAmount(data?.summary?.totalAmount ?? data?.summary?.subtotal ?? data?.totalAmount)}
              </Text>
            </View>
          </>
        ) : null}
      </View>
    </>
  );
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
    paddingVertical: 12,
  },
  addressValue: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
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
    marginVertical: 8,
  },
  keyValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  paymentMethod: {
    fontSize: 16,
    lineHeight: 24,
  },
  paymentTitle: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 10,
  },
  section: {
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 0,
    paddingBottom: 12,
    paddingTop: 12,
  },
  sectionHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 28,
  },
  serviceMeta: {
    fontSize: 14,
    lineHeight: 22,
  },
  serviceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  serviceTitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  valueLabel: {
    fontSize: 14,
    lineHeight: 22,
  },
});
