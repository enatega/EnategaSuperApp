import React from "react";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet, View } from "react-native";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";

type Props = {
  stepKey: string;
  title: string;
  completedAt?: string | null;
  tone: "completed" | "active" | "upcoming";
};

export default function OrderTrackingTimelineItem({
  stepKey,
  title,
  completedAt,
  tone,
}: Props) {
  const { colors, typography } = useTheme();
  const iconBackgroundColor =
    tone === "completed" || tone === "active"
      ? colors.blue100
      : colors.backgroundTertiary;
  const iconColor =
    tone === "completed" || tone === "active"
      ? colors.primary
      : colors.iconMuted;
  const icon = getTimelineIcon(stepKey, tone, iconColor);

  return (
    <View style={styles.row}>
      <View style={styles.iconColumn}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: iconBackgroundColor,
            },
          ]}
        >
          {icon}
        </View>
      </View>

      <View style={styles.content}>
        <Text
          color={colors.text}
          style={{
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md,
          }}
          weight="medium"
        >
          {title}
        </Text>
        {completedAt ? (
          <Text
            color={colors.mutedText}
            style={styles.completedAt}
            weight="medium"
          >
            {completedAt}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  completedAt: {
    marginLeft: 12,
  },
  content: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 40,
  },
  iconColumn: {
    alignItems: "center",
    marginRight: 12,
    minHeight: 40,
  },
  iconWrapper: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    // paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

function getTimelineIcon(stepKey: string, tone: Props["tone"], color: string) {
  const size = tone === "completed" || tone === "active" ? 22 : 20;

  switch (stepKey) {
    case "confirmed":
      return <Ionicons color={color} name="checkmark" size={size} />;
    case "packed":
      return <Ionicons color={color} name="checkmark" size={size} />;
    case "picked_up":
      return <Ionicons color={color} name="refresh-outline" size={size} />;
    case "on_the_way":
      return (
        <MaterialCommunityIcons color={color} name="bike-fast" size={size} />
      );
    default:
      return (
        <Ionicons
          color={color}
          name={
            tone === "completed" || tone === "active"
              ? "checkmark"
              : "ellipse-outline"
          }
          size={size}
        />
      );
  }
}
