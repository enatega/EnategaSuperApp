import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../general/components/AppToast';
import HorizontalList from '../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../general/components/SectionActionHeader';
import type { AppointmentOrderAgainItem } from '../../api/types';
import { useAppointmentOrderAgain } from '../../hooks/useDiscoveryQueries';
import { useToggleFavouriteMutation } from '../../hooks/useToggleFavouriteMutation';
import AppointmentsOrderAgainCard from './AppointmentsOrderAgainCard';
import AppointmentsProviderSkeleton from './AppointmentsProviderSkeleton';
import AppointmentsSectionEmptyState from './AppointmentsSectionEmptyState';

type Props = {
  title: string;
  actionLabel: string;
  emptyTitle: string;
  emptyMessage: string;
  onActionPress: () => void;
  onItemPress: (item: AppointmentOrderAgainItem) => void;
  items?: AppointmentOrderAgainItem[];
  isPending?: boolean;
};

export default function AppointmentsOrderAgainSection({
  title,
  actionLabel,
  emptyTitle,
  emptyMessage,
  onActionPress,
  onItemPress,
  items: externalItems,
  isPending: externalIsPending,
}: Props) {
  const { t } = useTranslation('appointments');
  const [favoriteOverrides, setFavoriteOverrides] = useState<
    Record<string, boolean>
  >({});
  const { data: queriedItems = [], isPending: queriedIsPending } =
    useAppointmentOrderAgain(
      { limit: 8 },
      { enabled: externalItems === undefined },
    );
  const items = externalItems ?? queriedItems;
  const isPending = externalIsPending ?? queriedIsPending;
  const {
    mutate: toggleFavourite,
    isPending: isTogglingFavourite,
    variables: toggleVariables,
  } = useToggleFavouriteMutation({
    onSuccess: (response, variables) => {
      setFavoriteOverrides((current) => ({
        ...current,
        [variables.storeId]: response.isFavorite,
      }));
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

  const handleFavoritePress = useCallback(
    (item: AppointmentOrderAgainItem) => {
      const isFavorite =
        favoriteOverrides[item.storeId] ?? item.isFavorite ?? false;
      toggleFavourite({
        storeId: item.storeId,
        nextIsFavorite: !isFavorite,
      });
    },
    [favoriteOverrides, toggleFavourite],
  );

  return (
    <View style={styles.section}>
      <SectionActionHeader
        title={title}
        actionLabel={items.length ? actionLabel : undefined}
        onActionPress={onActionPress}
      />

      {isPending ? (
        <AppointmentsProviderSkeleton />
      ) : !items.length ? (
        <AppointmentsSectionEmptyState
          title={emptyTitle}
          message={emptyMessage}
        />
      ) : (
        <HorizontalList
          data={items}
          keyExtractor={(item) => item.productId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <Pressable accessibilityRole="button" onPress={() => onItemPress(item)}>
              <AppointmentsOrderAgainCard
                item={item}
                isFavorite={
                  favoriteOverrides[item.storeId] ?? item.isFavorite ?? false
                }
                isFavoritePending={
                  isTogglingFavourite &&
                  toggleVariables?.storeId === item.storeId
                }
                onFavoritePress={handleFavoritePress}
              />
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingRight: 16,
  },
  section: {
    gap: 12,
    paddingHorizontal: 16,
  },
  separator: {
    width: 12,
  },
});
