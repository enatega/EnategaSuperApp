import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../general/components/SectionActionHeader';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../../../../general/components/discovery';
import ProviderCard from './ProviderCard';
import type { HomeVisitsMultiVendorProvider } from '../api/types';
import useMultiVendorProviders from '../hooks/useMultiVendorProviders';
import type { MultiVendorStackParamList } from '../navigation/types';

type Props = {
  emptyMessage?: string;
  mainServiceId?: string | null;
  latitude?: number;
  longitude?: number;
  scope?: 'top-centers' | 'service-providers';
  title?: string;
};

export default function ProvidersSection({
  emptyMessage,
  latitude,
  longitude,
  mainServiceId,
  scope = 'top-centers',
  title,
}: Props) {
  const { t } = useTranslation('homeVisits');
  const navigation =
    useNavigation<NativeStackNavigationProp<MultiVendorStackParamList>>();
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
      mainServiceId: mainServiceId ?? undefined,
    },
    {
      scope,
    },
  );
  const isEmpty = !isPending && !isError && providers.length === 0;

  const handleProviderPress = useCallback(
    (provider: HomeVisitsMultiVendorProvider) => {
      navigation.navigate('MultiVendorCenterDetails', { provider });
    },
    [navigation],
  );

  const handleSeeAll = useCallback(() => {
    navigation.navigate('MultiVendorCentersSeeAll', {
      title: title ?? t('multi_vendor_providers_title'),
      scope,
      mainServiceId: mainServiceId ?? undefined,
      latitude,
      longitude,
    });
  }, [latitude, longitude, mainServiceId, navigation, scope, t, title]);

  const handleEndReached = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={providers.length > 0 ? t('single_vendor_see_all') : undefined}
        title={title ?? t('multi_vendor_providers_title')}
        onActionPress={handleSeeAll}
      />

      {isPending ? (
        <DiscoveryResultsSkeleton />
      ) : isError ? (
        <DiscoverySectionState
          tone="error"
          title={t('single_vendor_home_section_error_title')}
          message={t('single_vendor_home_section_error_message')}
        />
      ) : isEmpty ? (
        <DiscoverySectionState
          title={t('single_vendor_home_section_empty_title')}
          message={emptyMessage ?? t('multi_vendor_providers_empty')}
        />
      ) : (
        <HorizontalList
          data={providers}
          keyExtractor={(item) => item.id || item.serviceCenterId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.6}
          renderItem={({ item }) => (
            <ProviderCard
              provider={item}
              onPress={() => handleProviderPress(item)}
            />
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
