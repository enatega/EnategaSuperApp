import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import {
  normalizeAddressDescription,
  toCachedAddress,
  toRideAddressSelection,
} from '../../utils/rideAddress';
import useDebouncedValue from '../../../../general/hooks/useDebouncedValue';
import useRecentRideAddresses from '../../hooks/useRecentRideAddresses';
import RideAddressSuggestionSkeletonList from './components/RideAddressSuggestionSkeletonList';
import RideAddressEmptyState from './components/RideAddressEmptyState';
import RideChooseOnMapView from './components/RideChooseOnMapView';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import type { RideCategory, RideIntent } from '../../utils/rideOptions';

type RouteParams = {
  rideType?: RideIntent;
  rideCategory?: RideCategory;
  prefilledFromAddress?: CachedAddress;
  prefilledStopAddress?: RideAddressSelection;
  fromAddress?: RideAddressSelection;
  toAddress?: RideAddressSelection;
  stops?: RideAddressSelection[];
  stopAction?: 'add' | 'edit';
  stopIndex?: number;
};

export default function RideAddressSearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const route = useRoute();
  const queryClient = useQueryClient();
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const {
    rideType,
    rideCategory,
    prefilledFromAddress,
    prefilledStopAddress,
    fromAddress: initialFromAddress,
    toAddress: initialToAddress,
    stops = [],
    stopAction,
    stopIndex,
  } = (route.params as RouteParams | undefined) ?? {};
  const isStopMode = stopAction === 'add' || stopAction === 'edit';
  const isAddingStop = stopAction === 'add';
  const isEditingStop = stopAction === 'edit';
  const [activeField, setActiveField] = useState<'from' | 'to' | 'stop'>(isAddingStop ? 'stop' : 'from');
  const [focusSignal, setFocusSignal] = useState(0);
  const [screenMode, setScreenMode] = useState<'search' | 'map'>('search');
  const [fromValue, setFromValue] = useState('');
  const [stopValue, setStopValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [, setSelectedFromAddress] = useState<RideAddressSelection | null>(null);
  const [, setSelectedStopAddress] = useState<RideAddressSelection | null>(null);
  const [, setSelectedToAddress] = useState<RideAddressSelection | null>(null);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const { recentAddresses, isLoadingRecentAddresses, refreshRecentAddresses } = useRecentRideAddresses();
  const selectedFromAddressRef = useRef<RideAddressSelection | null>(null);
  const selectedStopAddressRef = useRef<RideAddressSelection | null>(null);
  const selectedToAddressRef = useRef<RideAddressSelection | null>(null);

  useEffect(() => {
    if (initialFromAddress?.coordinates) {
      selectedFromAddressRef.current = initialFromAddress;
      setSelectedFromAddress(initialFromAddress);
      setFromValue(initialFromAddress.description);
    }

    if (initialToAddress?.coordinates) {
      selectedToAddressRef.current = initialToAddress;
      setSelectedToAddress(initialToAddress);
      setToValue(initialToAddress.description);
    }

    if (isStopMode) {
      if (isEditingStop && prefilledStopAddress?.coordinates) {
        selectedStopAddressRef.current = prefilledStopAddress;
        setSelectedStopAddress(prefilledStopAddress);
        setStopValue(prefilledStopAddress.description);
      } else {
        selectedStopAddressRef.current = null;
        setSelectedStopAddress(null);
        setStopValue('');
      }
    }

    if (!prefilledFromAddress?.coordinates || initialFromAddress?.coordinates) {
      if (!isStopMode && !initialFromAddress?.coordinates) {
        setActiveField('from');
      }
      return;
    }

    const prefilledSelection: RideAddressSelection = {
      placeId: prefilledFromAddress.placeId,
      description: prefilledFromAddress.description,
      structuredFormatting: prefilledFromAddress.structuredFormatting,
      coordinates: prefilledFromAddress.coordinates,
    };

    selectedFromAddressRef.current = prefilledSelection;
    setSelectedFromAddress(prefilledSelection);
    setFromValue(prefilledSelection.description);
    setActiveField('to');
  }, [
    initialFromAddress,
    initialToAddress,
    isEditingStop,
    isStopMode,
    prefilledFromAddress,
    prefilledStopAddress,
  ]);

  useFocusEffect(
    useCallback(() => {
      if (!isStopMode) {
        return undefined;
      }

      setActiveField('stop');
      if (isAddingStop) {
        selectedStopAddressRef.current = null;
        setSelectedStopAddress(null);
        setStopValue('');
      }
      setFocusSignal((currentValue) => currentValue + 1);

      return undefined;
    }, [isAddingStop, isStopMode]),
  );

  const activeValue = activeField === 'from' ? fromValue : activeField === 'stop' ? stopValue : toValue;
  const normalizedActiveValue = activeValue.trim();
  const debouncedQuery = useDebouncedValue(normalizedActiveValue, 1000);
  const selectedActiveAddress = activeField === 'from'
    ? selectedFromAddressRef.current
    : activeField === 'stop'
      ? selectedStopAddressRef.current
    : selectedToAddressRef.current;
  const hasConfirmedActiveSelection = selectedActiveAddress?.description === normalizedActiveValue;
  const isSearchMode = normalizedActiveValue.length > 0 && !hasConfirmedActiveSelection;
  const shouldSearchSuggestions = debouncedQuery.length > 0 && isSearchMode;

  const predictionsQuery = useRideAddressPredictions(
    debouncedQuery,
    shouldSearchSuggestions,
  );
  const isWaitingForDebounce = isSearchMode && normalizedActiveValue !== debouncedQuery;
  const shouldShowSuggestionSkeleton = isSearchMode
    && (isWaitingForDebounce || predictionsQuery.isFetching || predictionsQuery.isPending);
  const shouldShowRecentSkeleton = normalizedActiveValue.length === 0
    && isLoadingRecentAddresses
    && recentAddresses.length === 0;
  const loadingField = isResolvingAddress || shouldShowSuggestionSkeleton ? activeField : null;

  const suggestionAddresses = useMemo<CachedAddress[]>(() => {
    if (isSearchMode) {
      return (predictionsQuery.data ?? []).map((prediction) => {
        const description = normalizeAddressDescription(prediction.description);
        const [mainText, ...secondaryParts] = description.split(',');

        return {
          placeId: prediction.place_id,
          description,
          structuredFormatting: {
            mainText: mainText?.trim() ?? description,
            secondaryText: secondaryParts.join(',').trim() || undefined,
          },
        };
      });
    }

    return recentAddresses.map(toCachedAddress);
  }, [isSearchMode, predictionsQuery.data, recentAddresses]);

  const applySelectedAddress = useCallback(async (selectedAddress: RideAddressSelection) => {
    if (activeField === 'stop') {
      const nextFromAddress = selectedFromAddressRef.current ?? initialFromAddress;
      const nextToAddress = selectedToAddressRef.current ?? initialToAddress;

      if (!nextFromAddress || !nextToAddress) {
        return;
      }

      selectedStopAddressRef.current = selectedAddress;
      setSelectedStopAddress(selectedAddress);
      setStopValue(selectedAddress.description);
      const nextStops = isEditingStop && typeof stopIndex === 'number'
        ? stops.map((stop, index) => (index === stopIndex ? selectedAddress : stop))
        : [...stops, selectedAddress];

      navigation.navigate('RideEstimate', {
        rideType,
        rideCategory,
        fromAddress: nextFromAddress,
        toAddress: nextToAddress,
        stops: nextStops,
      });
      return;
    }

    const nextFromAddress = activeField === 'from' ? selectedAddress : selectedFromAddressRef.current;
    const nextToAddress = activeField === 'to' ? selectedAddress : selectedToAddressRef.current;

    if (activeField === 'from') {
      selectedFromAddressRef.current = selectedAddress;
      setSelectedFromAddress(selectedAddress);
      setFromValue(selectedAddress.description);
    } else {
      selectedToAddressRef.current = selectedAddress;
      setSelectedToAddress(selectedAddress);
      setToValue(selectedAddress.description);
    }

    setScreenMode('search');

    if (activeField === 'from') {
      await saveRecentFromAddress(selectedAddress);
    } else {
      await saveRecentToAddress(selectedAddress);
    }

    if (nextFromAddress && nextToAddress) {
      if (rideType === 'courier') {
        navigation.navigate(
          'CourierDetails',
          {
            rideType,
            rideCategory,
            fromAddress: nextFromAddress,
            toAddress: nextToAddress,
            stops,
            source: 'addressSearch',
          },
        );
      } else {
        navigation.navigate(
          'RideEstimate',
          {
            rideType,
            rideCategory,
            fromAddress: nextFromAddress,
            toAddress: nextToAddress,
            stops,
          },
        );
      }
      return;
    }

    const nextActiveField = activeField === 'from' ? 'to' : 'from';
    setActiveField(nextActiveField);
    await refreshRecentAddresses();
  }, [
    activeField,
    initialFromAddress,
    initialToAddress,
    isEditingStop,
    navigation,
    refreshRecentAddresses,
    rideCategory,
    rideType,
    stopIndex,
    stops,
  ]);

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

      await applySelectedAddress(selectedAddress);
    } catch (error) {
      console.warn('Unable to resolve selected address', error);
    } finally {
      setIsResolvingAddress(false);
    }
  }, [applySelectedAddress, queryClient]);

  const handleChangeFrom = useCallback((value: string) => {
    setFromValue(value);
    if (selectedFromAddressRef.current?.description !== value) {
      selectedFromAddressRef.current = null;
      setSelectedFromAddress(null);
    }
  }, []);

  const handleChangeTo = useCallback((value: string) => {
    setToValue(value);
    if (selectedToAddressRef.current?.description !== value) {
      selectedToAddressRef.current = null;
      setSelectedToAddress(null);
    }
  }, []);

  const handleChangeStop = useCallback((value: string) => {
    setStopValue(value);
    if (selectedStopAddressRef.current?.description !== value) {
      selectedStopAddressRef.current = null;
      setSelectedStopAddress(null);
    }
  }, []);

  const emptyState = isSearchMode ? (
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
      mode={isStopMode ? 'stop' : 'trip'}
      focusSignal={focusSignal}
      fromValue={fromValue}
      toValue={toValue}
      stopValue={stopValue}
      onChangeFrom={handleChangeFrom}
      onChangeTo={handleChangeTo}
      onChangeStop={handleChangeStop}
      onFocusFrom={() => setActiveField('from')}
      onFocusTo={() => setActiveField('to')}
      onFocusStop={() => setActiveField('stop')}
      onChooseOnMap={() => setScreenMode('map')}
      activeField={activeField}
      fromPlaceholder={t('ride_address_from_placeholder')}
      toPlaceholder={t('ride_address_to_placeholder')}
      stopPlaceholder={t('ride_address_stop_placeholder')}
      chooseOnMapLabel={t('ride_address_choose_on_map')}
      loadingField={loadingField}
    />
  );

  const activeSelectionCoordinates = activeField === 'from'
    ? selectedFromAddressRef.current?.coordinates
    : activeField === 'stop'
      ? selectedStopAddressRef.current?.coordinates
    : selectedToAddressRef.current?.coordinates;

  if (screenMode === 'map') {
    return (
      <RideChooseOnMapView
        activeField={activeField}
        initialCoordinate={activeSelectionCoordinates}
        onBackPress={() => setScreenMode('search')}
        onConfirm={applySelectedAddress}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
        <ScreenHeader
          title={isAddingStop ? t('ride_address_stop_title') : t('ride_address_title')}
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
