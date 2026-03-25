import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../../general/theme/theme';
import ScreenHeader from '../../../../../general/components/ScreenHeader';
import Text from '../../../../../general/components/Text';
import FavouriteHeartButton from '../../components/favourites/FavouriteHeartButton';
import FavouritesListFooter from '../../components/favourites/FavouritesListFooter';
import StoreCard from '../../../components/storeCard/StoreCard';
import { showToast } from '../../../../../general/components/AppToast';
import { useFavouritesQuery } from '../../hooks/useFavouritesQuery';
import { useToggleFavouriteMutation } from '../../hooks/useToggleFavouriteMutation';
import type { DeliveryNearbyStore } from '../../../api/types';

export default function FavouritesScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
    isError,
  } = useFavouritesQuery();

  const { mutate: toggleFavourite, isPending: isToggling, variables: toggleVariables } = useToggleFavouriteMutation({
    onSuccess: (data) => {
      if (data.isFavorite) {
        showToast.success(t('favourites_toggle_added'));
      } else {
        showToast.success(t('favourites_toggle_removed'));
      }
    },
    onError: () => {
      showToast.error(t('favourites_toggle_error'));
    },
  });

  const stores = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const addToFavLabel = t('favourites_add');
  const removeFromFavLabel = t('favourites_remove');

  const renderItem = useCallback(
    ({ item }: { item: DeliveryNearbyStore }) => (
      <StoreCard
        store={item}
        onPress={() => {
          console.log('store pressed', item.storeId);
        }}
        actionSlot={
          <FavouriteHeartButton
            isFavourite={item.isFavorite ?? false}
            isLoading={isToggling && toggleVariables?.storeId === item.storeId}
            accessibilityLabel={item.isFavorite ? removeFromFavLabel : addToFavLabel}
            onPress={() => toggleFavourite({ storeId: item.storeId })}
          />
        }
      />
    ),
    [addToFavLabel, removeFromFavLabel, toggleFavourite, isToggling, toggleVariables],
  );

  const keyExtractor = useCallback(
    (item: DeliveryNearbyStore, index: number) => `${item.storeId}-${index}`,
    [],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader title={t('favourites_title')} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader title={t('favourites_title')} />
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text variant="body" color={colors.mutedText} style={styles.centeredText}>
            {t('favourites_error')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('favourites_title')} />

      {stores.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="heart-outline" size={48} color={colors.primary} />
          <Text variant="title" weight="bold" style={styles.centeredText}>
            {t('favourites_empty_title')}
          </Text>
          <Text variant="body" color={colors.mutedText} style={styles.centeredText}>
            {t('favourites_empty_subtitle')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={stores}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={<FavouritesListFooter isVisible={isFetchingNextPage} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 24,
  },
  centeredText: {
    maxWidth: 240,
    textAlign: 'center',
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
