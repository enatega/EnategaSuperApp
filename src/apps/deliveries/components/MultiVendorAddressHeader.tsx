import React, { type ReactNode, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Text from '../../../general/components/Text';
import Icon from '../../../general/components/Icon';
import { useTheme } from '../../../general/theme/theme';
import useAddress from '../../../general/hooks/useAddress';
import type { ProfileAddress } from '../../../general/api/profileService';
import {
  createSelectedDeliveryAddress,
  formatDeliveryAddressLabel,
} from '../../../general/utils/address';

type Props = {
  addresses?: ProfileAddress[];
  addressVariant?: 'button' | 'label';
  includeTopInset?: boolean;
  cartCount?: number;
  onAddAddressPress?: () => void;
  onAddressPress?: () => void;
  onCartPress?: () => void;
  rightAccessory?: ReactNode;
  showCartButton?: boolean;
};

export default function MultiVendorAddressHeader({
  addresses = [],
  addressVariant = 'button',
  includeTopInset = true,
  cartCount = 0,
  onAddAddressPress,
  onAddressPress,
  onCartPress,
  rightAccessory,
  showCartButton = true,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const { selectedAddress, selectedAddressLabel } = useAddress();
  const apiSelectedAddress = useMemo(
    () => createSelectedDeliveryAddress(addresses),
    [addresses],
  );
  const resolvedSelectedAddress =
    selectedAddress?.id === 'current-location'
      ? selectedAddress
      : selectedAddress ?? apiSelectedAddress;
  const resolvedSelectedAddressLabel = (() => {
    if (resolvedSelectedAddress?.id === 'current-location') {
      return (
        formatDeliveryAddressLabel(resolvedSelectedAddress) ||
        resolvedSelectedAddress.address?.trim() ||
        resolvedSelectedAddress.locationName?.trim() ||
        selectedAddressLabel
      );
    }

    return (
      formatDeliveryAddressLabel(resolvedSelectedAddress) ??
      selectedAddressLabel
    );
  })();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: includeTopInset ? insets.top + 4 : 0 },
      ]}
    >
      {resolvedSelectedAddress && addressVariant === 'label' ? (
        <Pressable
          accessibilityLabel={
            resolvedSelectedAddressLabel ?? t('multi_vendor_address_label')
          }
          accessibilityRole="button"
          disabled={!onAddressPress}
          onPress={onAddressPress}
          style={({ pressed }) => [
            styles.addressLabelContainer,
            {
              opacity: onAddressPress && pressed ? 0.72 : 1,
            },
          ]}
        >
          <Text
            numberOfLines={1}
            weight="medium"
            style={[
              styles.addressLabelText,
              {
                color: colors.text,
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.md,
              },
            ]}
          >
            {resolvedSelectedAddressLabel ?? t('multi_vendor_address_label')}
          </Text>
        </Pressable>
      ) : resolvedSelectedAddress ? (
        <Pressable
          accessibilityLabel={
            resolvedSelectedAddressLabel ?? t('multi_vendor_address_label')
          }
          accessibilityRole="button"
          onPress={onAddressPress}
          style={({ pressed }) => [
            styles.addressButton,
            {
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              opacity: pressed ? 0.92 : 1,
            },
          ]}
        >
          {/* <Icon
            color={colors.iconMuted}
            name="location-outline"
            size={19}
            type="Ionicons"
          /> */}
          <Text
            numberOfLines={1}
            weight="medium"
            style={[
              styles.addressText,
              {
                color: colors.text,
                fontSize: typography.size.md,
                lineHeight: typography.lineHeight.md,
              },
            ]}
          >
            {resolvedSelectedAddressLabel ?? t('multi_vendor_address_label')}
          </Text>
          <Icon
            color={colors.mutedText}
            name="chevron-down"
            size={18}
            type="Ionicons"
          />
        </Pressable>
      ) : (
        <Pressable
          accessibilityLabel={t('my_profile_add_address')}
          accessibilityRole="button"
          onPress={onAddAddressPress}
          style={({ pressed }) => [
            styles.addAddressButton,
            {
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              opacity: pressed ? 0.92 : 1,
            },
          ]}
        >
          <Icon
            color={colors.primary}
            name="add"
            size={18}
            type="Ionicons"
          />
          <Text
            numberOfLines={1}
            weight="semiBold"
            style={[
              styles.addAddressText,
              {
                color: colors.primary,
                fontSize: typography.size.md,
                lineHeight: typography.lineHeight.md,
              },
            ]}
          >
            {t('my_profile_add_address')}
          </Text>
        </Pressable>
      )}

      {rightAccessory ??
        (showCartButton ? (
          <Pressable
            accessibilityLabel={t('multi_vendor_cart_label')}
            accessibilityRole="button"
            onPress={onCartPress}
            style={({ pressed }) => [
              styles.cartButton,
              {
                backgroundColor: colors.findingRideSweepEdge,
                borderColor: colors.border,
                opacity: pressed ? 0.92 : 1,
                shadowColor: colors.shadowColor,
              },
            ]}
          >
            <Icon
              color={colors.text}
              name="cart-outline"
              size={21}
              type="Ionicons"
            />
            {cartCount > 0 ? (
              <View
                style={[styles.cartBadge, { backgroundColor: colors.primary }]}
              >
                <Text
                  color={colors.white}
                  weight="semiBold"
                  style={{
                    fontSize: 11,
                    lineHeight: 12,
                  }}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        ) : null)}
    </View>
  );
}

const styles = StyleSheet.create({
  addAddressButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    height: 40,
    paddingHorizontal: 0,
  },
  addAddressText: {
    flexShrink: 1,
  },
  addressLabelContainer: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingRight: 12,
    paddingVertical: 10,
  },
  addressLabelText: {
    flexShrink: 1,
    letterSpacing: 0,
  },
  addressButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    height: 40,
    paddingHorizontal: 0,
  },
  addressText: {
    flex: 1,
    letterSpacing: -0.1,
  },
  cartBadge: {
    alignItems: 'center',
    borderRadius: 10,
    height: 18,
    justifyContent: 'center',
    minWidth: 18,
    paddingHorizontal: 4,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  cartButton: {
    alignItems: 'center',
    borderRadius: 20,
    // borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    position: 'relative',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    width: 40,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
