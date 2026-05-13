import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Icon from '../Icon';
import BottomSheetHandle from '../BottomSheetHandle';
import SwipeableBottomSheet from '../SwipeableBottomSheet';
import Text from '../Text';
import { useTheme } from '../../theme/theme';
import type { ProfileAddress } from '../../api/profileService';
import {
  formatDeliveryAddressLabel,
  getSelectedSavedAddressId,
} from '../../utils/address';
import {
  getLocationPermissionState,
  openAppLocationSettings,
  requestLocationPermission,
} from '../../utils/locationPermission';
import {
  getSavedAddressIcon,
  getSavedAddressTypeLabel,
} from '../../utils/savedAddressPresentation';
import SavedAddressSelectionRow from './SavedAddressSelectionRow';
import HomeLocationPermissionPopup, {
  LocationPopupMode,
} from '../../../screens/home/HomeLocationPermissionPopup';

type Props = {
  addresses: ProfileAddress[];
  isLoading?: boolean;
  isVisible: boolean;
  onAddAddress: () => void;
  onClose: () => void;
  onSelectAddress: (address: ProfileAddress) => void;
  onUseCurrentLocation: () => void;
  selectingAddressId?: string | null;
  selectedAddressId?: string;
};

const BASE_CONTENT_HEIGHT = 180;
const ADDRESS_ROW_ESTIMATE = 68;
const MAX_VISIBLE_ADDRESS_ROWS = 4;

export default function AddressSelectionBottomSheet({
  addresses,
  isLoading = false,
  isVisible,
  onAddAddress,
  onClose,
  onSelectAddress,
  onUseCurrentLocation,
  selectingAddressId,
  selectedAddressId,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('general');
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSelectionPending = Boolean(selectingAddressId);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [isLocationPopupVisible, setIsLocationPopupVisible] = useState(false);
  const [locationPopupMode, setLocationPopupMode] =
    useState<LocationPopupMode>('request');
  const resolvedSelectedAddressId =
    getSelectedSavedAddressId(addresses) ?? selectedAddressId;

  const expandedHeight = useMemo(() => {
    const estimatedContentHeight =
      BASE_CONTENT_HEIGHT +
      Math.min(addresses.length, MAX_VISIBLE_ADDRESS_ROWS) *
        ADDRESS_ROW_ESTIMATE +
      Math.max(insets.bottom, 16);

    return Math.min(height * 0.75, Math.max(280, estimatedContentHeight));
  }, [addresses.length, height, insets.bottom]);

  const handleUseCurrentLocationPress = useCallback(async () => {
    if (isSelectionPending || isRequestingLocation) {
      return;
    }

    setIsRequestingLocation(true);

    try {
      const currentPermission = await getLocationPermissionState();

      if (currentPermission.granted) {
        onUseCurrentLocation();
        return;
      }

      if (currentPermission.blocked) {
        setLocationPopupMode('blocked');
        setIsLocationPopupVisible(true);
        return;
      }

      const requestedPermission =
        currentPermission.canAskAgain
          ? await requestLocationPermission()
          : currentPermission;

      if (requestedPermission.granted) {
        onUseCurrentLocation();
        return;
      }

      setLocationPopupMode(requestedPermission.blocked ? 'blocked' : 'denied');
      setIsLocationPopupVisible(true);
    } catch {
      setLocationPopupMode('denied');
      setIsLocationPopupVisible(true);
    } finally {
      setIsRequestingLocation(false);
    }
  }, [isRequestingLocation, isSelectionPending, onUseCurrentLocation]);

  const handlePopupRequestLocation = useCallback(async () => {
    if (isRequestingLocation) {
      return;
    }

    setIsRequestingLocation(true);

    try {
      const permission = await requestLocationPermission();

      if (permission.granted) {
        setIsLocationPopupVisible(false);
        onUseCurrentLocation();
        return;
      }

      setLocationPopupMode(permission.blocked ? 'blocked' : 'denied');
      setIsLocationPopupVisible(true);
    } catch {
      setLocationPopupMode('denied');
      setIsLocationPopupVisible(true);
    } finally {
      setIsRequestingLocation(false);
    }
  }, [isRequestingLocation, onUseCurrentLocation]);

  const handlePopupOpenSettings = useCallback(async () => {
    try {
      await openAppLocationSettings();
    } catch {
      setLocationPopupMode('blocked');
      setIsLocationPopupVisible(true);
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Pressable
        onPress={onClose}
        style={[styles.backdrop, { backgroundColor: colors.overlayDark20 }]}
      />

      <SwipeableBottomSheet
        collapsedHeight={0}
        expandedHeight={expandedHeight}
        handle={<BottomSheetHandle color={colors.border} variant="hidden" />}
        initialState="expanded"
        modal
        onCollapsed={onClose}
        style={[
          styles.sheet,
          {
            backgroundColor: colors.background,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerSpacer} />

          <Text
            weight="extraBold"
            style={{
              fontSize: typography.size.h5,
              lineHeight: typography.lineHeight.h5,
            }}
          >
            {t('address_selector_title')}
          </Text>

          <Pressable
            accessibilityLabel={t('address_selector_close')}
            accessibilityRole="button"
            hitSlop={12}
            onPress={onClose}
            style={({ pressed }) => [
              styles.closeButton,
              {
                backgroundColor: colors.backgroundTertiary,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Icon
              color={colors.text}
              name="close"
              size={18}
              type="Ionicons"
            />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, 16) + 12 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            accessibilityLabel={t('address_selector_use_current_location')}
            accessibilityRole="button"
            disabled={isSelectionPending || isRequestingLocation}
            onPress={() => {
              void handleUseCurrentLocationPress();
            }}
            style={({ pressed }) => [
              styles.currentLocationRow,
              {
                backgroundColor: pressed ? colors.gray100 : 'transparent',
                opacity: isSelectionPending || isRequestingLocation ? 0.55 : 1,
              },
            ]}
          >
            {isRequestingLocation ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <Icon
                color={colors.text}
                name="map-outline"
                size={20}
                type="Ionicons"
              />
            )}
            <Text
              weight="medium"
              style={{
                fontSize: typography.size.md,
                lineHeight: typography.lineHeight.md,
              }}
            >
              {t('address_selector_use_current_location')}
            </Text>
          </Pressable>

          {isLoading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color={colors.primary} size="small" />
            </View>
          ) : null}

          <View style={styles.addressList}>
            {addresses.map((address) => {
              return (
                <SavedAddressSelectionRow
                  key={address.id}
                  address={formatDeliveryAddressLabel({
                    address: address.address,
                    locationName: address.location_name,
                  })}
                  iconName={getSavedAddressIcon(address.type)}
                  isDisabled={isSelectionPending}
                  isSelected={resolvedSelectedAddressId === address.id}
                  isSelecting={selectingAddressId === address.id}
                  onPress={() => onSelectAddress(address)}
                  typeLabel={getSavedAddressTypeLabel(address.type, t)}
                />
              );
            })}

            <Pressable
              accessibilityLabel={t('address_selector_add_new')}
              accessibilityRole="button"
              disabled={isSelectionPending}
              onPress={onAddAddress}
              style={({ pressed }) => [
                styles.addAddressButton,
                {
                  opacity: isSelectionPending ? 0.55 : pressed ? 0.85 : 1,
                },
              ]}
            >
              <Icon
                color={colors.mutedText}
                name="add"
                size={20}
                type="Ionicons"
              />
              <Text
                weight="medium"
                style={{
                  color: colors.text,
                  fontSize: typography.size.sm2,
                  letterSpacing: 0,
                  lineHeight: typography.lineHeight.md,
                }}
              >
                {t('address_selector_add_new')}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SwipeableBottomSheet>

      <HomeLocationPermissionPopup
        visible={isLocationPopupVisible}
        mode={locationPopupMode}
        isLoading={isRequestingLocation}
        onRequestLocation={() => {
          void handlePopupRequestLocation();
        }}
        onOpenSettings={() => {
          void handlePopupOpenSettings();
        }}
        onDismiss={() => {
          setIsLocationPopupVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addAddressButton: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addressList: {
    gap: 4,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    position: 'relative',
    width: 32,
    zIndex: 8,
    elevation: 8,
  },
  content: {
    gap: 8,
    paddingHorizontal: 16,
  },
  currentLocationRow: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    paddingHorizontal: 16,
    position: 'relative',
    zIndex: 8,
    elevation: 8,
  },
  headerSpacer: {
    height: 32,
    width: 32,
  },
  loadingState: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    paddingTop: 4,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
});
