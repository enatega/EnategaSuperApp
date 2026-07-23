import React, { useCallback, useMemo } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  useFocusEffect,
  useNavigation,
  type NavigationProp,
} from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Button from '../../../../general/components/Button';
import Card from '../../../../general/components/Card';
import Image from '../../../../general/components/Image';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type {
  AppointmentPastBooking,
  AppointmentScheduledBooking,
} from '../../api/types';
import { formatPrice } from '../../components/details/detailHelpers';
import {
  usePastAppointmentBookings,
  useScheduledAppointmentBookings,
} from '../../hooks/useAppointmentBookings';
import { useAppointmentBookingStatusSocket } from '../../hooks/useAppointmentBookingStatusSocket';
import type { MultiVendorStackParamList } from '../navigation/types';
import { useTranslation } from 'react-i18next';

const EMPTY_CALENDAR_IMAGE = require('../../../../general/assets/images/calendar.png');
const FALLBACK_BOOKING_IMAGE = require('../../../../general/assets/images/400x400.png');

function formatBookingDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const timeLabel = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${dateLabel} at ${timeLabel}`;
}

function formatBookingPrice(value: number) {
  return formatPrice(value) ?? '$0';
}

function formatBookingDuration(durationMinutes: number) {
  const normalizedMinutes = Math.max(0, Math.round(durationMinutes));
  const hours = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr, ${minutes} min`;
}

function formatBookingStatus(status: string) {
  return status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

type EmptyStateCardProps = {
  actionLabel: string;
  message: string;
  onAction: () => void;
  title: string;
};

function EmptyStateCard({
  actionLabel,
  message,
  onAction,
  title,
}: EmptyStateCardProps) {
  const { colors, typography } = useTheme();

  return (
    <Card
      style={[
        styles.emptyCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      variant="outlined"
    >
      <Image
        resizeMode="contain"
        source={EMPTY_CALENDAR_IMAGE}
        style={styles.emptyIllustration}
      />
      <Text
        weight="bold"
        style={{
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.lg,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      <Text
        color={colors.mutedText}
        style={{
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.sm2,
          textAlign: 'center',
        }}
      >
        {message}
      </Text>
      <Button
        label={actionLabel}
        onPress={onAction}
        style={[
          styles.emptyButton,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        variant="secondary"
      />
    </Card>
  );
}

type UpcomingCardProps = {
  booking: AppointmentScheduledBooking;
  onPress: () => void;
};

function UpcomingBookingCard({ booking, onPress }: UpcomingCardProps) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('appointments');
  const imageSource = booking.storeImage
    ? { uri: booking.storeImage }
    : FALLBACK_BOOKING_IMAGE;
  const formattedDate = formatBookingDate(booking.scheduledAt);
  const itemLabel = t(
    booking.itemCount === 1
      ? 'bookings_meta_items_one'
      : 'bookings_meta_items_other',
    { count: booking.itemCount },
  );

  const handleOpenDirections = async () => {
    const latitude = booking.storeLatitude;
    const longitude = booking.storeLongitude;
    const address = booking.storeAddress?.trim() ?? '';
    const hasCoordinates =
      typeof latitude === 'number' &&
      Number.isFinite(latitude) &&
      typeof longitude === 'number' &&
      Number.isFinite(longitude);

    if (!hasCoordinates && !address) {
      Alert.alert(t('bookings_get_directions'), t('bookings_location_unavailable'));
      return;
    }

    const destination = hasCoordinates
      ? `${latitude},${longitude}`
      : encodeURIComponent(address);
    const nativeUrl = Platform.OS === 'ios'
      ? `http://maps.apple.com/?daddr=${destination}&dirflg=d`
      : hasCoordinates
        ? `geo:${latitude},${longitude}?q=${latitude},${longitude}`
        : `geo:0,0?q=${destination}`;
    const webUrl = `https://www.google.com/maps?q=${destination}`;

    try {
      await Linking.openURL(
        (await Linking.canOpenURL(nativeUrl)) ? nativeUrl : webUrl,
      );
    } catch {
      Alert.alert(t('bookings_get_directions'), t('bookings_location_unavailable'));
    }
  };

  const handleShowDate = () => {
    Alert.alert(t('bookings_date_title'), formattedDate);
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      activeOpacity={0.88}
      onPress={onPress}
    >
      <Card
      style={[
        styles.upcomingCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      variant="outlined"
    >
      <Image source={imageSource} style={styles.upcomingImage} resizeMode="cover" />

      <View style={styles.upcomingCopy}>
        <View style={styles.upcomingBadgeRow}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.warningSoft,
              },
            ]}
          >
            <Text
              color={colors.warningText}
              style={styles.badgeText}
              weight="semiBold"
            >
              {formatBookingStatus(booking.orderStatus)}
            </Text>
          </View>
        </View>

        <Text
          weight="bold"
          numberOfLines={1}
          style={{
            fontSize: typography.size.lg,
            lineHeight: typography.lineHeight.lg,
          }}
        >
          {booking.storeName}
        </Text>

        <Text
          style={{
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.sm2,
          }}
        >
          {formattedDate}
        </Text>

        <View style={styles.metaRow}>
          <Text
            color={colors.mutedText}
            style={{
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.sm2,
            }}
          >
            {formatBookingDuration(booking.durationMinutes)}
            {'  •  '}
            {itemLabel}
            {'  •  '}
            {formatBookingPrice(booking.orderPrice)}
          </Text>
        </View>

        <View style={styles.upcomingActions}>
          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.75}
            onPress={() => void handleOpenDirections()}
            style={[styles.directionsButton, { borderColor: colors.border }]}
          >
            <Text
              weight="semiBold"
              style={{ fontSize: typography.size.sm2 }}
            >
              {t('bookings_get_directions')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel={t('bookings_date_title')}
            accessibilityRole="button"
            activeOpacity={0.75}
            onPress={handleShowDate}
            style={[styles.calendarButton, { borderColor: colors.border }]}
          >
            <MaterialCommunityIcons
              color={colors.text}
              name="calendar-month-outline"
              size={24}
            />
          </TouchableOpacity>
        </View>
      </View>
      </Card>
    </TouchableOpacity>
  );
}

type PastCardProps = {
  booking: AppointmentPastBooking;
  ctaLabel: string;
  onOpen: () => void;
  onPress: () => void;
};

function PastBookingCard({ booking, ctaLabel, onOpen, onPress }: PastCardProps) {
  const { colors, typography } = useTheme();
  const imageSource = booking.storeImage || booking.storeLogo
    ? { uri: booking.storeImage ?? booking.storeLogo ?? '' }
    : FALLBACK_BOOKING_IMAGE;

  return (
    <TouchableOpacity accessibilityRole="button" activeOpacity={0.88} onPress={onOpen}>
      <Card
      style={[
        styles.pastCard,
        {
          borderColor: colors.border,
        },
      ]}
    >
      <Image source={imageSource} style={styles.pastImage} resizeMode="cover" />

      <View style={styles.pastCopy}>
        <Text
          numberOfLines={1}
          weight="bold"
          style={{
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md2,
          }}
        >
          {booking.storeName}
        </Text>
        <Text
          color={colors.mutedText}
          numberOfLines={1}
          style={{
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.sm2,
          }}
        >
          {formatBookingDate(booking.orderedAt)}
        </Text>
        <Text
          color={colors.mutedText}
          style={{
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.sm2,
          }}
        >
          {formatBookingPrice(booking.orderPrice)}
        </Text>
      </View>

      <Button
        label={ctaLabel}
        onPress={onPress}
        style={styles.bookAgainButton}
        variant="secondary"
      />
      </Card>
    </TouchableOpacity>
  );
}

export default function MultiVendorBookingsScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('appointments');
  const navigation = useNavigation<NavigationProp<MultiVendorStackParamList>>();
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

  const isInitialLoading =
    (scheduledQuery.isLoading && upcomingBookings.length === 0) ||
    (pastQuery.isLoading && pastBookings.length === 0);
  const hasAnyError =
    Boolean(scheduledQuery.error || pastQuery.error) &&
    upcomingBookings.length === 0 &&
    pastBookings.length === 0;
  const hasNoBookings =
    !isInitialLoading &&
    upcomingBookings.length === 0 &&
    pastBookings.length === 0;

  const handleRefresh = useCallback(() => {
    void scheduledQuery.refetch();
    void pastQuery.refetch();
  }, [pastQuery, scheduledQuery]);

  const handleSearchProviders = useCallback(() => {
    navigation.navigate('MultiVendorTabs', {
      screen: 'MultiVendorTabSearch',
    });
  }, [navigation]);

  const handleBookAgain = useCallback(
    (booking: AppointmentPastBooking) => {
      navigation.navigate('Services', {
        storeId: booking.storeId,
        title: booking.storeName,
      });
    },
    [navigation],
  );

  const renderPastBooking = useCallback(
    ({ item }: { item: AppointmentPastBooking }) => (
      <PastBookingCard
        booking={item}
        ctaLabel={t('bookings_book_again')}
        onOpen={() =>
          navigation.navigate('AppointmentBookingDetail', {
            orderId: item.orderId,
          })
        }
        onPress={() => handleBookAgain(item)}
      />
    ),
    [handleBookAgain, navigation, t],
  );

  const handleLoadMorePast = useCallback(() => {
    if (pastQuery.hasNextPage && !pastQuery.isFetchingNextPage) {
      void pastQuery.fetchNextPage();
    }
  }, [pastQuery]);

  if (isInitialLoading) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader title={t('bookings_title')} showBack={false} />
        <View style={styles.centeredState}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </View>
    );
  }

  if (hasAnyError) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader title={t('bookings_title')} showBack={false} />
        <View style={styles.centeredState}>
          <MaterialCommunityIcons
            color={colors.danger}
            name="calendar-alert-outline"
            size={52}
          />
          <Text
            weight="bold"
            style={{
              fontSize: typography.size.xl,
              lineHeight: typography.lineHeight.xl,
            }}
          >
            {t('bookings_error_title')}
          </Text>
          <Text
            color={colors.mutedText}
            style={[styles.centeredText, {
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.lg,
            }]}
          >
            {t('bookings_error_subtitle')}
          </Text>
          <Button
            label={t('bookings_retry')}
            onPress={handleRefresh}
            style={styles.retryButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('bookings_title')} showBack={false} />

      <FlatList
        contentContainerStyle={styles.listContent}
        data={pastBookings}
        keyExtractor={(item) => item.orderId}
        onEndReached={handleLoadMorePast}
        onEndReachedThreshold={0.4}
        refreshControl={(
          <RefreshControl
            refreshing={scheduledQuery.isRefetching || pastQuery.isRefetching}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        )}
        renderItem={renderPastBooking}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.pastSeparator} />}
        ListHeaderComponent={(
          <View style={styles.headerContent}>
            <Text
              weight="bold"
              style={{
                fontSize: typography.size.lg,
                lineHeight: typography.lineHeight.lg,
              }}
            >
              {t('bookings_upcoming_title')}
            </Text>

            {upcomingBookings.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.upcomingScrollContent}
              >
                {upcomingBookings.map((booking) => (
                  <UpcomingBookingCard
                    key={booking.orderId}
                    booking={booking}
                    onPress={() =>
                      navigation.navigate('AppointmentBookingDetail', {
                        orderId: booking.orderId,
                      })
                    }
                  />
                ))}
              </ScrollView>
            ) : (
              <EmptyStateCard
                actionLabel={t('bookings_empty_action')}
                message={
                  hasNoBookings
                    ? t('bookings_empty_subtitle')
                    : t('bookings_upcoming_empty_subtitle')
                }
                onAction={handleSearchProviders}
                title={
                  hasNoBookings
                    ? t('bookings_empty_title')
                    : t('bookings_upcoming_empty_title')
                }
              />
            )}

            {pastBookings.length > 0 ? (
              <Text
                weight="bold"
                style={{
                  fontSize: typography.size.lg,
                  lineHeight: typography.lineHeight.lg,
                  marginTop: 10,
                }}
              >
                {t('bookings_past_title')}
              </Text>
            ) : null}
          </View>
        )}
        ListFooterComponent={
          pastQuery.isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <View style={styles.footerSpacing} />
          )
        }
        ListEmptyComponent={
          hasNoBookings ? <View style={styles.footerSpacing} /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 15,
    textTransform: 'capitalize',
  },
  bookAgainButton: {
    borderRadius: 4,
    paddingVertical: 8,
  },
  centeredState: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  centeredText: {
    maxWidth: 280,
    textAlign: 'center',
  },
  emptyButton: {
    minHeight: 52,
    width: '100%',
  },
  emptyCard: {
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 26,
  },
  emptyIllustration: {
    height: 82,
    width: 82,
  },
  footerLoader: {
    alignItems: 'center',
    paddingBottom: 28,
    paddingTop: 12,
  },
  footerSpacing: {
    height: 28,
  },
  headerContent: {
    gap: 18,
    paddingBottom: 18,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  pastCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 0,
    paddingVertical: 12,
  },
  pastCopy: {
    flex: 1,
    gap: 4,
  },
  pastImage: {
    borderRadius: 16,
    height: 78,
    width: 68,
  },
  pastSeparator: {
    height: 12,
  },
  retryButton: {
    minWidth: 140,
    marginTop: 4,
  },
  screen: {
    flex: 1,
  },
  upcomingBadgeRow: {
    alignItems: 'flex-start',
  },
  upcomingCard: {
    overflow: 'hidden',
    padding: 0,
    width: 324,
  },
  upcomingCopy: {
    gap: 10,
    padding: 16,
  },
  upcomingActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  directionsButton: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 16,
  },
  calendarButton: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    marginLeft: 12,
    width: 48,
  },
  upcomingImage: {
    height: 180,
    width: '100%',
  },
  upcomingScrollContent: {
    gap: 14,
    paddingRight: 8,
  },
  metaRow: {
    flexDirection: 'row',
  },
});
