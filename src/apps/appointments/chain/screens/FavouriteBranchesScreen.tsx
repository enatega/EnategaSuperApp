import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { showToast } from '../../../../general/components/AppToast';
import { useTheme } from '../../../../general/theme/theme';
import type { AppointmentProvider } from '../../api/types';
import AppointmentsProviderCard from '../../components/home/AppointmentsProviderCard';
import AppointmentsSectionEmptyState from '../../components/home/AppointmentsSectionEmptyState';
import {
  useChainFavourites,
  useToggleChainFavourite,
} from '../hooks/useChainFavourites';
import type { ChainStackParamList } from '../navigation/types';

export default function ChainFavouriteBranchesScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');
  const navigation = useNavigation<NavigationProp<ChainStackParamList>>();
  const query = useChainFavourites();
  const toggle = useToggleChainFavourite();
  const branches = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );

  const openBranch = useCallback(
    (provider: AppointmentProvider) => {
      navigation.navigate('ChainDetails', { provider });
    },
    [navigation],
  );

  const removeFavourite = useCallback(
    (provider: AppointmentProvider) => {
      toggle.mutate(
        { storeId: provider.storeId, nextIsFavorite: false },
        {
          onSuccess: () =>
            showToast.success(t('favourites_toggle_removed')),
          onError: () => showToast.error(t('favourites_toggle_error')),
        },
      );
    },
    [t, toggle],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('chain_favourites_title')} />

      {query.isPending ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : query.isError ? (
        <View style={styles.centered}>
          <Ionicons
            color={colors.danger}
            name="alert-circle-outline"
            size={48}
          />
          <Text color={colors.mutedText} style={styles.centeredText}>
            {t('favourites_error')}
          </Text>
        </View>
      ) : branches.length === 0 ? (
        <View style={styles.empty}>
          <AppointmentsSectionEmptyState
            title={t('chain_favourites_empty_title')}
            message={t('chain_favourites_empty_message')}
          />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={branches}
          keyExtractor={(item) => item.storeId}
          refreshControl={
            <RefreshControl
              refreshing={query.isRefetching}
              onRefresh={query.refetch}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <Pressable onPress={() => openBranch(item)}>
              <AppointmentsProviderCard
                provider={item}
                isFullWidth
                variant="compact"
                actionSlot={
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('favourites_toggle_removed')}
                    disabled={
                      toggle.isPending &&
                      toggle.variables?.storeId === item.storeId
                    }
                    onPress={() => removeFavourite(item)}
                    style={({ pressed }) => [
                      styles.heartButton,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    {toggle.isPending &&
                    toggle.variables?.storeId === item.storeId ? (
                      <ActivityIndicator color={colors.primary} size="small" />
                    ) : (
                      <Ionicons
                        color={colors.primary}
                        name="heart"
                        size={20}
                      />
                    )}
                  </Pressable>
                }
              />
            </Pressable>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReached={() => {
            if (query.hasNextPage && !query.isFetchingNextPage) {
              void query.fetchNextPage();
            }
          }}
          ListFooterComponent={
            query.isFetchingNextPage ? (
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
  empty: {
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
