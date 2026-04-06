import React from "react";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet, View } from "react-native";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";

type Props = {
  stepKey: string;
  title: string;
  completedAt?: string | null;
  tone: "completed" | "active" | "upcoming";
  isLastItem: boolean;
};

export default function OrderTrackingTimelineItem({
  stepKey,
  title,
  completedAt,
  tone,
  isLastItem,
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
        {!isLastItem ? (
          <View
            style={[
              styles.connector,
              {
                backgroundColor: colors.border,
              },
            ]}
          />
        ) : null}
      </View>

      <View style={styles.content}>
        <Text
          color={colors.text}
          style={{
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md,
          }}
          weight={tone === "active" ? "bold" : "semiBold"}
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
    marginTop: 4,
  },
  connector: {
    flex: 1,
    marginTop: 8,
    width: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 6,
  },
  iconColumn: {
    alignItems: "center",
    marginRight: 14,
    minHeight: 60,
  },
  iconWrapper: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  row: {
    flexDirection: "row",
  },
});

function getTimelineIcon(stepKey: string, tone: Props["tone"], color: string) {
  const size = tone === "completed" || tone === "active" ? 22 : 20;

  switch (stepKey) {
    case "confirmed":
      return <Ionicons color={color} name="checkmark" size={size} />;
    case "packed":
      return <Ionicons color={color} name="sync-outline" size={size} />;
    case "picked_up":
      return <Ionicons color={color} name="checkmark" size={size} />;
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
