import React, { memo } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
  optionalLabel: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
};

function ReviewNotesSection({
  onChangeText,
  optionalLabel,
  placeholder,
  title,
  value,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.titleRow}>
        <Text
          weight="bold"
          style={{
            color: colors.text,
            fontSize: typography.size.lg,
            lineHeight: typography.lineHeight.lg,
          }}
        >
          {title}
        </Text>
        <View style={[styles.badge, { borderColor: colors.border }]}>
          <Text
            weight="medium"
            style={{
              color: colors.iconMuted,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            {optionalLabel}
          </Text>
        </View>
      </View>

      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.iconMuted}
        style={[
          styles.input,
          {
            borderColor: colors.border,
            color: colors.text,
            fontSize: typography.size.md,
            lineHeight: typography.lineHeight.md,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

export default memo(ReviewNotesSection);

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  input: {
    borderRadius: 6,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  section: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});
