import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../../../general/components/Button';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import BookingListEmptyState from '../components/Bookings/BookingListEmptyState';
import BookingListItem from '../components/Bookings/BookingListItem';
import BookingsListSkeleton from '../components/Bookings/BookingsListSkeleton';
import BookingsTabs from '../components/Bookings/BookingsTabs';
import useSingleVendorBookings from '../hooks/useSingleVendorBookings';
import type {
  HomeVisitsSingleVendorBookingItem,
  HomeVisitsSingleVendorBookingsTab,
} from '../api/types';
import type { HomeVisitsSingleVendorNavigationParamList } from '../navigation/types';

type Props = Record<string, never>;

export default function SingleVendorOrdersScreen({}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();
  const [activeTab, setActiveTab] =
    React.useState<HomeVisitsSingleVendorBookingsTab>('ongoing');
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useSingleVendorBookings({
    tab: activeTab,
  });

  const emptyTitle = t('single_vendor_bookings_empty_generic_title');
  const emptySubtitle = t('single_vendor_bookings_empty_generic_subtitle');

  const handleEmptyStateCtaPress = React.useCallback(() => {
    navigation.navigate('SingleVendorTabs', {
      screen: 'SingleVendorTabSearch',
    });
  }, [navigation]);

  const onEndReached = React.useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderBookingItem = React.useCallback(
    ({ item }: { item: HomeVisitsSingleVendorBookingItem }) => (
      <BookingListItem
        bookAgainLabel={t('single_vendor_bookings_book_again')}
        booking={item}
        itemLabel={t('single_vendor_bookings_item')}
        itemsLabel={t('single_vendor_bookings_items')}
        onPress={(orderId) => {
          navigation.navigate('SingleVendorBookingDetails', { orderId });
        }}
        onViewDetails={(orderId) => {
          navigation.navigate('SingleVendorBookingDetails', { orderId });
        }}
        tab={activeTab}
        viewDetailsLabel={t('single_vendor_bookings_view_details')}
      />
    ),
    [activeTab, navigation, t],
  );

  if (isLoading && data.length === 0) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader
          showBack={false}
          title={t('single_vendor_bookings_title')}
        />
        <View style={styles.content}>
          <BookingsTabs
            activeTab={activeTab}
            ongoingLabel={t('single_vendor_bookings_tab_ongoing')}
            onTabChange={setActiveTab}
            pastLabel={t('single_vendor_bookings_tab_past')}
          />
          <BookingsListSkeleton />
        </View>
      </View>
    );
  }

  if (isError && data.length === 0) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader
          showBack={false}
          title={t('single_vendor_bookings_title')}
        />
        <View style={styles.content}>
          <BookingsTabs
            activeTab={activeTab}
            ongoingLabel={t('single_vendor_bookings_tab_ongoing')}
            onTabChange={setActiveTab}
            pastLabel={t('single_vendor_bookings_tab_past')}
          />
          <View style={styles.errorState}>
            <Text
              style={{
                color: colors.text,
                fontSize: typography.size.lg,
                lineHeight: typography.lineHeight.lg,
                marginBottom: 10,
              }}
              weight="bold"
            >
              {t('single_vendor_bookings_error_title')}
            </Text>
            <Button
              label={t('single_vendor_bookings_retry')}
              onPress={() => {
                void refetch();
              }}
              variant="secondary"
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader
        showBack={false}
        title={t('single_vendor_bookings_title')}
      />
      <View style={styles.content}>
        <BookingsTabs
          activeTab={activeTab}
          ongoingLabel={t('single_vendor_bookings_tab_ongoing')}
          onTabChange={setActiveTab}
          pastLabel={t('single_vendor_bookings_tab_past')}
        />
        <FlatList
          data={data}
          keyExtractor={(item) => item.orderId}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                void refetch();
              }}
              refreshing={isRefetching}
              tintColor={colors.primary}
            />
          }
          renderItem={renderBookingItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <BookingListEmptyState
              ctaLabel={t('single_vendor_bookings_empty_cta')}
              onCtaPress={handleEmptyStateCtaPress}
              subtitle={emptySubtitle}
              title={emptyTitle}
            />
          }
          ListFooterComponent={isFetchingNextPage ? <BookingsListSkeleton /> : null}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingBottom: insets.bottom + 24,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  errorState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 52,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingTop: 4,
  },
  screen: {
    flex: 1,
  },
});
