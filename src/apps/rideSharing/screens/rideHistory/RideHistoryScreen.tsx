import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useRideSharingCurrencyLabel } from '../../../../general/stores/useAppConfigStore';
import RideHistoryListItem from '../../components/rideHistory/RideHistoryListItem';
import { useCustomerRides } from '../../hooks/useRideQueries';
import type { CustomerRideListItem } from '../../api/types';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';

type NavigationProp = NativeStackNavigationProp<RideSharingStackParamList>;

export default function RideHistoryScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const currencyLabel = useRideSharingCurrencyLabel();

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useCustomerRides();

  const historyItems = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const handleItemPress = useCallback(
    (rideId: string) => {
      navigation.navigate('ReservationDetail', { rideId });
    },
    [navigation],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: CustomerRideListItem }) => {
      const statusLabel =
        item.rideStatus === 'COMPLETED'
          ? t('ride_history_status_completed')
          : item.rideStatus === 'CANCELLED'
            ? t('ride_history_status_cancelled')
            : t('ride_history_status_ongoing');

      return (
        <RideHistoryListItem
          currencyLabel={currencyLabel}
          item={item}
          onPress={handleItemPress}
          statusLabel={statusLabel}
        />
      );
    },
    [currencyLabel, handleItemPress, t],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.backgroundTertiary }]}>
      <ScreenHeader
        title={t('sidebar_ride_history')}
        style={{ backgroundColor: colors.backgroundTertiary }}
      />

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primary} size="small" />
        </View>
      ) : isError ? (
        <View style={styles.centerState}>
          <Text style={{ color: colors.danger }} weight="semiBold">
            {t('ride_history_load_error')}
          </Text>
        </View>
      ) : historyItems.length === 0 ? (
        <View style={styles.centerState}>
          <Text style={{ color: colors.mutedText }} weight="semiBold">
            {t('ride_history_empty')}
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={historyItems}
          keyExtractor={(item) => item.rideId}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              onRefresh={() => {
                void refetch();
              }}
              refreshing={isRefetching}
              tintColor={colors.primary}
            />
          }
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color={colors.primary} size="small" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  footerLoader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  screen: {
    flex: 1,
  },
});
