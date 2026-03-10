import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  onAddressPress?: () => void;
  onCartPress?: () => void;
};

export default function AddressHeader({
  onAddressPress,
  onCartPress,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
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
            lineHeight: typography.lineHeight.xl,
          }}
        >
          {t('multi_vendor_address_label')}
        </Text>
        <Icon
          type="Ionicons"
          name="chevron-down"
          size={22}
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
          size={28}
          color={colors.text}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  addressButton: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  cartButton: {
    alignItems: 'center',
    borderRadius: 100,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
});
