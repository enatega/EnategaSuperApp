import React from "react";
import { StyleSheet, View } from "react-native";
import Icon from "../../../../../general/components/Icon";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import { formatMapMarkerLabel } from "./mapStoreUtils";

type Props = {
  title: string;
  isSelected: boolean;
};

export default function MapStoreMarker({ title, isSelected }: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconBubble,
          {
            backgroundColor: isSelected ? colors.primary : colors.surface,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <Icon
          type="MaterialCommunityIcons"
          name="silverware-fork-knife"
          size={16}
          color={isSelected ? colors.white : colors.warning}
        />
      </View>

      <View style={styles.tooltipContainer}>
        <View
          style={[
            styles.tooltipPointer,
            {
              backgroundColor: isSelected ? colors.primary : colors.surface,
            },
          ]}
        />
        <View
          style={[
            styles.tooltip,
            {
              backgroundColor: isSelected ? colors.primary : colors.surface,
              shadowColor: colors.shadowColor,
            },
          ]}
        >
          <Text
            weight="medium"
            color={isSelected ? colors.white : colors.text}
            style={{
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
            numberOfLines={1}
          >
            {formatMapMarkerLabel(title)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 2,
  },
  iconBubble: {
    alignItems: "center",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    width: 50,
  },
  tooltip: {
    borderRadius: 8,
    maxWidth: 112,
    minHeight: 30,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
  },
  tooltipContainer: {
    alignItems: "center",
  },
  tooltipPointer: {
    borderTopLeftRadius: 2,
    height: 10,
    marginBottom: -5,
    transform: [{ rotate: "45deg" }],
    width: 10,
  },
});
