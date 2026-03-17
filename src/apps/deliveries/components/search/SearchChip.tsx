import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import type { SearchChipProps } from "./types";

export default function SearchChip({ label, onPress }: SearchChipProps) {
  const { colors, typography } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => onPress(label)}
      activeOpacity={0.7}
    >
      <Text
        variant="caption"
        numberOfLines={1}
        weight="medium"
        style={{ fontSize: typography.size.sm2, lineHeight: 22 }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
});
