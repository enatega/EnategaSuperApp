import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  label: string;
  description?: string;
  onPress?: () => void;
};

export default function SupportFaqListItem({ label, description, onPress }: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.container,
        { borderBottomColor: colors.border },
        { opacity: pressed ? 0.72 : 1 },
      ]}
    >
      <View style={styles.textWrap}>
        <Text
          color={colors.text}
          weight="medium"
          style={{ fontSize: typography.size.md2, lineHeight: typography.lineHeight.md2 }}
        >
          {label}
        </Text>
        {description ? (
          <Text
            color={colors.mutedText}
            style={[styles.description, { fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }]}
          >
            {description}
          </Text>
        ) : null}
      </View>

      <Ionicons name="chevron-forward" size={26} color={colors.iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    minHeight: 56,
    paddingVertical: 12,
  },
  description: {
    marginTop: 2,
  },
  textWrap: {
    flex: 1,
  },
});
