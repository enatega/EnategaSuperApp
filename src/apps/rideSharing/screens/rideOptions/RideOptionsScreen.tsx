import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { mapIntentToCategory, RideCategory, RideIntent } from '../../utils/rideOptions';
import RideOptionsLayout from '../../components/rideOptions/RideOptionsLayout';
import { CachedAddress, RideOptionItem } from '../../components/rideOptions/types';
import { useRideTypes } from '../../hooks/useRideQueries';
import type { RideTypeCatalogItem } from '../../api/types';
import useRecentRideAddresses from '../../hooks/useRecentRideAddresses';
import { toCachedAddress } from '../../utils/rideAddress';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';

type RouteParams = {
  rideType?: RideIntent;
};

const defaultRideIcon = 'https://www.figma.com/api/mcp/asset/06c62618-d47d-4594-aa0c-3e1886f000ba';

function formatRideTypeName(name: string) {
  return name.replace(/_/g, ' ').trim();
}

function toRideOption(ride: RideTypeCatalogItem): RideOptionItem {
  return {
    id: ride.id,
    title: formatRideTypeName(ride.name),
    icon: ride.imageUrl ?? defaultRideIcon,
    seats: ride.seatCount || undefined,
    description: ride.description,
  };
}

function resolveInitialRideTypeId(
  rideOptions: RideOptionItem[],
  rideType?: RideIntent,
) {
  if (!rideOptions.length) {
    return null;
  }

  const mappedIntent = mapIntentToCategory(rideType);

  const matchedOption = rideOptions.find((option) => {
    const normalizedTitle = option.title.toLowerCase();

    if (mappedIntent === 'courier') {
      return normalizedTitle.includes('courier');
    }

    return !normalizedTitle.includes('courier');
  });

  return matchedOption?.id ?? rideOptions[0].id;
}

function resolveRideIntentFromSelection(params: {
  rideOptions: RideOptionItem[];
  selectedCategory: RideCategory | null;
  routeRideType?: RideIntent;
}): RideIntent | undefined {
  const { rideOptions, selectedCategory, routeRideType } = params;
  const selectedOption = rideOptions.find((option) => option.id === selectedCategory);

  if (!selectedOption) {
    return routeRideType;
  }

  return selectedOption.title.toLowerCase().includes('courier') ? 'courier' : 'now';
}

export default function RideOptionsScreen() {
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const route = useRoute();
  const rideType = (route.params as RouteParams | undefined)?.rideType;
  const { recentAddresses } = useRecentRideAddresses();
  const [selectedCategory, setSelectedCategory] = useState<RideCategory | null>(null);

  const rideTypesQuery = useRideTypes({
    gcTime: 5 * 60 * 1000,
  });

  const rideOptions = useMemo<RideOptionItem[]>(
    () => (rideTypesQuery.data ?? []).map(toRideOption),
    [rideTypesQuery.data],
  );
  const resolvedRideType = useMemo(
    () => resolveRideIntentFromSelection({
      rideOptions,
      selectedCategory,
      routeRideType: rideType,
    }),
    [rideOptions, rideType, selectedCategory],
  );

  useEffect(() => {
    if (!rideOptions.length) {
      setSelectedCategory(null);
      return;
    }

    const exists = rideOptions.some((option) => option.id === selectedCategory);

    if (!exists) {
      setSelectedCategory(resolveInitialRideTypeId(rideOptions, rideType));
    }
  }, [rideOptions, rideType, selectedCategory]);

  const cachedAddresses = useMemo<CachedAddress[]>(
    () => recentAddresses.map(toCachedAddress),
    [recentAddresses],
  );

  const handleSearchPress = useCallback((prefilledFromAddress?: CachedAddress) => {
    if (!selectedCategory) {
      return;
    }

    const serializedPrefilledFromAddress = prefilledFromAddress
      ? {
          placeId: prefilledFromAddress.placeId,
          description: prefilledFromAddress.description,
          structuredFormatting: {
            mainText: prefilledFromAddress.structuredFormatting.mainText,
            secondaryText: prefilledFromAddress.structuredFormatting.secondaryText,
          },
          types: prefilledFromAddress.types,
          coordinates: prefilledFromAddress.coordinates,
        }
      : undefined;

    navigation.navigate(
      'RideAddressSearch',
      {
        rideType: resolvedRideType,
        rideCategory: selectedCategory,
        prefilledFromAddress: serializedPrefilledFromAddress,
      },
    );
  }, [navigation, resolvedRideType, selectedCategory]);

  const handleSelectCategory = useCallback((category: RideCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const rideTypesErrorMessage = rideTypesQuery.error?.message || null;

  return (
    <RideOptionsLayout
      rideOptions={rideOptions}
      cachedAddresses={cachedAddresses}
      selectedCategory={selectedCategory}
      onSelectCategory={handleSelectCategory}
      onSearchPress={handleSearchPress}
      onBackPress={handleBackPress}
      isLoadingRideTypes={rideTypesQuery.isPending}
      rideTypesErrorMessage={rideTypesErrorMessage ? `${t('ride_types_error_description')} ${rideTypesErrorMessage}` : null}
      onRetryRideTypes={() => {
        void rideTypesQuery.refetch();
      }}
    />
  );
}
