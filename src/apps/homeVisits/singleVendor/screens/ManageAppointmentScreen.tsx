import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import Svg from '../../components/Svg';
import type { HomeVisitsSingleVendorBookingsTab } from '../api/types';
import BookingsTabs from '../components/Bookings/BookingsTabs';
import useSingleVendorBookingDetails from '../hooks/useSingleVendorBookingDetails';
import type { HomeVisitsSingleVendorNavigationParamList } from '../navigation/types';

type Props = NativeStackScreenProps<
  HomeVisitsSingleVendorNavigationParamList,
  'SingleVendorManageAppointment'
>;

const FALLBACK_IMAGE = 'https://placehold.co/600x400/png';

export default function ManageAppointmentScreen({ navigation, route }: Props) {
  const { t } = useTranslation('homeVisits');
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const { orderId } = route.params;
  const [activeTab, setActiveTab] =
    React.useState<HomeVisitsSingleVendorBookingsTab>('past');
  const { data, isLoading } = useSingleVendorBookingDetails({ orderId });
  const heroImage = data?.services?.[0]?.image ?? data?.store?.image ?? FALLBACK_IMAGE;
  const scheduleLabel = formatShortScheduleDate(data?.scheduledAt ?? data?.orderedAt);
  const serviceName = data?.services?.[0]?.name ?? t('single_vendor_bookings_title');
  const showEmptyState = !isLoading && !data?.orderId;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
      <View style={[styles.topBar, { paddingTop: insets.top }]}>
        <View style={[styles.barContent, { backgroundColor: colors.background }]}>
          <Pressable
            accessibilityRole="button"
            disabled={showEmptyState}
            onPress={() => navigation.goBack()}
            style={[
              styles.iconButton,
              {
                backgroundColor: colors.backgroundTertiary,
                opacity: showEmptyState ? 0 : 1,
              },
            ]}
          >
            <MaterialCommunityIcons
              color={colors.text}
              name="arrow-left"
              size={22}
            />
          </Pressable>
          <Text
            style={[
              styles.barTitle,
              {
                color: colors.text,
                fontSize: typography.size.lg,
                lineHeight: typography.lineHeight.md,
              },
            ]}
            weight="semiBold"
          >
            {t('single_vendor_manage_appointment_title')}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => navigation.goBack()}
            style={[styles.iconButton, { backgroundColor: colors.backgroundTertiary }]}
          >
            <MaterialCommunityIcons
              color={colors.text}
              name="close"
              size={22}
            />
          </Pressable>
        </View>
      </View>

      {showEmptyState ? (
        <View style={[styles.content, styles.emptyContent]}>
          <BookingsTabs
            activeTab={activeTab}
            ongoingLabel={t('single_vendor_bookings_tab_ongoing')}
            onTabChange={setActiveTab}
            pastLabel={t('single_vendor_bookings_tab_past')}
          />
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <Svg
              color={colors.text}
              height={72}
              name="noResultsFound"
              width={72}
            />
            <Text
              style={{
                color: colors.text,
                fontSize: typography.size.lg,
                lineHeight: typography.lineHeight.lg,
              }}
              weight="bold"
            >
              {t('single_vendor_manage_appointment_empty_title')}
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                {
                  color: colors.text,
                  fontSize: typography.size.md,
                  lineHeight: typography.lineHeight.md2,
                },
              ]}
            >
              {t('single_vendor_manage_appointment_empty_subtitle')}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                navigation.navigate('SingleVendorTabs', { screen: 'SingleVendorTabSearch' });
              }}
              style={[styles.searchButton, { borderColor: colors.border }]}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.size.sm,
                  lineHeight: typography.lineHeight.sm,
                }}
                weight="medium"
              >
                {t('single_vendor_manage_appointment_search_service')}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
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
                  fontSize: typography.size.xs2,
                  lineHeight: typography.lineHeight.sm,
                }}
                weight="medium"
              >
                {serviceName}
              </Text>
            </View>
          </View>

          <Pressable style={[styles.actionRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
            <View style={styles.actionLeft}>
              <MaterialCommunityIcons color={colors.text} name="calendar-clock-outline" size={24} />
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.size.md2,
                  lineHeight: typography.lineHeight.md2,
                }}
                weight="medium"
              >
                {t('single_vendor_manage_appointment_reschedule')}
              </Text>
            </View>
            <MaterialCommunityIcons color={colors.iconMuted} name="chevron-right" size={20} />
          </Pressable>

          <Pressable
            onPress={() => {
              navigation.navigate('SingleVendorCancelAppointment', { orderId });
            }}
            style={[styles.actionRow, { borderBottomColor: colors.border }]}
          >
            <View style={styles.actionLeft}>
              <MaterialCommunityIcons color={colors.text} name="calendar-remove-outline" size={24} />
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.size.md2,
                  lineHeight: typography.lineHeight.md2,
                }}
                weight="medium"
              >
                {t('single_vendor_manage_appointment_cancel')}
              </Text>
            </View>
            <MaterialCommunityIcons color={colors.iconMuted} name="chevron-right" size={20} />
          </Pressable>
        </View>
      )}
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
  actionLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  actionRow: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  barContent: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 64,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  barTitle: {
    flex: 1,
    letterSpacing: -0.27,
    textAlign: 'center',
  },
  bookingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  content: {
    flex: 1,
    paddingTop: 4,
  },
  emptyCard: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 24,
    paddingVertical: 26,
    rowGap: 12,
    shadowColor: '#101828',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  emptyContent: {
    paddingHorizontal: 16,
  },
  emptySubtitle: {
    textAlign: 'center',
  },
  image: {
    borderRadius: 8,
    height: 49,
    width: 56,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  screen: {
    flex: 1,
  },
  searchButton: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    marginTop: 4,
    width: '100%',
  },
  topBar: {
    width: '100%',
  },
});
