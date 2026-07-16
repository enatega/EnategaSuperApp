import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ServicesCard from '../../components/ServicesCard';
import ProviderCard from '../../multiVendor/components/ProviderCard';
import useFavoriteServiceCenters from '../../multiVendor/hooks/useFavoriteServiceCenters';
import type {
  HomeVisitsFavoriteServiceCenter,
  HomeVisitsMultiVendorProvider,
} from '../../multiVendor/api/types';
import type { HomeVisitsSingleVendorCategoryService } from '../api/types';
import FavoriteServicesSkeleton from '../components/Favorites/FavoriteServicesSkeleton';
import useSingleVendorFavoriteServices from '../hooks/useSingleVendorFavoriteServices';

type Props = Record<string, never>;

export default function FavoriteServicesScreen({}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {
    data: favoriteServices,
    isPending: areServicesPending,
    isError: hasServicesError,
    isRefetching: areServicesRefetching,
    refetch: refetchServices,
    fetchNextPage: fetchNextServicesPage,
    hasNextPage: hasNextServicesPage,
    isFetchingNextPage: isFetchingNextServicesPage,
  } = useSingleVendorFavoriteServices();
  const {
    data: favoriteCenters,
    isPending: areCentersPending,
    isError: hasCentersError,
    isRefetching: areCentersRefetching,
    refetch: refetchCenters,
    fetchNextPage: fetchNextCentersPage,
    hasNextPage: hasNextCentersPage,
    isFetchingNextPage: isFetchingNextCentersPage,
  } = useFavoriteServiceCenters();
  const isPending = areServicesPending || areCentersPending;
  const isError = hasServicesError && hasCentersError;
  const isRefetching = areServicesRefetching || areCentersRefetching;
  const isFetchingNextPage = isFetchingNextServicesPage || isFetchingNextCentersPage;
  const data = React.useMemo(
    () => [
      ...favoriteCenters.map((item) => ({ item, type: 'center' as const })),
      ...favoriteServices.map((item) => ({ item, type: 'service' as const })),
    ],
    [favoriteCenters, favoriteServices],
  );

  const refetch = React.useCallback(async () => {
    await Promise.all([refetchCenters(), refetchServices()]);
  }, [refetchCenters, refetchServices]);

  const onEndReached = React.useCallback(() => {
    if (isFetchingNextPage) {
      return;
    }

    if (hasNextCentersPage) {
      void fetchNextCentersPage();
    }

    if (hasNextServicesPage) {
      void fetchNextServicesPage();
    }
  }, [
    fetchNextCentersPage,
    fetchNextServicesPage,
    hasNextCentersPage,
    hasNextServicesPage,
    isFetchingNextPage,
  ]);

  useFocusEffect(
    React.useCallback(() => {
      void refetch();
    }, [refetch]),
  );

  const mapCenterToProvider = React.useCallback(
    (center: HomeVisitsFavoriteServiceCenter): HomeVisitsMultiVendorProvider => ({
      id: center.serviceCenterId,
      serviceCenterId: center.serviceCenterId,
      name: center.name,
      imageUrl: center.coverImage || center.logo,
      logoUrl: center.logo,
      coverImageUrl: center.coverImage || center.logo,
      address: center.address,
      categoryName: center.shopTypeName,
      averageRating: center.averageRating,
      reviewCount: center.reviewCount,
      distanceLabel:
        center.distanceKm == null ? null : `${Number(center.distanceKm).toFixed(1)} km`,
      availabilityLabel: center.isClosed ? t('closed') : 'Available now',
      isClosed: center.isClosed,
      isFavorite: center.isFavorite,
    }),
    [t],
  );

  const handleCenterPress = React.useCallback(
    (center: HomeVisitsFavoriteServiceCenter) => {
      const provider = mapCenterToProvider(center);

      (navigation as unknown as {
        navigate: (screen: string, params: { provider: HomeVisitsMultiVendorProvider }) => void;
      }).navigate('MultiVendorCenterDetails', { provider });
    },
    [mapCenterToProvider, navigation],
  );

  if (isPending) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader title={t('single_vendor_favorites_title')} />
        <View style={styles.content}>
          <FavoriteServicesSkeleton />
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader title={t('single_vendor_favorites_title')} />
        <View style={styles.centerState}>
          <Text
            weight="medium"
            style={{
              color: colors.text,
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md,
              textAlign: 'center',
            }}
          >
            {t('single_vendor_favorites_error')}
          </Text>
        </View>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader title={t('single_vendor_favorites_title')} />
        <View style={styles.centerState}>
          <Text
            weight="medium"
            style={{
              color: colors.text,
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md,
              textAlign: 'center',
            }}
          >
            {t('single_vendor_favorites_empty')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('single_vendor_favorites_title')} />
      <FlatList
        data={data}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        keyExtractor={(entry) =>
          entry.type === 'center'
            ? `center-${entry.item.serviceCenterId}`
            : `service-${entry.item.productId}-${entry.item.serviceCenterId}`
        }
        renderItem={({ item: entry }) =>
          entry.type === 'center' ? (
            <ProviderCard
              provider={mapCenterToProvider(entry.item)}
              layout="fullWidth"
              onPress={() => handleCenterPress(entry.item)}
            />
          ) : (
            <ServicesCard
              item={entry.item as HomeVisitsSingleVendorCategoryService}
              layout="fullWidth"
            />
          )
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              void refetch();
            }}
            refreshing={isRefetching}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: insets.bottom + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={colors.primary} size="small" />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centerState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  footerLoader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  screen: {
    flex: 1,
  },
  separator: {
    height: 12,
  },
});
