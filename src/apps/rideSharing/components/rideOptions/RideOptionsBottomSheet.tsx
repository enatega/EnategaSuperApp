import React, { memo } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../general/theme/theme';
import BottomSheetHandle from '../../../../general/components/BottomSheetHandle';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';
import MapCurrentLocationButton from '../../../../general/components/MapCurrentLocationButton';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { Pressable } from 'react-native';
import { RideCategory } from '../../utils/rideOptions';
import { CachedAddress, RideOptionItem } from './types';
import RideOptionsHeader from './RideOptionsHeader';
import RideOptionsBottomSheetSkeleton from './RideOptionsBottomSheetSkeleton';
import RideOptionsBottomSheetError from './RideOptionsBottomSheetError';
import { useRideForYouRestaurants } from '../../screens/findingRide/hooks/useRideForYouRestaurants';
import FindingRideForYouCard from '../../screens/findingRide/components/FindingRideForYouCard';
import type { SharedStackParamList } from '../../../../general/navigation/navigationTypes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DeliveryNearbyStore } from '../../../deliveries/api/types';

type Props = {
  rideOptions: RideOptionItem[];
  cachedAddresses: CachedAddress[];
  selectedCategory: RideCategory | null;
  onSelectCategory: (category: RideCategory) => void;
  onBackPress: () => void;
  onSearchPress: (address?: CachedAddress) => void;
  onLocatePress: () => void;
  isLocating?: boolean;
  isLoadingRideTypes?: boolean;
  rideTypesErrorMessage?: string | null;
  onRetryRideTypes?: () => void;
  onHeightChange?: (height: number) => void;
  isDirectCourierFlow?: boolean;
};

function RideOptionsBottomSheet({
  rideOptions,
  cachedAddresses,
  selectedCategory,
  onSelectCategory,
  onBackPress,
  onSearchPress,
  onLocatePress,
  isLocating = false,
  isLoadingRideTypes = false,
  rideTypesErrorMessage = null,
  onRetryRideTypes,
  onHeightChange,
  isDirectCourierFlow = false,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation<NativeStackNavigationProp<SharedStackParamList>>();
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const expandedHeight = isDirectCourierFlow
    ? Math.min(screenHeight * 0.8, screenHeight - 32)
    : Math.min(screenHeight * 0.6, 520);
  const defaultHeight = isDirectCourierFlow
    ? expandedHeight
    : undefined;
  const collapsedHeight = 150;
  const showErrorState = Boolean(rideTypesErrorMessage) && !isLoadingRideTypes;
  const searchDisabled = !selectedCategory || isLoadingRideTypes || showErrorState;
  const forYouQuery = useRideForYouRestaurants();

  const handlePressRecommendedStore = (store: DeliveryNearbyStore) => {
    navigation.navigate('Deliveries', {
      screen: 'MultiVendor',
      params: {
        screen: 'StoreDetails',
        params: { store },
      },
    });
  };

  return (
    <SwipeableBottomSheet
      expandedHeight={expandedHeight}
      defaultHeight={defaultHeight}
      collapsedHeight={collapsedHeight + insets.bottom}
      floatingAccessory={(
        <View style={styles.floatingAccessoryContent}>
          <Pressable
            onPress={onBackPress}
            style={[
              styles.backButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.shadowColor,
              },
            ]}
          >
            <Icon type="Ionicons" name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <MapCurrentLocationButton
            onPress={onLocatePress}
            isLoading={isLocating}
            style={styles.locateIconOnlyButton}
          />
        </View>
      )}
      floatingAccessoryStyle={styles.locateFloatingButton}
      style={[
        styles.sheet,
        {
          backgroundColor: colors.surface,
          paddingBottom: insets.bottom + 20,
          shadowColor: colors.shadowColor,
        },
      ]}
      handle={<BottomSheetHandle color={colors.border} />}
      onHeightChange={onHeightChange}
    >
      {isLoadingRideTypes ? (
        <RideOptionsBottomSheetSkeleton />
      ) : showErrorState ? (
        <RideOptionsBottomSheetError
          message={rideTypesErrorMessage}
          onRetry={onRetryRideTypes}
        />
      ) : (
        <ScrollView style={styles.sheetContent} contentContainerStyle={styles.sheetContentContainer}>
          <View>
            <RideOptionsHeader
              rideOptions={rideOptions}
              selectedCategory={selectedCategory}
              onSelectCategory={onSelectCategory}
              onSearchPress={onSearchPress}
              searchDisabled={searchDisabled}
              hideOptionsRow={isDirectCourierFlow}
            />
          </View>

          <View style={styles.forYouSection}>
            <Text weight="extraBold" style={[styles.forYouTitle, { color: colors.text }]}>
              {t('ride_finding_for_you_title')}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.forYouRow}
            >
              {(forYouQuery.data ?? []).map((restaurant) => (
                <FindingRideForYouCard
                  key={restaurant.storeId}
                  item={restaurant}
                  onPress={() => handlePressRecommendedStore(restaurant as DeliveryNearbyStore)}
                />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </SwipeableBottomSheet>
  );
}

export default memo(RideOptionsBottomSheet);

const styles = StyleSheet.create({
  sheet: {
    paddingTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 999,
  },
  sheetContent: {
    flex: 1,
  },
  sheetContentContainer: {
    paddingBottom: 12,
  },
  forYouSection: {
    marginTop: 6,
    gap: 10,
  },
  forYouTitle: {
    fontSize: 22,
    lineHeight: 38,
    letterSpacing: -0.48,
    paddingHorizontal: 16,
  },
  forYouRow: {
    paddingHorizontal: 16,
    gap: 10,
  },
  locateFloatingButton: {
    left: 16,
    right: 16,
    top: -54,
  },
  floatingAccessoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  locateIconOnlyButton: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
