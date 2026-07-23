import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../../general/components/ScreenHeader';
import Text from '../../../../../general/components/Text';
import { showToast } from '../../../../../general/components/AppToast';
import { useTheme } from '../../../../../general/theme/theme';
import AppointmentsProviderCard from '../../../components/home/AppointmentsProviderCard';
import AppointmentsSectionEmptyState from '../../../components/home/AppointmentsSectionEmptyState';
import { useFavouritesQuery } from '../../../hooks/useFavouritesQuery';
import { useToggleFavouriteMutation } from '../../../hooks/useToggleFavouriteMutation';
import type { AppointmentProvider } from '../../../api/types';
import type { MultiVendorStackParamList } from '../../navigation/types';

export default function FavouritesScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');
  const navigation = useNavigation<NavigationProp<MultiVendorStackParamList>>();

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

  const { mutate: toggleFavourite, isPending: isToggling, variables: toggleVariables } =
    useToggleFavouriteMutation({
      onSuccess: (response) => {
        showToast.success(
          response.isFavorite
            ? t('favourites_toggle_added')
            : t('favourites_toggle_removed'),
        );
      },
      onError: () => {
        showToast.error(t('favourites_toggle_error'));
      },
    });

  const stores = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const handleOpenDetails = useCallback(
    (provider: AppointmentProvider) => {
      navigation.navigate('MultiVendorDetails', { provider });
    },
    [navigation],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: AppointmentProvider }) => (
      <Pressable
        accessibilityRole="button"
        onPress={() => handleOpenDetails(item)}
      >
        <AppointmentsProviderCard
          provider={item}
          isFullWidth
          variant="compact"
          actionSlot={(
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                item.isFavorite ? t('favourites_toggle_removed') : t('favourites_toggle_added')
              }
              disabled={isToggling && toggleVariables?.storeId === item.storeId}
              onPress={() =>
                toggleFavourite({
                  storeId: item.storeId,
                  nextIsFavorite: !(item.isFavorite ?? false),
                })
              }
              style={({ pressed }) => [
                styles.heartButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              {isToggling && toggleVariables?.storeId === item.storeId ? (
                <ActivityIndicator color={colors.primary} size="small" />
              ) : (
                <Ionicons
                  color={colors.primary}
                  name={item.isFavorite ? 'heart' : 'heart-outline'}
                  size={20}
                />
              )}
            </Pressable>
          )}
        />
      </Pressable>
    ),
    [colors.border, colors.primary, colors.surface, handleOpenDetails, isToggling, t, toggleFavourite, toggleVariables],
  );

  if (isLoading) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader title={t('favourites_title')} />
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader title={t('favourites_title')} />
        <View style={styles.centered}>
          <Ionicons color={colors.danger} name="alert-circle-outline" size={48} />
          <Text color={colors.mutedText} style={styles.centeredText}>
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
        <View style={styles.emptyWrap}>
          <AppointmentsSectionEmptyState
            title={t('favourites_empty_title')}
            message={t('favourites_empty_subtitle')}
          />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={stores}
          keyExtractor={(item, index) => `${item.storeId}-${index}`}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          refreshControl={(
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          )}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footer}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
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
  emptyWrap: {
    padding: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  heartButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    width: 32,
    zIndex: 2,
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
