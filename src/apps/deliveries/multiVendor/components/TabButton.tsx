import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../../../general/theme/theme';

type Props = BottomTabBarButtonProps;

export default function MultiVendorTabButton({
  accessibilityState,
  children,
  onPress,
  onLongPress,
  testID,
  accessibilityLabel,
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
          backgroundColor: isSelected ? colors.blue100 : colors.surface,
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
  },
  indicator: {
    alignSelf: 'stretch',
    height: 1,
    marginBottom: 10,
  },
});
