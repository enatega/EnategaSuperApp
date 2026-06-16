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
import useSingleVendorContracts from '../hooks/useSingleVendorContracts';
import type {
  HomeVisitsSingleVendorBookingItem,
  HomeVisitsSingleVendorBookingsTab,
} from '../api/types';
import type { HomeVisitsSingleVendorNavigationParamList } from '../navigation/types';

type Props = Record<string, never>;

function getContractPlanLabel(contractType: 'weekly' | 'monthly' | 'yearly') {
  if (contractType === 'yearly') {
    return 'Yearly';
  }

  if (contractType === 'monthly') {
    return 'Monthly';
  }

  return 'Weekly';
}

function formatDateRange(startDate: string, endDate: string) {
  return `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
}

export default function SingleVendorOrdersScreen({}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();
  const [activeTab, setActiveTab] =
    React.useState<HomeVisitsSingleVendorBookingsTab>('ongoing');
  const [contentTab, setContentTab] = React.useState<'services' | 'contracts'>('services');
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
  const contractsQuery = useSingleVendorContracts(activeTab);
  const filteredData = React.useMemo(
    () => data.filter((item) => item.bookingType !== 'contract'),
    [data],
  );
  const contractData = contractsQuery.data;
  const listData = React.useMemo<HomeVisitsSingleVendorBookingItem[]>(
    () =>
      contentTab === 'contracts'
        ? contractData.map((item) => ({
            orderId: item.contractId,
            title: `${getContractPlanLabel(item.contractType)} Contract`,
            durationLabel:
              item.status === 'pending_approval'
                ? t('single_vendor_contract_pending_approval')
                : formatDateRange(item.startDate, item.endDate),
            itemCount: item.teamSize ?? 1,
            totalAmount: item.currentInvoiceAmount ?? item.monthlyFeeAmount ?? 0,
            status: item.status,
            jobStatus: item.currentInvoiceStatus ?? item.status,
            orderedAt: item.startDate,
            scheduledAt: item.startDate,
            bookingType: 'contract',
            canViewDetails: true,
            canBookAgain: false,
          }))
        : filteredData,
    [contentTab, contractData, filteredData],
  );
  const emptyTitle = contentTab === 'contracts'
    ? 'No contracts found'
    : t('single_vendor_bookings_empty_generic_title');
  const emptySubtitle = contentTab === 'contracts'
    ? 'Your active and past service contracts will appear here.'
    : t('single_vendor_bookings_empty_generic_subtitle');

  const handleEmptyStateCtaPress = React.useCallback(() => {
    navigation.navigate('SingleVendorTabs', {
      screen: 'SingleVendorTabSearch',
    });
  }, [navigation]);

  const onEndReached = React.useCallback(() => {
    if (contentTab === 'contracts') {
      if (!contractsQuery.hasNextPage || contractsQuery.isFetchingNextPage) {
        return;
      }
      void contractsQuery.fetchNextPage();
      return;
    }
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [contentTab, contractsQuery, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderListItem = React.useCallback(
    ({ item }: { item: HomeVisitsSingleVendorBookingItem }) => {
      const isContract = item.bookingType === 'contract';
      const handlePress = (id: string) => {
        if (isContract) {
          navigation.navigate('SingleVendorContractDetails', { contractId: id });
          return;
        }
        navigation.navigate('SingleVendorBookingDetails', { orderId: id });
      };

      return (
        <BookingListItem
          bookAgainLabel={t('single_vendor_bookings_book_again')}
          booking={item}
          itemLabel={isContract ? 'member' : t('single_vendor_bookings_item')}
          itemsLabel={isContract ? 'members' : t('single_vendor_bookings_items')}
          onPress={handlePress}
          onViewDetails={handlePress}
          tab={activeTab}
          viewDetailsLabel={t('single_vendor_bookings_view_details')}
        />
      );
    },
    [activeTab, navigation, t],
  );

  if (isLoading && filteredData.length === 0) {
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
          <View style={[styles.contentTabs, { backgroundColor: colors.backgroundTertiary }]}>
            {(['services', 'contracts'] as const).map((tab) => {
              const selected = contentTab === tab;
              return (
                <Button
                  key={tab}
                  label={tab === 'contracts' ? 'Contracts' : 'Services'}
                  onPress={() => setContentTab(tab)}
                  variant={selected ? 'primary' : 'secondary'}
                  style={styles.contentTabButton}
                />
              );
            })}
          </View>
          <BookingsListSkeleton />
        </View>
      </View>
    );
  }

  if (isError && filteredData.length === 0) {
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
          <View style={[styles.contentTabs, { backgroundColor: colors.backgroundTertiary }]}>
            {(['services', 'contracts'] as const).map((tab) => {
              const selected = contentTab === tab;
              return (
                <Button
                  key={tab}
                  label={tab === 'contracts' ? 'Contracts' : 'Services'}
                  onPress={() => setContentTab(tab)}
                  variant={selected ? 'primary' : 'secondary'}
                  style={styles.contentTabButton}
                />
              );
            })}
          </View>
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
        <View style={[styles.contentTabs, { backgroundColor: colors.backgroundTertiary }]}>
          {(['services', 'contracts'] as const).map((tab) => {
            const selected = contentTab === tab;
            return (
              <Button
                key={tab}
                label={tab === 'contracts' ? 'Contracts' : 'Services'}
                onPress={() => setContentTab(tab)}
                variant={selected ? 'primary' : 'secondary'}
                style={styles.contentTabButton}
              />
            );
          })}
        </View>
        <FlatList
          data={listData}
          keyExtractor={(item) => item.orderId}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                if (contentTab === 'contracts') {
                  void contractsQuery.refetch();
                  return;
                }
                void refetch();
              }}
              refreshing={contentTab === 'contracts' ? contractsQuery.isRefetching : isRefetching}
              tintColor={colors.primary}
            />
          }
          renderItem={renderListItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <BookingListEmptyState
              subtitle={emptySubtitle}
              title={emptyTitle}
            />
          }
          ListFooterComponent={
            (contentTab === 'contracts' ? contractsQuery.isFetchingNextPage : isFetchingNextPage)
              ? <BookingsListSkeleton />
              : null
          }
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
  contentTabButton: {
    flex: 1,
  },
  contentTabs: {
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    padding: 8,
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
