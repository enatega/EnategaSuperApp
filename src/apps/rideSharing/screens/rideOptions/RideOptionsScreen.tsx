import React, { useCallback, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { mapIntentToCategory, RideCategory, RideIntent } from '../../utils/rideOptions';
import RideOptionsLayout from '../../components/rideOptions/RideOptionsLayout';
import { RecentLocation, RideOptionItem } from '../../components/rideOptions/types';

const rideIcon = 'https://www.figma.com/api/mcp/asset/06c62618-d47d-4594-aa0c-3e1886f000ba';
const womenRideIcon = 'https://www.figma.com/api/mcp/asset/3a734633-3d43-45c8-ae5c-b469d8a82f2f';
const premiumIcon = 'https://www.figma.com/api/mcp/asset/656d5875-dd51-4403-9fd7-a895e4f8668c';
const courierIcon = 'https://www.figma.com/api/mcp/asset/70ff6ddc-ce4a-4886-931c-382d1603fa9e';

type RouteParams = {
  rideType?: RideIntent;
};

export default function RideOptionsScreen() {
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation();
  const route = useRoute();
  const rideType = (route.params as RouteParams | undefined)?.rideType;
  const [selectedCategory, setSelectedCategory] = useState<RideCategory>(
    mapIntentToCategory(rideType),
  );

  const rideOptions = useMemo<RideOptionItem[]>(
    () => [
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
    ],
    [t],
  );

  const recentLocations = useMemo<RecentLocation[]>(
    () => [
      {
        id: 'loc-1',
        title: '596 Powlowski Port',
        subtitle: '769 Lincoln Road',
      },
      {
        id: 'loc-2',
        title: '3938 Soledad Shore',
        subtitle: '21318 Baron Center',
      },
      {
        id: 'loc-3',
        title: '3938 Troy Hills',
        subtitle: '693 Walter Ferry',
      },
    ],
    [],
  );

  const handleSearchPress = useCallback(() => {
    navigation.navigate('RideDetails' as never,{ rideType, rideCategory: selectedCategory } as never);
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
      recentLocations={recentLocations}
      selectedCategory={selectedCategory}
      onSelectCategory={handleSelectCategory}
      onSearchPress={handleSearchPress}
      onBackPress={handleBackPress}
    />
  );
}
