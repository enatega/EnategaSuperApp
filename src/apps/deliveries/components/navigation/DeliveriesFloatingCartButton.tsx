import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import React, { memo, useMemo } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCartCount } from '../../hooks/useCart';
import type { DeliveriesStackParamList } from '../../navigation/types';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  style?: StyleProp<ViewStyle>;
};

function DeliveriesFloatingCartButton({ style }: Props) {
  const navigation = useNavigation<NavigationProp<DeliveriesStackParamList>>();
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const { data } = useCartCount();

  const totalItems = data?.totalItems ?? 0;
  const countLabel = useMemo(
    () => (totalItems > 99 ? '99+' : String(totalItems)),
    [totalItems],
  );

  if (totalItems <= 0) {
    return null;
  }

  return (
    <Pressable
      accessibilityLabel={t('cart_title')}
      accessibilityRole="button"
      onPress={() => navigation.navigate('Cart')}
      style={({ pressed }) => [
        styles.button,
        style,
        {
          backgroundColor: colors.primary,
          borderColor: colors.white,
          opacity: pressed ? 0.94 : 1,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View
        pointerEvents="none"
        style={[styles.iconHalo, { backgroundColor: 'rgba(255, 255, 255, 0.14)' }]}
      />
      <MaterialCommunityIcons
        color={colors.white}
        name="cart-outline"
        size={24}
      />
      <View
        style={[
          styles.badge,
          {
            backgroundColor: colors.surface,
            borderColor: colors.primary,
          },
        ]}
      >
        <Text
          color={colors.primary}
          style={{
            fontFamily: typography.fontFamily.semiBold,
            fontSize: typography.size.xs2,
            fontVariant: ['tabular-nums'],
            lineHeight: typography.lineHeight.xxs,
          }}
          weight="semiBold"
        >
          {countLabel}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 2,
    justifyContent: 'center',
    minWidth: 26,
    paddingHorizontal: 6,
    paddingVertical: 3,
    position: 'absolute',
    right: -3,
    top: -5,
  },
  button: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 2,
    elevation: 8,
    height: 58,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    width: 58,
  },
  iconHalo: {
    borderRadius: 999,
    height: 34,
    position: 'absolute',
    width: 34,
  },
});

export default memo(DeliveriesFloatingCartButton);
