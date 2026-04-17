import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  ImageBackground,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Skeleton from '../../../../general/components/Skeleton';
import { showToast } from '../../../../general/components/AppToast';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import useSingleVendorBookingDetails from '../hooks/useSingleVendorBookingDetails';
import type { HomeVisitsSingleVendorNavigationParamList } from '../navigation/types';

type Props = NativeStackScreenProps<
  HomeVisitsSingleVendorNavigationParamList,
  'SingleVendorBookingDetails'
>;

const HERO_FALLBACK_IMAGE = 'https://placehold.co/900x500/png';

export default function BookingDetailsScreen({ navigation, route }: Props) {
  const { t } = useTranslation('homeVisits');
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const { orderId } = route.params;
  const { data, isLoading } = useSingleVendorBookingDetails({ orderId });

  const isCancelled = `${data?.status ?? ''}`.toLowerCase() === 'cancelled';
  const statusLabel = data?.statusLabel ?? t('single_vendor_booking_status_confirmed');
  const scheduledLabel = formatScheduleDate(data?.scheduledAt ?? data?.orderedAt);
  const durationLabel = resolveDurationLabel(
    data?.durationLabel,
    t('single_vendor_booking_default_duration'),
    t,
  );
  const services = data?.services ?? [];
  const totalAmount = formatAmount(
    data?.summary?.subtotal ?? data?.summary?.totalAmount,
  );
  const heroImage =
    data?.categoryImages?.[0]?.imageUrl ??
    data?.image ??
    services[0]?.image ??
    data?.store?.image ??
    HERO_FALLBACK_IMAGE;
  const cancellationPolicy =
    data?.cancellationPolicy ?? t('single_vendor_booking_cancellation_body');
  const scheduledAt = data?.scheduledAt ?? data?.orderedAt;

  const handleAddToCalendar = React.useCallback(async () => {
    try {
      const targetDate = scheduledAt ? new Date(scheduledAt) : new Date();
      const safeDate = Number.isNaN(targetDate.getTime()) ? new Date() : targetDate;

      if (Platform.OS === 'ios') {
        const secondsSinceAppleEpoch = Math.floor(
          safeDate.getTime() / 1000 - 978307200,
        );
        await Linking.openURL(`calshow:${secondsSinceAppleEpoch}`);
        return;
      }

      if (Platform.OS === 'android') {
        await Linking.openURL(`content://com.android.calendar/time/${safeDate.getTime()}`);
        return;
      }

      await Linking.openURL(`https://calendar.google.com/calendar/u/0/r/day/${safeDate.getFullYear()}/${safeDate.getMonth() + 1}/${safeDate.getDate()}`);
    } catch {
      showToast.error(t('single_vendor_booking_calendar_open_error'));
    }
  }, [scheduledAt, t]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{ uri: heroImage }}
          style={styles.hero}
        >
          <View style={[styles.heroOverlay, { backgroundColor: colors.overlayDark20 }]} />
          <View style={[styles.heroActions, { paddingTop: insets.top + 8 }]}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={[
                styles.headerButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                color={colors.text}
                name="arrow-left"
                size={22}
              />
            </Pressable>
            <Pressable
              onPress={() => navigation.goBack()}
              style={[
                styles.headerButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <MaterialCommunityIcons
                color={colors.text}
                name="close"
                size={22}
              />
            </Pressable>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: isCancelled ? colors.danger : colors.success,
              },
            ]}
          >
            <MaterialCommunityIcons
              color={colors.white}
              name={isCancelled ? 'close-circle-outline' : 'check-circle-outline'}
              size={14}
            />
            <Text
              color={colors.white}
              style={styles.badgeText}
              weight="medium"
            >
              {statusLabel}
            </Text>
          </View>

          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.lg,
              lineHeight: typography.lineHeight.lg2,
              marginBottom: 4,
            }}
            weight="bold"
          >
            {scheduledLabel}
          </Text>
          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
            weight="medium"
          >
            {data?.statusMessage ?? durationLabel}
          </Text>

          <Pressable
            onPress={() => {
              void handleAddToCalendar();
            }}
            style={[styles.actionRow, { borderTopColor: colors.border }]}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.backgroundTertiary }]}>
              <MaterialCommunityIcons
                color={colors.primary}
                name="calendar-month-outline"
                size={20}
              />
            </View>
            <View style={styles.actionText}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                }}
                weight="semiBold"
              >
                {t('single_vendor_booking_add_calendar_title')}
              </Text>
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.xs2,
                  lineHeight: typography.lineHeight.sm,
                }}
                weight="medium"
              >
                {t('single_vendor_booking_add_calendar_subtitle')}
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => {
              navigation.navigate('SingleVendorManageAppointment', { orderId });
            }}
            style={[styles.actionRow, { borderTopColor: colors.border }]}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.backgroundTertiary }]}>
              <MaterialCommunityIcons
                color={colors.primary}
                name="square-edit-outline"
                size={20}
              />
            </View>
            <View style={styles.actionText}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                }}
                weight="semiBold"
              >
                {t('single_vendor_booking_manage_title')}
              </Text>
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.xs2,
                  lineHeight: typography.lineHeight.sm,
                }}
                weight="medium"
              >
                {t('single_vendor_booking_manage_subtitle')}
              </Text>
            </View>
          </Pressable>

          <View style={[styles.actionRow, { borderTopColor: colors.border }]}>
            <View style={[styles.actionIcon, { backgroundColor: colors.backgroundTertiary }]}>
              <MaterialCommunityIcons
                color={colors.primary}
                name="crosshairs-gps"
                size={20}
              />
            </View>
            <View style={styles.actionText}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                }}
                weight="semiBold"
              >
                {t('single_vendor_booking_track_title')}
              </Text>
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.xs2,
                  lineHeight: typography.lineHeight.sm,
                }}
                weight="medium"
              >
                {t('single_vendor_booking_track_subtitle')}
              </Text>
            </View>
          </View>

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
                            t,
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

          {data?.customerNote ? (
            <View style={styles.section}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.size.lg,
                  lineHeight: typography.lineHeight.lg2,
                }}
                weight="bold"
              >
                {t('single_vendor_booking_customer_note_title')}
              </Text>
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                }}
                weight="medium"
              >
                {data.customerNote}
              </Text>
            </View>
          ) : null}

          {data?.addressLabel || data?.address ? (
            <View style={styles.section}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.size.lg,
                  lineHeight: typography.lineHeight.lg2,
                }}
                weight="bold"
              >
                {t('single_vendor_booking_address_title')}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                }}
                weight="semiBold"
              >
                {data?.addressLabel ?? t('single_vendor_booking_address_title')}
              </Text>
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                }}
                weight="medium"
              >
                {data?.address}
              </Text>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text
              style={{
                color: colors.text,
                fontSize: typography.size.lg,
                lineHeight: typography.lineHeight.lg2,
              }}
              weight="bold"
            >
              {t('single_vendor_booking_cancellation_title')}
            </Text>
            <Text
              style={{
                color: colors.mutedText,
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.md,
              }}
              weight="medium"
            >
              {cancellationPolicy}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function resolveDurationLabel(
  label: string | null | undefined,
  fallback: string,
  t: (key: string) => string,
) {
  if (!label) {
    return fallback;
  }

  const normalized = label.trim().toLowerCase();

  if (normalized === 'job') {
    return t('single_vendor_booking_duration_job');
  }

  if (normalized === 'service') {
    return t('single_vendor_booking_duration_service');
  }

  return label;
}

function formatScheduleDate(value?: string | null) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatAmount(value?: number | string | null) {
  const numericValue =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseFloat(value)
        : Number.NaN;

  if (!Number.isFinite(numericValue)) {
    return '$-';
  }

  return `$${numericValue.toFixed(2)}`;
}

function resolveServiceTotalPrice(service: {
  totalPrice?: number | string | null;
  unitPrice?: number | string | null;
  quantity?: number | null;
}) {
  const totalPrice =
    typeof service.totalPrice === 'number'
      ? service.totalPrice
      : typeof service.totalPrice === 'string'
        ? Number.parseFloat(service.totalPrice)
        : Number.NaN;

  if (Number.isFinite(totalPrice)) {
    return totalPrice;
  }

  const unitPrice =
    typeof service.unitPrice === 'number'
      ? service.unitPrice
      : typeof service.unitPrice === 'string'
        ? Number.parseFloat(service.unitPrice)
        : Number.NaN;
  const quantity = service.quantity ?? 1;

  if (Number.isFinite(unitPrice) && Number.isFinite(quantity)) {
    return unitPrice * quantity;
  }

  return null;
}

const styles = StyleSheet.create({
  actionIcon: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  actionRow: {
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
  },
  actionText: {
    flex: 1,
    gap: 2,
  },
  badge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 4,
    marginBottom: 10,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 14,
    lineHeight: 22,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  headerButton: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  hero: {
    height: 212,
    justifyContent: 'flex-start',
  },
  heroActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  screen: {
    flex: 1,
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
