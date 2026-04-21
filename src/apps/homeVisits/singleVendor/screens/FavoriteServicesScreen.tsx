import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ServicesCard from '../../components/ServicesCard';
import type { HomeVisitsSingleVendorCategoryService } from '../api/types';
import FavoriteServicesSkeleton from '../components/Favorites/FavoriteServicesSkeleton';
import useSingleVendorFavoriteServices from '../hooks/useSingleVendorFavoriteServices';

type Props = Record<string, never>;

export default function FavoriteServicesScreen({}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();
  const { data, isPending, isError, isRefetching, refetch } =
    useSingleVendorFavoriteServices();

  useFocusEffect(
    React.useCallback(() => {
      void refetch();
    }, [refetch]),
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
        keyExtractor={(item) => `${item.productId}-${item.serviceCenterId}`}
        renderItem={({ item }: { item: HomeVisitsSingleVendorCategoryService }) => (
          <ServicesCard item={item} layout="fullWidth" />
        )}
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
