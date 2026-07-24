import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import { showToast } from '../../../../general/components/AppToast';
import { useTheme } from '../../../../general/theme/theme';
import type { AppointmentOrderAgainItem } from '../../api/types';
import AppointmentsOrderAgainCard from '../../components/home/AppointmentsOrderAgainCard';
import AppointmentsSectionEmptyState from '../../components/home/AppointmentsSectionEmptyState';
import {
  useSingleVendorFavouriteServices,
  useToggleSingleVendorFavouriteService,
} from '../hooks/useSingleVendorFavouriteServices';
import type { SingleVendorStackParamList } from '../navigation/types';

export default function SingleVendorFavouriteServicesScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');
  const navigation = useNavigation<NavigationProp<SingleVendorStackParamList>>();
  const query = useSingleVendorFavouriteServices();
  const toggle = useToggleSingleVendorFavouriteService();
  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );

  const openService = useCallback(
    (item: AppointmentOrderAgainItem) => {
      navigation.navigate('Services', {
        storeId: item.storeId,
        title: item.storeName || t('single_vendor_label'),
        initialServiceId: item.productId,
      });
    },
    [navigation, t],
  );

  const removeFavourite = useCallback(
    (item: AppointmentOrderAgainItem) => {
      toggle.mutate(item.productId, {
        onSuccess: () => showToast.success(t('favourites_service_removed')),
        onError: () => showToast.error(t('favourites_toggle_error')),
      });
    },
    [t, toggle],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('favourites_services_title')} />
      {query.isPending ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <AppointmentsSectionEmptyState
            title={t('favourites_services_empty_title')}
            message={t('favourites_services_empty_message')}
          />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={items}
          keyExtractor={(item) => item.productId}
          refreshControl={
            <RefreshControl
              refreshing={query.isRefetching}
              onRefresh={query.refetch}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <Pressable onPress={() => openService(item)}>
              <AppointmentsOrderAgainCard
                item={item}
                isFullWidth
                isFavorite
                isFavoritePending={
                  toggle.isPending && toggle.variables === item.productId
                }
                onFavoritePress={removeFavourite}
              />
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReached={() => {
            if (query.hasNextPage && !query.isFetchingNextPage) {
              void query.fetchNextPage();
            }
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  empty: {
    padding: 16,
  },
  list: {
    padding: 16,
  },
  screen: {
    flex: 1,
  },
  separator: {
    height: 12,
  },
});
