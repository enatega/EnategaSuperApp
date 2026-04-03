import React from "react";
import { StyleSheet, View } from "react-native";
import Skeleton from "../../../../../general/components/Skeleton";

export default function OrderTrackingLoadingSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton height={96} style={styles.banner} />
      <View style={styles.timeline}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={styles.timelineRow}>
            <Skeleton borderRadius={14} height={28} width={28} />
            <View style={styles.timelineContent}>
              <Skeleton height={18} width="55%" />
              <Skeleton height={14} style={styles.timelineSubline} width="30%" />
            </View>
          </View>
        ))}
      </View>
      <Skeleton height={1} width="100%" />
      <View style={styles.rows}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} style={styles.infoRow}>
            <Skeleton borderRadius={20} height={40} width={40} />
            <View style={styles.infoContent}>
              <Skeleton height={18} width="45%" />
              <Skeleton height={14} style={styles.infoSubline} width="75%" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginBottom: 24,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
  },
  infoSubline: {
    marginTop: 8,
  },
  rows: {
    marginTop: 8,
  },
  timeline: {
    marginBottom: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineRow: {
    flexDirection: "row",
    gap: 14,
    paddingBottom: 22,
  },
  timelineSubline: {
    marginTop: 8,
  },
});
