import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Icon from '../../../../general/components/Icon';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  icon: string;
  label: string;
  onPress: () => void;
  iconType?: React.ComponentProps<typeof Icon>['type'];
  iconColor?: string;
};

export default function AppointmentDetailsCircleButton({
  icon,
  iconType = 'Ionicons',
  iconColor,
  label,
  onPress,
}: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <Icon
        color={iconColor ?? colors.text}
        name={icon}
        size={20}
        type={iconType}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 21,
    elevation: 4,
    height: 42,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 10,
    width: 42,
  },
});
