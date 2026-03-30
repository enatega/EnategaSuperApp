import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';
import { useTheme } from '../../../../../general/theme/theme';
import useAddress from '../../../hooks/useAddress';

type Props = {
  onAddressPress?: () => void;
  onAddAddressPress?: () => void;
  onCartPress?: () => void;
};

export default function AddressHeader({
  onAddressPress,
  onAddAddressPress,
  onCartPress,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const { selectedAddress, selectedAddressLabel } = useAddress();

  useEffect(() => {
    if (!selectedAddress) {
      return;
    }

    console.log('selected_delivery_address_coordinates', {
      latitude: selectedAddress.latitude,
      longitude: selectedAddress.longitude,
    });
  }, [selectedAddress?.latitude, selectedAddress?.longitude]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {selectedAddress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            selectedAddressLabel ?? t('multi_vendor_address_label')
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
            {selectedAddressLabel ?? t('multi_vendor_address_label')}
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
          size={28}
          color={colors.text}
        />
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
    gap: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  addressButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  cartButton: {
    alignItems: 'center',
    borderRadius: 100,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
});
