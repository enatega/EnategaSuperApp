import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { ThemeColors } from '../../../../general/theme/colors';

type Props = {
  backgroundColorToken: keyof ThemeColors;
  label: string;
};

export default function SupportConversationAvatar({ backgroundColorToken, label }: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.avatar, { backgroundColor: colors[backgroundColorToken] }]}>
      <Text
        color={colors.white}
        weight="bold"
        style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
});
