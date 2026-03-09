import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import CachedAddressList from '../../components/rideOptions/CachedAddressList';
import { CachedAddress } from '../../components/rideOptions/types';
import RideAddressSearchHeader from './components/RideAddressSearchHeader';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Icon from '../../../../general/components/Icon';
import useRideAddressPredictions from '../../hooks/useRideAddressPredictions';
import { rideService } from '../../api/rideService';
import { rideKeys } from '../../api/queryKeys';
import type { RideAddressSelection } from '../../api/types';
import {
  saveRecentFromAddress,
  saveRecentToAddress,
} from '../../storage/recentRideAddresses';
import { toCachedAddress, toRideAddressSelection } from '../../utils/rideAddress';
import useDebouncedValue from '../../../../general/hooks/useDebouncedValue';
import useRecentRideAddresses from '../../hooks/useRecentRideAddresses';
import RideAddressSuggestionSkeletonList from './components/RideAddressSuggestionSkeletonList';
import RideAddressEmptyState from './components/RideAddressEmptyState';

type RouteParams = {
  rideType?: string;
  rideCategory?: string;
};

export default function RideAddressSearchScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const queryClient = useQueryClient();
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const { rideType, rideCategory } = (route.params as RouteParams | undefined) ?? {};
  const [activeField, setActiveField] = useState<'from' | 'to'>('from');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [selectedFromAddress, setSelectedFromAddress] = useState<RideAddressSelection | null>(null);
  const [selectedToAddress, setSelectedToAddress] = useState<RideAddressSelection | null>(null);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const { recentAddresses, isLoadingRecentAddresses, refreshRecentAddresses } = useRecentRideAddresses();

  const activeValue = activeField === 'from' ? fromValue : toValue;
  const normalizedActiveValue = activeValue.trim();
  const debouncedQuery = useDebouncedValue(normalizedActiveValue, 450);
  const selectedActiveAddress = activeField === 'from' ? selectedFromAddress : selectedToAddress;
  const hasConfirmedActiveSelection = selectedActiveAddress?.description === normalizedActiveValue;

  const predictionsQuery = useRideAddressPredictions(
    debouncedQuery,
    !hasConfirmedActiveSelection,
  );
  const isShowingSuggestions = normalizedActiveValue.length >= 3;
  const shouldSearchSuggestions = isShowingSuggestions && !hasConfirmedActiveSelection;
  const isWaitingForDebounce = shouldSearchSuggestions && normalizedActiveValue !== debouncedQuery;
  const isSearchingSuggestions = isShowingSuggestions
    && shouldSearchSuggestions
    && (isWaitingForDebounce || predictionsQuery.isFetching);
  const shouldShowSuggestionSkeleton = shouldSearchSuggestions
    && (isSearchingSuggestions || predictionsQuery.isPending);
  const shouldShowRecentSkeleton = !isShowingSuggestions
    && isLoadingRecentAddresses
    && recentAddresses.length === 0;
  const loadingField = isResolvingAddress || isSearchingSuggestions ? activeField : null;

  const suggestionAddresses = useMemo<CachedAddress[]>(() => {
    if (shouldSearchSuggestions) {
      return (predictionsQuery.data ?? []).map((prediction) => ({
        placeId: prediction.place_id,
        description: prediction.description,
        structuredFormatting: {
          mainText: prediction.description.split(',')[0]?.trim() ?? prediction.description,
          secondaryText: prediction.description.split(',').slice(1).join(',').trim() || undefined,
        },
      }));
    }

    return recentAddresses.map(toCachedAddress);
  }, [predictionsQuery.data, recentAddresses, shouldSearchSuggestions]);

  const handleSelectAddress = useCallback(async (item: CachedAddress) => {
    setIsResolvingAddress(true);

    try {
      const selectedAddress = item.coordinates
        ? {
            placeId: item.placeId,
            description: item.description,
            structuredFormatting: item.structuredFormatting,
            coordinates: item.coordinates,
          }
        : toRideAddressSelection(
            {
              description: item.description,
              place_id: item.placeId,
            },
            await queryClient.fetchQuery({
              queryKey: rideKeys.placeDetails(item.placeId),
              queryFn: () => rideService.getPlaceDetails(item.placeId),
              staleTime: 5 * 60 * 1000,
            }),
          );

      const nextFromAddress = activeField === 'from' ? selectedAddress : selectedFromAddress;
      const nextToAddress = activeField === 'to' ? selectedAddress : selectedToAddress;

      if (activeField === 'from') {
        setSelectedFromAddress(selectedAddress);
        setFromValue(selectedAddress.description);
      } else {
        setSelectedToAddress(selectedAddress);
        setToValue(selectedAddress.description);
      }

      if (nextFromAddress && nextToAddress) {
        setIsResolvingAddress(false);
        navigation.navigate(
          'RideEstimate' as never,
          {
            rideType,
            rideCategory,
            fromAddress: nextFromAddress,
            toAddress: nextToAddress,
          } as never,
        );
        return;
      }

      const nextActiveField = activeField === 'from' ? 'to' : 'from';
      setIsResolvingAddress(false);
      setActiveField(nextActiveField);

      void (async () => {
        if (activeField === 'from') {
          await saveRecentFromAddress(selectedAddress);
        } else {
          await saveRecentToAddress(selectedAddress);
        }

        await refreshRecentAddresses();
      })();
    } catch (error) {
      console.warn('Unable to resolve selected address', error);
    } finally {
      setIsResolvingAddress(false);
    }
  }, [
    activeField,
    navigation,
    refreshRecentAddresses,
    rideCategory,
    rideType,
    selectedFromAddress,
    selectedToAddress,
  ]);

  const handleChangeFrom = useCallback((value: string) => {
    setFromValue(value);
    setSelectedFromAddress((currentValue) =>
      currentValue?.description === value ? currentValue : null,
    );
  }, []);

  const handleChangeTo = useCallback((value: string) => {
    setToValue(value);
    setSelectedToAddress((currentValue) =>
      currentValue?.description === value ? currentValue : null,
    );
  }, []);

  const emptyState = shouldSearchSuggestions ? (
    <RideAddressEmptyState
      title={t('ride_address_no_results_title')}
      description={t('ride_address_no_results_description')}
    />
  ) : (
    <RideAddressEmptyState
      title={t('ride_address_recent_empty_title')}
      description={t('ride_address_recent_empty_description')}
    />
  );

  const searchHeader = (
    <RideAddressSearchHeader
      fromValue={fromValue}
      toValue={toValue}
      onChangeFrom={handleChangeFrom}
      onChangeTo={handleChangeTo}
      onFocusFrom={() => setActiveField('from')}
      onFocusTo={() => setActiveField('to')}
      fromPlaceholder={t('ride_address_from_placeholder')}
      toPlaceholder={t('ride_address_to_placeholder')}
      chooseOnMapLabel={t('ride_address_choose_on_map')}
      loadingField={loadingField}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <ScreenHeader
          title={t('ride_address_title')}
          leftSlot={(
            <Pressable
              onPress={() => navigation.goBack()}
              style={[
                styles.iconButton,
                { backgroundColor: colors.surfaceSoft, shadowColor: colors.shadowColor },
              ]}
              accessibilityRole="button"
              accessibilityLabel={t('ride_address_close')}
            >
              <Icon type="Feather" name="x" size={18} color={colors.text} />
            </Pressable>
          )}
        />
        {shouldShowSuggestionSkeleton || shouldShowRecentSkeleton ? (
          <View>
            {searchHeader}
            <RideAddressSuggestionSkeletonList />
          </View>
        ) : (
          <CachedAddressList
            data={suggestionAddresses}
            onSelect={handleSelectAddress}
            ListHeaderComponent={searchHeader}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={emptyState}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
