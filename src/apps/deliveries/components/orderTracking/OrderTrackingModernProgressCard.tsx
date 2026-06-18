import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import type { DeliveryOrderStatus } from "../../api/ordersServiceTypes";
import { getNextLabel, getProgressLabel, getProgressSegments } from "./OrderTrackingModern.shared";

type Props = {
  progressTimeLabel: string;
  status: DeliveryOrderStatus;
};

export default function OrderTrackingModernProgressCard({
  progressTimeLabel,
  status,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: "#F9FAFB", borderColor: colors.border }]}> 
      <Text color="#4B5563" style={styles.progressTitle} weight="medium">
        Delivery Progress
      </Text>
      <View style={styles.rowBetween}>
        <View style={styles.rowGap}>
          <View style={styles.progressDot} />
          <Text color={colors.text} style={styles.progressValue} weight="semiBold">
            {getProgressLabel(status)}
          </Text>
        </View>
        <Text color={colors.mutedText} style={styles.progressTime} weight="medium">
          {progressTimeLabel}
        </Text>
      </View>
      <Text color="#6B7280" style={styles.nextText} weight="medium">
        Next: {getNextLabel(status)}
      </Text>
      <View style={styles.progressBarsRow}>
        {getProgressSegments(status).map((segmentColor, index) => (
          <View
            key={`segment-${index}`}
            style={[styles.progressSegment, { backgroundColor: segmentColor || "#E5E7EB" }]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
  },
  nextText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  progressBarsRow: {
    columnGap: 6,
    flexDirection: "row",
    marginTop: 10,
  },
  progressDot: {
    backgroundColor: "#A8E62A",
    borderRadius: 999,
    height: 10,
    width: 10,
  },
  progressSegment: {
    borderRadius: 999,
    flex: 1,
    height: 6,
  },
  progressTime: {
    fontSize: 12,
    lineHeight: 18,
  },
  progressTitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  progressValue: {
    fontSize: 16,
    lineHeight: 24,
  },
  rowBetween: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowGap: {
    alignItems: "center",
    columnGap: 12,
    flexDirection: "row",
  },
});
