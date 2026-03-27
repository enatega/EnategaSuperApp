import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../../general/theme/theme';
import Icon from '../../../../../general/components/Icon';

type Props = {
  accessibilityLabel: string;
  iconName: string;
  iconType?: 'Ionicons' | 'Feather' | 'MaterialIcons';
  onPress?: () => void;
};

export default function StoreDetailActionButton({
  accessibilityLabel,
  iconName,
  iconType = 'Ionicons',
  onPress,
}: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={10}
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
    >
      <View
        style={[
          styles.button,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <Icon color={colors.text} name={iconName} size={22} type={iconType} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 20,
  },
  pressed: {
    opacity: 0.8,
  },
  button: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    width: 40,
  },
});
