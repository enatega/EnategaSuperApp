import React, { memo, useMemo } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useAppointmentCart } from '../../hooks/useAppointmentCart';
import type { MultiVendorStackParamList } from '../../multiVendor/navigation/types';

type Props = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

function AppointmentsFloatingCartButton({ onPress, style }: Props) {
  const navigation = useNavigation<NavigationProp<MultiVendorStackParamList>>();
  const { colors, typography } = useTheme();
  const { items, storeId, storeTitle } = useAppointmentCart();

  const count = items.length;
  const countLabel = useMemo(
    () => (count > 99 ? '99+' : String(count)),
    [count],
  );

  if (count <= 0) {
    return null;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        if (onPress) {
          onPress();
          return;
        }

        if (!storeId) {
          return;
        }

        navigation.navigate('AppointmentCart', {
          storeId,
          title: storeTitle ?? '',
        });
      }}
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
      <Icon color={colors.white} name="cart-outline" size={24} />
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
    position: 'relative',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    width: 58,
    zIndex: 20,
  },
  iconHalo: {
    borderRadius: 999,
    height: 34,
    position: 'absolute',
    width: 34,
  },
});

export default memo(AppointmentsFloatingCartButton);
