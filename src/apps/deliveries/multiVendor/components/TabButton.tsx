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
        isSelected ? styles.selectedButton : null,
        {
          backgroundColor: isSelected ? colors.primary : 'transparent',
        },
      ]}
      testID={testID}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 56,
    marginHorizontal: 4,
    marginVertical: 6,
    borderRadius: 18,
  },
  selectedButton: {
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
