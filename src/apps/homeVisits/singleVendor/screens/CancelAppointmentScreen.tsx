import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../../../general/components/Button';
import { showToast } from '../../../../general/components/AppToast';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import useSingleVendorBookingDetails from '../hooks/useSingleVendorBookingDetails';
import type { HomeVisitsSingleVendorNavigationParamList } from '../navigation/types';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<
  HomeVisitsSingleVendorNavigationParamList,
  'SingleVendorCancelAppointment'
>;

const FALLBACK_IMAGE = 'https://placehold.co/600x400/png';

function resolveCancelAppointmentErrorMessage(error: unknown, fallbackMessage: string) {
  const message = error instanceof Error ? error.message : '';
  const normalizedMessage = message.trim().toLowerCase();

  if (normalizedMessage.includes('scheduled booking not found')) {
    return fallbackMessage;
  }

  return message || fallbackMessage;
}

export default function CancelAppointmentScreen({ navigation, route }: Props) {
  const { t } = useTranslation('homeVisits');
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const { orderId } = route.params;
  const queryClient = useQueryClient();
  const { data } = useSingleVendorBookingDetails({ orderId });
  const cancelMutation = useMutation({
    mutationFn: () => homeVisitsSingleVendorDiscoveryService.cancelScheduledOrder(orderId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: homeVisitsKeys.singleVendorBookingDetail(orderId),
        }),
        queryClient.invalidateQueries({
          queryKey: homeVisitsKeys.singleVendorBookings(),
          exact: false,
        }),
      ]);
      showToast.success(
        t('single_vendor_cancel_appointment_success_title'),
        t('single_vendor_cancel_appointment_success_message'),
      );
      navigation.pop(2);
    },
    onError: (error) => {
      showToast.error(
        t('single_vendor_cancel_appointment_error_title'),
        resolveCancelAppointmentErrorMessage(
          error,
          t('single_vendor_cancel_appointment_started_message'),
        ),
      );
    },
  });

  const heroImage = data?.services?.[0]?.image ?? data?.store?.image ?? FALLBACK_IMAGE;
  const scheduleLabel = formatShortScheduleDate(data?.scheduledAt ?? data?.orderedAt);
  const serviceName = data?.services?.[0]?.name ?? t('single_vendor_bookings_title');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <View style={styles.barContent}>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={[styles.iconButton, { backgroundColor: colors.backgroundTertiary }]}
          >
            <MaterialCommunityIcons
              color={colors.text}
              name="arrow-left"
              size={22}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.lg,
            lineHeight: typography.lineHeight.lg2,
            marginBottom: 14,
          }}
          weight="bold"
        >
          {t('single_vendor_cancel_appointment_heading')}
        </Text>

        <View style={styles.bookingRow}>
          <Image source={{ uri: heroImage }} style={styles.image} />
          <View style={styles.info}>
            <Text
              style={{
                color: colors.text,
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.md,
              }}
              weight="semiBold"
            >
              {scheduleLabel}
            </Text>
            <Text
              style={{
                color: colors.mutedText,
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.md,
              }}
              weight="medium"
            >
              {serviceName}
            </Text>
          </View>
        </View>

        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md2,
            marginBottom: 18,
            marginTop: 18,
          }}
          weight="regular"
        >
          {t('single_vendor_cancel_appointment_body_top')}
        </Text>

        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md2,
          }}
          weight="regular"
        >
          {t('single_vendor_cancel_appointment_body_bottom')}
        </Text>
      </View>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + 10,
          },
        ]}
      >
        <Button
          label={
            cancelMutation.isPending
              ? t('single_vendor_cancel_appointment_loading')
              : t('single_vendor_cancel_appointment_cta')
          }
          onPress={() => cancelMutation.mutate()}
          isLoading={cancelMutation.isPending}
          style={{ backgroundColor: colors.warning, borderColor: colors.warning }}
          variant="primary"
        />
      </View>
    </View>
  );
}

function formatShortScheduleDate(value?: string | null) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

const styles = StyleSheet.create({
  barContent: {
    height: 64,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  bookingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  footer: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  image: {
    borderRadius: 8,
    height: 49,
    width: 56,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  screen: {
    flex: 1,
  },
  topBar: {
    width: '100%',
  },
});
