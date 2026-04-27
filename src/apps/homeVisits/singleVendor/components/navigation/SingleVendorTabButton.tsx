import React from 'react';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../../general/theme/theme';

type Props = BottomTabBarButtonProps;

export default function SingleVendorTabButton({
  accessibilityLabel,
  accessibilityState,
  children,
  onLongPress,
  onPress,
  testID,
}: Props) {
  const { colors } = useTheme();
  const isSelected = accessibilityState?.selected ?? false;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="tab"
      accessibilityState={accessibilityState}
      onLongPress={onLongPress}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: colors.surface,
        },
      ]}
      testID={testID}
    >
      <View
        style={[
          styles.indicator,
          {
            backgroundColor: isSelected ? colors.primary : 'transparent',
          },
        ]}
      />
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 72,
  },
  indicator: {
    alignSelf: 'stretch',
    height: 2,
    marginBottom: 6,
  },
});
