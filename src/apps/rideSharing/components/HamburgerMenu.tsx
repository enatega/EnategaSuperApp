import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Icon from '../../../general/components/Icon';
import { useTheme } from '../../../general/theme/theme';

type Props = {
  onPress?: () => void;
  size?: number;
  color?: string;
  style?: ViewStyle;
};

export default function HamburgerMenu({
  onPress,
  size = 28,
  color,
  style,
}: Props) {
  const { colors } = useTheme();
  const iconColor = color || colors.text;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed ? colors.cardSoft : 'transparent',
        },
        style,
      ]}
    >
      <Icon
        type="Ionicons"
        name="menu"
        size={size}
        color={iconColor}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
