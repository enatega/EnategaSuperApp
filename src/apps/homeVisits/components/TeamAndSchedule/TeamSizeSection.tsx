import React, { memo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
  helperText: string;
  selectedTeamSize: number;
  onSelectTeamSize: (size: number) => void;
  onOpenCustom: () => void;
};

function TeamSizeSection({
  helperText,
  onOpenCustom,
  onSelectTeamSize,
  selectedTeamSize,
  title,
}: Props) {
  const { colors, typography } = useTheme();
  const options = [1, 2, 3, 4, 5];

  return (
    <View style={styles.section}>
      <Text
        weight="extraBold"
        style={{
          color: colors.text,
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {title}
      </Text>
      <Text
        weight="medium"
        style={{
          color: colors.iconMuted,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {helperText}
      </Text>

      <View style={styles.row}>
        {options.map((size) => {
          const isSelected = size === selectedTeamSize;

          return (
            <Pressable
              key={size}
              onPress={() => onSelectTeamSize(size)}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected ? colors.backgroundTertiary : colors.background,
                  borderColor: isSelected ? colors.backgroundTertiary : colors.border,
                },
              ]}
            >
              {isSelected ? (
                <Ionicons name="checkmark" size={14} color={colors.text} />
              ) : null}
              <Text
                weight="medium"
                style={{
                  color: colors.text,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                }}
              >
                {String(size)}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={onOpenCustom}
          style={[
            styles.option,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
              paddingHorizontal: 10,
            },
          ]}
        >
          <Ionicons name="add" size={14} color={colors.text} />
          <Text
            weight="medium"
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            Custom
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default memo(TeamSizeSection);

const styles = StyleSheet.create({
  option: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    height: 32,
    justifyContent: 'center',
    minWidth: 44,
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  section: {
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
