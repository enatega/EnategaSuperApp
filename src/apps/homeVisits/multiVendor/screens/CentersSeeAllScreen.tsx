import React, { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import VerticalList from '../../../../general/components/VerticalList';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../../../../general/components/discovery';
import { useTheme } from '../../../../general/theme/theme';
import { useTranslations } from '../../../../general/localization/LocalizationProvider';
import ProviderCard from '../components/ProviderCard';
import useMultiVendorProviders from '../hooks/useMultiVendorProviders';
import type { HomeVisitsMultiVendorProvider } from '../api/types';
import type { MultiVendorStackParamList } from '../navigation/types';

type CentersSeeAllRouteProp = RouteProp<
  MultiVendorStackParamList,
  'MultiVendorCentersSeeAll'
>;

export default function CentersSeeAllScreen() {
  const route = useRoute<CentersSeeAllRouteProp>();
  const navigation =
    useNavigation<NativeStackNavigationProp<MultiVendorStackParamList>>();
  const { colors } = useTheme();
  const { t } = useTranslations('homeVisits');
  const {
    title,
    scope = 'top-centers',
    mainServiceId,
    latitude,
    longitude,
  } = route.params;

  const {
    data: providers = [],
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useMultiVendorProviders(
    {
      latitude,
      longitude,
      mainServiceId,
    },
    { scope },
  );

  const handleProviderPress = useCallback(
    (provider: HomeVisitsMultiVendorProvider) => {
      navigation.navigate('MultiVendorCenterDetails', { provider });
    },
    [navigation],
  );

  const handleEndReached = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderProvider = useCallback(
    ({ item }: { item: HomeVisitsMultiVendorProvider }) => (
      <ProviderCard
        provider={item}
        onPress={() => handleProviderPress(item)}
        layout="fullWidth"
      />
    ),
    [handleProviderPress],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={title} showBack />

      {isPending ? (
        <View style={styles.skeleton}>
          <DiscoveryResultsSkeleton />
          <DiscoveryResultsSkeleton />
        </View>
      ) : isError ? (
        <View style={styles.state}>
          <DiscoverySectionState
            tone="error"
            title={t('single_vendor_home_section_error_title')}
            message={t('single_vendor_home_section_error_message')}
          />
        </View>
      ) : providers.length === 0 ? (
        <View style={styles.state}>
          <DiscoverySectionState
            title={t('single_vendor_home_section_empty_title')}
            message={t('multi_vendor_providers_empty')}
          />
        </View>
      ) : (
        <VerticalList
          data={providers}
          keyExtractor={(item) => item.id || item.serviceCenterId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator color={colors.primary} style={styles.footerLoader} />
            ) : null
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.6}
          renderItem={renderProvider}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  footerLoader: {
    paddingVertical: 16,
  },
  listContent: {
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  screen: {
    flex: 1,
  },
  separator: {
    height: 14,
  },
  skeleton: {
    gap: 12,
    padding: 16,
  },
  state: {
    padding: 16,
  },
});
