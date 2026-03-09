import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { mapIntentToCategory, RideCategory, RideIntent } from '../../utils/rideOptions';
import RideOptionsLayout from '../../components/rideOptions/RideOptionsLayout';
import { CachedAddress, RideOptionItem } from '../../components/rideOptions/types';
import { useRideTypeFares } from '../../hooks/useRideQueries';
import type { RideTypeFare, RideTypeFareParams } from '../../api/types';
import useRecentRideAddresses from '../../hooks/useRecentRideAddresses';
import { toCachedAddress } from '../../utils/rideAddress';

const rideIcon = 'https://www.figma.com/api/mcp/asset/06c62618-d47d-4594-aa0c-3e1886f000ba';
const womenRideIcon = 'https://www.figma.com/api/mcp/asset/3a734633-3d43-45c8-ae5c-b469d8a82f2f';
const premiumIcon = 'https://www.figma.com/api/mcp/asset/656d5875-dd51-4403-9fd7-a895e4f8668c';
const courierIcon = 'https://www.figma.com/api/mcp/asset/70ff6ddc-ce4a-4886-931c-382d1603fa9e';

type RouteParams = {
  rideType?: RideIntent;
};

function getFallbackRideOptions(t: (key: string) => string): RideOptionItem[] {
  return [
    {
      id: 'ride',
      title: t('ride_option_now_title'),
      icon: rideIcon,
      seats: 4,
    },
    {
      id: 'women',
      title: t('ride_option_women_title'),
      icon: womenRideIcon,
      seats: 4,
    },
    {
      id: 'ac',
      title: t('ride_option_ac_title'),
      icon: rideIcon,
      seats: 4,
      showSnowflake: true,
    },
    {
      id: 'premium',
      title: t('ride_option_premium_title'),
      icon: premiumIcon,
      seats: 4,
    },
    {
      id: 'courier',
      title: t('ride_option_courier_title'),
      icon: courierIcon,
    },
  ];
}

const defaultRideTypeParams: RideTypeFareParams = {
  distanceKm: 5,
  durationMin: 10,
  isHourly: false,
  pickup_lat: 0,
  pickup_lng: 0,
  dropoff_lat: 0,
  dropoff_lng: 0,
};

function formatRideTypeName(name: string) {
  return name.replace(/_/g, ' ');
}

function resolveRideIcon(ride: RideTypeFare) {
  if (ride.imageUrl) return ride.imageUrl;
  if (/courier/i.test(ride.name)) return courierIcon;
  if (/premium/i.test(ride.name)) return premiumIcon;
  if (/women/i.test(ride.name)) return womenRideIcon;
  return rideIcon;
}

function toRideOption(ride: RideTypeFare, t: (key: string) => string): RideOptionItem {
  const title = ride.name ? formatRideTypeName(ride.name) : t('ride_option_now_title');
  const seats = ride.capacity ?? (/courier/i.test(ride.name) ? undefined : 4);

  return {
    id: ride.ride_type_id ?? ride.name,
    title,
    icon: resolveRideIcon(ride),
    seats,
    showSnowflake: /ac/i.test(ride.name),
  };
}

function fallbackTitleForId(id: string, t: (key: string) => string) {
  switch (id) {
    case 'ride':
      return t('ride_option_now_title');
    case 'women':
      return t('ride_option_women_title');
    case 'ac':
      return t('ride_option_ac_title');
    case 'premium':
      return t('ride_option_premium_title');
    case 'courier':
      return t('ride_option_courier_title');
    default:
      return id;
  }
}

export default function RideOptionsScreen() {
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation();
  const route = useRoute();
  const rideType = (route.params as RouteParams | undefined)?.rideType;
  const { recentAddresses } = useRecentRideAddresses();
  const [selectedCategory, setSelectedCategory] = useState<RideCategory>(
    mapIntentToCategory(rideType),
  );

  const rideTypeQuery = useRideTypeFares(defaultRideTypeParams, {
    gcTime: 5 * 60 * 1000,
  });

  const rideOptions = useMemo<RideOptionItem[]>(() => {
    if (rideTypeQuery.data?.length) {
      return rideTypeQuery.data.map((ride) => toRideOption(ride, t));
    }

    return getFallbackRideOptions(t).map((option) => ({
      ...option,
      title: fallbackTitleForId(String(option.id), t) || option.title,
    }));
  }, [rideTypeQuery.data, t]);

  useEffect(() => {
    if (!rideOptions.length) return;
    const exists = rideOptions.some((option) => option.id === selectedCategory);
    if (!exists) {
      setSelectedCategory(rideOptions[0].id);
    }
  }, [rideOptions, selectedCategory]);

  const cachedAddresses = useMemo<CachedAddress[]>(
    () => recentAddresses.map(toCachedAddress),
    [recentAddresses],
  );

  const handleSearchPress = useCallback(() => {
    navigation.navigate(
      'RideAddressSearch' as never,
      { rideType, rideCategory: selectedCategory } as never,
    );
  }, [navigation, rideType, selectedCategory]);

  const handleSelectCategory = useCallback((category: RideCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <RideOptionsLayout
      rideOptions={rideOptions}
      cachedAddresses={cachedAddresses}
      selectedCategory={selectedCategory}
      onSelectCategory={handleSelectCategory}
      onSearchPress={handleSearchPress}
      onBackPress={handleBackPress}
    />
  );
}
