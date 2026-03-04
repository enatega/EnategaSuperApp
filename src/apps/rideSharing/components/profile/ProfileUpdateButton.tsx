import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export default function ProfileUpdateButton({
  label,
  onPress,
  disabled = false,
  isLoading = false,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footer,
        {
          paddingBottom: Math.max(insets.bottom, 20),
          backgroundColor: colors.background,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || isLoading}
        style={[
          styles.updateButton,
          {
            backgroundColor: disabled || isLoading ? colors.border : colors.primary,
          },
        ]}
      >
        <Text
          variant="subtitle"
          weight="semiBold"
          color={disabled || isLoading ? colors.mutedText : '#FFFFFF'}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  updateButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
});
