import React, { useCallback, useMemo, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  useFocusEffect,
  useNavigation,
  type NavigationProp,
} from '@react-navigation/native';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../../../general/components/Button';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type {
  AppointmentPastBooking,
  AppointmentScheduledBooking,
} from '../../api/types';
import AppointmentsBookingsListSkeleton from '../../components/bookings/AppointmentsBookingsListSkeleton';
import {
  usePastAppointmentBookings,
  useScheduledAppointmentBookings,
} from '../../hooks/useAppointmentBookings';
import { useAppointmentBookingStatusSocket } from '../../hooks/useAppointmentBookingStatusSocket';
import type { MultiVendorStackParamList } from '../navigation/types';
import { useTranslation } from 'react-i18next';

type BookingTab = 'upcoming' | 'completed' | 'cancelled';
type BookingListItem = AppointmentScheduledBooking | AppointmentPastBooking;

const CANCELLED_STATUS_PARTS = ['cancel', 'reject'];
const FALLBACK_STORE_IMAGE = require('../../../../general/assets/images/400x400.png');

function isScheduledBooking(
  booking: BookingListItem,
): booking is AppointmentScheduledBooking {
  return 'scheduledAt' in booking;
}

function isCancelledStatus(status: string) {
  const normalizedStatus = status.toLowerCase();
  return CANCELLED_STATUS_PARTS.some((part) =>
    normalizedStatus.includes(part),
  );
}

function formatBookingStatus(status: string) {
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatBookingDuration(durationMinutes: number) {
  const normalizedMinutes = Math.max(0, Math.round(durationMinutes));
  const hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

function formatBookingDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
  const timeLabel = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${dateLabel}  ·  ${timeLabel}`;
}

type AppointmentCardProps = {
  booking: BookingListItem;
  onPress: () => void;
};

function AppointmentCard({ booking, onPress }: AppointmentCardProps) {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');
  const isScheduled = isScheduledBooking(booking);
  const dateValue = isScheduled ? booking.scheduledAt : booking.orderedAt;
  const status = formatBookingStatus(booking.orderStatus);
  const description = isScheduled
    ? [
        t(
          booking.itemCount === 1
            ? 'bookings_meta_items_one'
            : 'bookings_meta_items_other',
          { count: booking.itemCount },
        ),
        formatBookingDuration(booking.durationMinutes),
      ].join(' · ')
    : t('bookings_past_summary');
  const isCancelled = isCancelledStatus(booking.orderStatus);
  const storeImageUri = (
    booking.storeImage ??
    (isScheduled ? null : booking.storeLogo)
  )?.trim();
  const storeImageSource = storeImageUri
    ? { uri: storeImageUri }
    : FALLBACK_STORE_IMAGE;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.appointmentCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.78 : 1,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <Image
        resizeMode="cover"
        source={storeImageSource}
        style={styles.storeImage}
      />

      <View style={styles.cardCopy}>
        <View style={styles.cardTitleRow}>
          <Text numberOfLines={1} style={styles.storeName} weight="bold">
            {booking.storeName}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isCancelled
                  ? colors.dangerSoft
                  : colors.blue50,
              },
            ]}
          >
            <Text
              color={isCancelled ? colors.dangerText : colors.primary}
              numberOfLines={1}
              style={styles.statusText}
              weight="semiBold"
            >
              {status}
            </Text>
          </View>
        </View>

        <Text
          color={colors.mutedText}
          numberOfLines={1}
          style={styles.description}
        >
          {description}
        </Text>

        <View style={styles.dateRow}>
          <MaterialCommunityIcons
            color={colors.primaryDark}
            name="calendar-clock-outline"
            size={15}
          />
          <Text
            color={colors.primaryDark}
            numberOfLines={1}
            style={styles.dateText}
            weight="semiBold"
          >
            {formatBookingDate(dateValue)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

type TabBarProps = {
  activeTab: BookingTab;
  onChange: (tab: BookingTab) => void;
};

function BookingsTabBar({ activeTab, onChange }: TabBarProps) {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');
  const tabs: Array<{ key: BookingTab; label: string }> = [
    { key: 'upcoming', label: t('bookings_upcoming_title') },
    { key: 'completed', label: t('bookings_completed_title') },
    { key: 'cancelled', label: t('bookings_cancelled_title') },
  ];

  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={({ pressed }) => [
              styles.tab,
              {
                backgroundColor: isActive ? colors.primaryDark : colors.surface,
                borderColor: isActive ? colors.primaryDark : colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              color={isActive ? colors.white : colors.mutedText}
              numberOfLines={1}
              style={styles.tabLabel}
              weight="semiBold"
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type EmptyStateProps = {
  activeTab: BookingTab;
  onSearch: () => void;
};

function EmptyState({ activeTab, onSearch }: EmptyStateProps) {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');
  const titleKey =
    activeTab === 'upcoming'
      ? 'bookings_upcoming_empty_title'
      : activeTab === 'completed'
        ? 'bookings_completed_empty_title'
        : 'bookings_cancelled_empty_title';
  const subtitleKey =
    activeTab === 'upcoming'
      ? 'bookings_upcoming_empty_subtitle'
      : activeTab === 'completed'
        ? 'bookings_completed_empty_subtitle'
        : 'bookings_cancelled_empty_subtitle';

  return (
    <View style={styles.emptyState}>
      <View
        style={[
          styles.emptyIcon,
          { backgroundColor: colors.cardLavender },
        ]}
      >
        <MaterialCommunityIcons
          color={colors.primaryDark}
          name="calendar-blank-outline"
          size={34}
        />
      </View>
      <Text style={styles.emptyTitle} weight="bold">
        {t(titleKey)}
      </Text>
      <Text
        color={colors.mutedText}
        style={styles.emptySubtitle}
      >
        {t(subtitleKey)}
      </Text>
      {activeTab === 'upcoming' ? (
        <Button
          label={t('bookings_empty_action')}
          onPress={onSearch}
          style={styles.emptyAction}
          variant="secondary"
        />
      ) : null}
    </View>
  );
}

export default function MultiVendorBookingsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<MultiVendorStackParamList>>();
  const [activeTab, setActiveTab] = useState<BookingTab>('upcoming');
  const scheduledQuery = useScheduledAppointmentBookings();
  const pastQuery = usePastAppointmentBookings();
  useAppointmentBookingStatusSocket();

  const refetchScheduledBookings = scheduledQuery.refetch;
  const refetchPastBookings = pastQuery.refetch;

  useFocusEffect(
    useCallback(() => {
      void refetchScheduledBookings();
      void refetchPastBookings();
    }, [refetchPastBookings, refetchScheduledBookings]),
  );

  const upcomingBookings = scheduledQuery.data ?? [];
  const pastBookings = useMemo(
    () => pastQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [pastQuery.data],
  );
  const completedBookings = useMemo(
    () =>
      pastBookings.filter(
        (booking) => !isCancelledStatus(booking.orderStatus),
      ),
    [pastBookings],
  );
  const cancelledBookings = useMemo(
    () =>
      pastBookings.filter((booking) =>
        isCancelledStatus(booking.orderStatus),
      ),
    [pastBookings],
  );
  const bookings = useMemo<BookingListItem[]>(() => {
    if (activeTab === 'upcoming') return upcomingBookings;
    if (activeTab === 'completed') return completedBookings;
    return cancelledBookings;
  }, [
    activeTab,
    cancelledBookings,
    completedBookings,
    upcomingBookings,
  ]);

  const isInitialLoading =
    scheduledQuery.isLoading || pastQuery.isLoading;
  const hasAnyError = Boolean(scheduledQuery.error || pastQuery.error);

  const handleRefresh = useCallback(() => {
    void scheduledQuery.refetch();
    void pastQuery.refetch();
  }, [pastQuery, scheduledQuery]);

  const handleLoadMore = useCallback(() => {
    if (
      activeTab !== 'upcoming' &&
      pastQuery.hasNextPage &&
      !pastQuery.isFetchingNextPage
    ) {
      void pastQuery.fetchNextPage();
    }
  }, [activeTab, pastQuery]);

  const handleSearchProviders = useCallback(() => {
    navigation.navigate('MultiVendorTabs', {
      screen: 'MultiVendorTabSearch',
    });
  }, [navigation]);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('MultiVendorTabs', {
      screen: 'MultiVendorTabHome',
    });
  }, [navigation]);

  const renderBooking = useCallback(
    ({ item }: { item: BookingListItem }) => (
      <AppointmentCard
        booking={item}
        onPress={() =>
          navigation.navigate('AppointmentBookingDetail', {
            orderId: item.orderId,
          })
        }
      />
    ),
    [navigation],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Pressable
          accessibilityLabel={t('details_action_back')}
          accessibilityRole="button"
          hitSlop={10}
          onPress={handleBack}
          style={({ pressed }) => [
            styles.headerSide,
            { opacity: pressed ? 0.65 : 1 },
          ]}
        >
          <MaterialCommunityIcons
            color={colors.text}
            name="arrow-left"
            size={25}
          />
        </Pressable>
        <Text numberOfLines={1} style={styles.headerTitle} weight="bold">
          {t('bookings_my_appointments_title')}
        </Text>
        <View style={styles.headerSide} />
      </View>

      <BookingsTabBar activeTab={activeTab} onChange={setActiveTab} />

      {isInitialLoading && bookings.length === 0 ? (
        <AppointmentsBookingsListSkeleton />
      ) : hasAnyError && bookings.length === 0 ? (
        <View style={styles.centeredState}>
          <MaterialCommunityIcons
            color={colors.danger}
            name="calendar-alert-outline"
            size={42}
          />
          <Text style={styles.errorTitle} weight="bold">
            {t('bookings_error_title')}
          </Text>
          <Text color={colors.mutedText} style={styles.errorSubtitle}>
            {t('bookings_error_subtitle')}
          </Text>
          <Button
            label={t('bookings_retry')}
            onPress={handleRefresh}
            style={styles.retryButton}
          />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={[
            styles.listContent,
            bookings.length === 0 && styles.emptyListContent,
          ]}
          data={bookings}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={(item) => item.orderId}
          ListEmptyComponent={
            <EmptyState
              activeTab={activeTab}
              onSearch={handleSearchProviders}
            />
          }
          ListFooterComponent={
            pastQuery.isFetchingNextPage ? (
              <ActivityIndicator
                color={colors.primary}
                style={styles.footerLoader}
              />
            ) : null
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              onRefresh={handleRefresh}
              refreshing={
                scheduledQuery.isRefetching || pastQuery.isRefetching
              }
              tintColor={colors.primary}
            />
          }
          renderItem={renderBooking}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  appointmentCard: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 100,
    padding: 14,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 7,
  },
  cardCopy: {
    flex: 1,
    gap: 5,
    marginLeft: 12,
    minWidth: 0,
  },
  cardTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  centeredState: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  dateRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  dateText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
  emptyAction: {
    marginTop: 4,
    minWidth: 170,
  },
  emptyIcon: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    paddingBottom: 72,
    paddingHorizontal: 24,
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 280,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 280,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  footerLoader: {
    marginVertical: 20,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  headerSide: {
    alignItems: 'flex-start',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  retryButton: {
    marginTop: 4,
    minWidth: 130,
  },
  screen: {
    flex: 1,
  },
  separator: {
    height: 12,
  },
  storeImage: {
    borderRadius: 12,
    height: 52,
    width: 52,
  },
  statusBadge: {
    borderRadius: 999,
    flexShrink: 0,
    maxWidth: 92,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 11,
    lineHeight: 14,
  },
  storeName: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  tab: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 8,
  },
  tabLabel: {
    fontSize: 13,
    lineHeight: 17,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
  },
});
