import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { GenericFilterChip } from './types';

type Props = {
  chips: GenericFilterChip[];
  onRemoveChip: (chip: GenericFilterChip) => void;
  clearAllLabel: string;
  onClearAll: () => void;
};

export default function SelectedFilterChips({
  chips,
  onRemoveChip,
  clearAllLabel,
  onClearAll,
}: Props) {
  const { colors, typography } = useTheme();

  if (chips.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContent}
      >
        {chips.map((chip) => (
          <Pressable
            key={chip.id}
            accessibilityRole="button"
            onPress={() => onRemoveChip(chip)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: colors.blue50,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text
              weight="medium"
              style={{
                fontSize: typography.size.sm,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {chip.label}
            </Text>
            <Icon type="Entypo" name="cross" size={16} color={colors.text} />
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        onPress={onClearAll}
        style={({ pressed }) => [
          styles.clearButton,
          {
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Text
          weight="medium"
          color={colors.primary}
          style={{
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.sm2,
          }}
        >
          {clearAllLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    minHeight: 32,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipsContent: {
    gap: 8,
    paddingRight: 12,
  },
  clearButton: {
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
