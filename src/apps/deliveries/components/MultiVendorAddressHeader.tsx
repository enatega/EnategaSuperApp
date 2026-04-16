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
  const resolvedSelectedAddress = apiSelectedAddress ?? selectedAddress;
  const resolvedSelectedAddressLabel =
    formatDeliveryAddressLabel(resolvedSelectedAddress) ??
    selectedAddressLabel;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
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
              backgroundColor: colors.surface,
              borderColor: 'rgba(17, 24, 39, 0.06)',
              opacity: pressed ? 0.92 : 1,
              shadowColor: colors.shadowColor,
            },
          ]}
        >
          <Icon
            color={colors.iconMuted}
            name="location-outline"
            size={18}
            type="Ionicons"
          />
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
            size={14}
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
              backgroundColor: colors.surface,
              borderColor: 'rgba(17, 24, 39, 0.06)',
              opacity: pressed ? 0.92 : 1,
              shadowColor: colors.shadowColor,
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
                backgroundColor: colors.surface,
                borderColor: 'rgba(17, 24, 39, 0.06)',
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
                    fontSize: typography.size.xxs,
                    lineHeight: typography.lineHeight.xxs,
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
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
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
    borderRadius: 22,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  addressText: {
    flex: 1,
    letterSpacing: -0.1,
  },
  cartBadge: {
    alignItems: 'center',
    borderRadius: 9,
    minWidth: 18,
    paddingHorizontal: 4,
    paddingVertical: 1,
    position: 'absolute',
    right: -3,
    top: -3,
  },
  cartButton: {
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    position: 'relative',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
    width: 44,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});
