import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  cartCount?: number;
  onAddressPress?: () => void;
  onCartPress?: () => void;
};

export default function AddressHeader({
  cartCount = 0,
  onAddressPress,
  onCartPress,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('multi_vendor_address_label')}
        onPress={onAddressPress}
        style={styles.addressButton}
      >
        <Text
          numberOfLines={1}
          weight="medium"
          style={{
            flex: 1,
            fontSize: typography.size.sm2,
            lineHeight: 22,
          }}
        >
          {t('multi_vendor_address_label')}
        </Text>
        <Icon
          type="Ionicons"
          name="chevron-down"
          size={20}
          color={colors.text}
        />
      </Pressable>

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
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  addressButton: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 6,
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
