import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import { mapIntentToCategory, RideCategory, RideIntent } from '../../utils/rideOptions';
import RideOptionsLayout from '../../components/rideOptions/RideOptionsLayout';
import { CachedAddress, RideOptionItem } from '../../components/rideOptions/types';
import { useRideTypes } from '../../hooks/useRideQueries';
import type { RideTypeCatalogItem } from '../../api/types';
import useRecentRideAddresses from '../../hooks/useRecentRideAddresses';
import { toCachedAddress } from '../../utils/rideAddress';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import HamburgerMenu from '../../components/HamburgerMenu';
import Sidebar, { type UserProfile } from '../../components/Sidebar';
import { useSidebarMenu } from '../../hooks/useSidebarMenu';
import { useProfile } from '../../hooks/useProfile';
import { resetToSharedHome } from '../../../../general/navigation/rootNavigation';
import { useActiveRideStore } from '../../stores/useActiveRideStore';
import { useActiveRideRequestStore } from '../../stores/useActiveRideRequestStore';

type RouteParams = {
  rideType?: RideIntent;
  directCourierOnly?: boolean;
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
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const { sidebarVisible, openSidebar, closeSidebar, menuItems, handleLogout, handleProfilePress } = useSidebarMenu();
  const { userProfile: apiProfile } = useProfile();
  const route = useRoute();
  const rideType = (route.params as RouteParams | undefined)?.rideType;
  const directCourierOnly = (route.params as RouteParams | undefined)?.directCourierOnly ?? false;
  const { recentAddresses } = useRecentRideAddresses();
  const activeRide = useActiveRideStore((state) => state.activeRide);
  const activeRideRequest = useActiveRideRequestStore((state) => state.activeRideRequest);
  const [selectedCategory, setSelectedCategory] = useState<RideCategory | null>(null);
  const enableNearbyDrivers = !activeRide && !activeRideRequest;

  const rideTypesQuery = useRideTypes({
    gcTime: 5 * 60 * 1000,
  });

  const rideOptions = useMemo<RideOptionItem[]>(
    () => (rideTypesQuery.data ?? []).map(toRideOption),
    [rideTypesQuery.data],
  );
  const visibleRideOptions = useMemo(() => {
    if (!directCourierOnly) {
      return rideOptions;
    }

    const courierOnlyOptions = rideOptions.filter((option) => option.title.toLowerCase().includes('courier'));
    return courierOnlyOptions.length ? courierOnlyOptions : rideOptions;
  }, [directCourierOnly, rideOptions]);
  const resolvedRideType = useMemo(
    () => resolveRideIntentFromSelection({
      rideOptions: visibleRideOptions,
      selectedCategory,
      routeRideType: rideType,
    }),
    [rideType, selectedCategory, visibleRideOptions],
  );

  useEffect(() => {
    if (!visibleRideOptions.length) {
      setSelectedCategory(null);
      return;
    }

    const exists = visibleRideOptions.some((option) => option.id === selectedCategory);

    if (!exists) {
      setSelectedCategory(resolveInitialRideTypeId(visibleRideOptions, rideType));
    }
  }, [rideType, selectedCategory, visibleRideOptions]);

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
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    resetToSharedHome();
  }, [navigation]);

  const rideTypesErrorMessage = rideTypesQuery.error?.message || null;
  const userProfile = useMemo<UserProfile | undefined>(() => {
    if (!apiProfile) return undefined;

    return {
      name: apiProfile.name,
      email: apiProfile.email,
      avatarUri: apiProfile.profilePhotoUri,
    };
  }, [apiProfile]);

  return (
    <View style={styles.container}>
      <RideOptionsLayout
        rideOptions={visibleRideOptions}
        cachedAddresses={cachedAddresses}
        enableNearbyDrivers={enableNearbyDrivers}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onSearchPress={handleSearchPress}
        onBackPress={handleBackPress}
        isLoadingRideTypes={rideTypesQuery.isPending}
        rideTypesErrorMessage={rideTypesErrorMessage ? `${t('ride_types_error_description')} ${rideTypesErrorMessage}` : null}
        onRetryRideTypes={() => {
          void rideTypesQuery.refetch();
        }}
        isDirectCourierFlow={directCourierOnly}
      />

      <HamburgerMenu
        onPress={openSidebar}
        style={{
          ...styles.hamburger,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        }}
      />

      <Sidebar
        visible={sidebarVisible}
        onClose={closeSidebar}
        userProfile={userProfile}
        menuItems={menuItems}
        onLogout={handleLogout}
        onProfilePress={handleProfilePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hamburger: {
    position: 'absolute',
    right: 16,
    top: 65,
    zIndex: 10,
    borderWidth: 1,
    borderRadius: 12,
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
