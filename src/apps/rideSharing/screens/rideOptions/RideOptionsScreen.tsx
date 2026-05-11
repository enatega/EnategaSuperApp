import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { Pressable } from 'react-native';
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
import Sidebar, { type UserProfile } from '../../components/Sidebar';
import { useSidebarMenu } from '../../hooks/useSidebarMenu';
import { useProfile } from '../../hooks/useProfile';
import { resetToSharedHome } from '../../../../general/navigation/rootNavigation';
import PaymentMethodBottomSheet from '../../components/payment/PaymentMethodBottomSheet';
import type { PaymentMethodId } from '../../components/payment/paymentTypes';
import {
  getSavedRideEstimatePaymentMethod,
  saveRideEstimatePaymentMethod,
} from '../../storage/rideEstimatePaymentMethod';
import AppSwitcherTopBar from '../../../../general/components/appSwitch/AppSwitcherTopBar';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';

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

function normalizeRideOptionTitle(title: string) {
  return title.trim().toLowerCase().replace(/\s+/g, ' ');
}

function prioritizeRideOptionsForHeader(rideOptions: RideOptionItem[]) {
  if (rideOptions.length <= 2) {
    return rideOptions;
  }

  const premiumOption = rideOptions.find((option) => {
    const normalizedTitle = normalizeRideOptionTitle(option.title);
    return normalizedTitle.includes('premium');
  });

  const rideOption = rideOptions.find((option) => {
    const normalizedTitle = normalizeRideOptionTitle(option.title);
    return normalizedTitle === 'ride';
  });

  const prioritizedIds = new Set<string>();
  const prioritized: RideOptionItem[] = [];

  if (premiumOption) {
    prioritized.push(premiumOption);
    prioritizedIds.add(premiumOption.id);
  }

  if (rideOption && !prioritizedIds.has(rideOption.id)) {
    prioritized.push(rideOption);
    prioritizedIds.add(rideOption.id);
  }

  const remaining = rideOptions.filter((option) => !prioritizedIds.has(option.id));

  return [...prioritized, ...remaining];
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
  const { userProfile: apiProfile } = useProfile();
  const route = useRoute();
  const rideType = (route.params as RouteParams | undefined)?.rideType;
  const directCourierOnly = (route.params as RouteParams | undefined)?.directCourierOnly ?? false;
  const { recentAddresses } = useRecentRideAddresses();
  const [selectedCategory, setSelectedCategory] = useState<RideCategory | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<PaymentMethodId | null>(null);
  const [isPaymentMethodVisible, setIsPaymentMethodVisible] = useState(false);
  const {
    sidebarVisible,
    openSidebar,
    closeSidebar,
    menuItems,
    handleLogout,
    handleProfilePress,
  } = useSidebarMenu({
    onPaymentMethodsPress: () => {
      closeSidebar();
      setIsPaymentMethodVisible(true);
    },
  });

  const rideTypesQuery = useRideTypes({
    gcTime: 5 * 60 * 1000,
  });

  const rideOptions = useMemo<RideOptionItem[]>(
    () => (rideTypesQuery.data ?? []).map(toRideOption),
    [rideTypesQuery.data],
  );
  const visibleRideOptions = useMemo(() => {
    if (!directCourierOnly) {
      return prioritizeRideOptionsForHeader(rideOptions);
    }

    const courierOnlyOptions = rideOptions.filter((option) => option.title.toLowerCase().includes('courier'));
    const options = courierOnlyOptions.length ? courierOnlyOptions : rideOptions;
    return prioritizeRideOptionsForHeader(options);
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

  useEffect(() => {
    let isMounted = true;

    const hydratePaymentMethod = async () => {
      const savedPaymentMethodId = await getSavedRideEstimatePaymentMethod();
      if (!isMounted) {
        return;
      }

      setSelectedPaymentMethodId(savedPaymentMethodId);
    };

    void hydratePaymentMethod();

    return () => {
      isMounted = false;
    };
  }, []);

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
  const switcherActiveKey = resolvedRideType === 'courier' ? 'courier' : 'ride';
  const topRecentAddresses = useMemo(() => cachedAddresses.slice(0, 2), [cachedAddresses]);
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
      <AppSwitcherTopBar
        activeKey={switcherActiveKey}
        expandedContent={switcherActiveKey === 'ride' ? (
          <View style={[styles.rideTopView, { backgroundColor: colors.background }]}>
            <View style={styles.searchRow}>
              <Pressable
                onPress={openSidebar}
                style={[
                  styles.menuButton,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    shadowColor: colors.shadowColor,
                  },
                ]}
              >
                <Icon type="Feather" name="menu" size={18} color={colors.text} />
              </Pressable>

              <Pressable
                onPress={() => handleSearchPress()}
                style={[
                  styles.searchInput,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    shadowColor: colors.shadowColor,
                  },
                ]}
              >
                <Icon type="Feather" name="search" size={20} color={colors.iconMuted} />
                <Text style={[styles.searchText, { color: colors.mutedText }]}>{t('ride_search_placeholder')}</Text>
              </Pressable>
            </View>

            {topRecentAddresses.length > 0 ? (
              <View style={[styles.addressCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                {topRecentAddresses.map((address, index) => (
                  <Pressable
                    key={address.placeId}
                    onPress={() => handleSearchPress(address)}
                    style={[styles.addressRow, index > 0 ? [styles.addressRowDivider, { borderTopColor: colors.border }] : null]}
                  >
                    <Icon type="Feather" name="map-pin" size={18} color={colors.text} />
                    <View style={styles.addressTextWrap}>
                      <Text weight="semiBold" style={[styles.addressTitle, { color: colors.text }]} numberOfLines={1}>
                        {address.structuredFormatting.mainText}
                      </Text>
                      <Text style={[styles.addressSubtitle, { color: colors.mutedText }]} numberOfLines={1}>
                        {address.structuredFormatting.secondaryText ?? address.description}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}
      />
      <RideOptionsLayout
        rideOptions={visibleRideOptions}
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
        isDirectCourierFlow={directCourierOnly}
      />

      <Sidebar
        visible={sidebarVisible}
        onClose={closeSidebar}
        userProfile={userProfile}
        menuItems={menuItems}
        onLogout={handleLogout}
        onProfilePress={handleProfilePress}
      />

      <PaymentMethodBottomSheet
        visible={isPaymentMethodVisible}
        selectedPaymentMethodId={selectedPaymentMethodId}
        onClose={() => setIsPaymentMethodVisible(false)}
        onSelect={(paymentMethodId) => {
          setSelectedPaymentMethodId(paymentMethodId);
          void saveRideEstimatePaymentMethod(paymentMethodId);
          setIsPaymentMethodVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rideTopView: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    gap: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchText: {
    fontSize: 14,
    lineHeight: 22,
  },
  addressCard: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addressRowDivider: {
    borderTopWidth: 1,
  },
  addressTextWrap: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  addressSubtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  hamburger: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
});
