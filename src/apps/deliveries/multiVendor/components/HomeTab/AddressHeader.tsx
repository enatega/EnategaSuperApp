import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';
import { useTheme } from '../../../../../general/theme/theme';
import useAddress from '../../../hooks/useAddress';
import type { ProfileAddress } from '../../api/profileService';
import {
  createSelectedDeliveryAddress,
  formatDeliveryAddressLabel,
} from '../../../utils/address';

type Props = {
  cartCount?: number;
  addresses?: ProfileAddress[];
  onAddressPress?: () => void;
  onAddAddressPress?: () => void;
  onCartPress?: () => void;
};

export default function AddressHeader({
  cartCount = 0,
  addresses = [],
  onAddressPress,
  onAddAddressPress,
  onCartPress,
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
      {resolvedSelectedAddress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            resolvedSelectedAddressLabel ?? t('multi_vendor_address_label')
          }
          onPress={onAddressPress}
          style={({ pressed }) => [
            styles.addressButton,
            {
              backgroundColor: colors.surface,
              borderColor: 'rgba(17, 24, 39, 0.06)',
              shadowColor: colors.shadowColor,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
        >
          <Icon
            type="Ionicons"
            name="location-outline"
            size={18}
            color={colors.iconMuted}
          />
          <Text
            numberOfLines={1}
            weight="medium"
            style={[styles.addressText, {
              color: colors.text,
              fontSize: typography.size.md,
              lineHeight: typography.lineHeight.md,
            }]}
          >
            {resolvedSelectedAddressLabel ?? t('multi_vendor_address_label')}
          </Text>
          <Icon
            type="Ionicons"
            name="chevron-down"
            size={14}
            color={colors.mutedText}
          />
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('my_profile_add_address')}
          onPress={onAddAddressPress}
          style={({ pressed }) => [
            styles.addAddressButton,
            {
              backgroundColor: colors.surface,
              borderColor: 'rgba(17, 24, 39, 0.06)',
              shadowColor: colors.shadowColor,
              opacity: pressed ? 0.92 : 1,
            },
          ]}
        >
          <Icon
            type="Ionicons"
            name="add"
            size={18}
            color={colors.primary}
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

      <Pressable
        accessibilityLabel={t('multi_vendor_cart_label')}
        accessibilityRole="button"
        onPress={onCartPress}
        style={({ pressed }) => [
          styles.cartButton,
          {
            backgroundColor: colors.surface,
            borderColor: 'rgba(17, 24, 39, 0.06)',
            shadowColor: colors.shadowColor,
            opacity: pressed ? 0.92 : 1,
          },
        ]}
      >
        <Icon
          type="Ionicons"
          name="cart-outline"
          size={21}
          color={colors.text}
        />
        {cartCount > 0 ? (
          <View style={[styles.cartBadge, { backgroundColor: colors.primary }]}>
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
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  addAddressText: {
    flexShrink: 1,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  addressText: {
    flex: 1,
    letterSpacing: -0.1,
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
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cartButton: {
    alignItems: 'center',
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    position: 'relative',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
    width: 44,
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
});
