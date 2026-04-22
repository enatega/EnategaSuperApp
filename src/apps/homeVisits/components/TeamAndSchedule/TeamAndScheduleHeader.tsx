import React, { memo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
  topInset: number;
  onBack: () => void;
  onClose: () => void;
};

function TeamAndScheduleHeader({
  onBack,
  onClose,
  title,
  topInset,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: colors.background,
          paddingTop: topInset + 12,
        },
      ]}
    >
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        onPress={onBack}
        style={[styles.iconButton, { backgroundColor: colors.backgroundTertiary }]}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>

      <Text
        weight="extraBold"
        style={{
          color: colors.text,
          flex: 1,
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.md,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>

      <Pressable
        accessibilityLabel="Close"
        accessibilityRole="button"
        onPress={onClose}
        style={[styles.iconButton, { backgroundColor: colors.backgroundTertiary }]}
      >
        <Ionicons name="close" size={24} color={colors.text} />
      </Pressable>
    </View>
  );
}

export default memo(TeamAndScheduleHeader);

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
