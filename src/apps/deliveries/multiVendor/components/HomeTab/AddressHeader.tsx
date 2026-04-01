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
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {resolvedSelectedAddress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            resolvedSelectedAddressLabel ?? t('multi_vendor_address_label')
          }
          onPress={onAddressPress}
          style={[
            styles.addressButton,
            {
              backgroundColor: colors.surfaceSoft,
              borderColor: colors.border,
            },
          ]}
        >
          <Icon
            type="Ionicons"
            name="location-outline"
            size={20}
            color={colors.text}
          />
          <Text
            numberOfLines={1}
            weight="medium"
            style={{
              flex: 1,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.xl,
            }}
          >
            {resolvedSelectedAddressLabel ?? t('multi_vendor_address_label')}
          </Text>
          <Icon
            type="Ionicons"
            name="chevron-down"
            size={18}
            color={colors.mutedText}
          />
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('my_profile_add_address')}
          onPress={onAddAddressPress}
          style={[
            styles.addAddressButton,
            {
              backgroundColor: colors.blue50,
              borderColor: colors.blue100,
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
              { color: colors.primary, fontSize: typography.size.xs2 },
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
        style={[styles.cartButton, { backgroundColor: colors.surfaceSoft }]}
      >
        <Icon
          type="Ionicons"
          name="cart-outline"
          size={22}
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
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addAddressText: {
    lineHeight: 18,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  addressButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  cartButton: {
    alignItems: 'center',
    borderRadius: 100,
    height: 40,
    justifyContent: 'center',
    position: 'relative',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    width: 40,
  },
  cartBadge: {
    alignItems: 'center',
    borderRadius: 10,
    minWidth: 18,
    paddingHorizontal: 4,
    position: 'absolute',
    right: -4,
    top: -2,
  },
});
