import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Skeleton from "../../../../general/components/Skeleton";
import type { SearchResultsSkeletonProps } from "./types";

export default function SearchResultsSkeleton({
  showServiceCenters = true,
}: SearchResultsSkeletonProps) {
  return (
    <View style={styles.container}>
      {/* Services Section */}
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Skeleton width={110} height={28} borderRadius={6} />
          <Skeleton width={74} height={32} borderRadius={6} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.serviceRow}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <View
              key={`service-skeleton-${index}`}
              style={styles.serviceCard}
            >
              <Skeleton width={100} height={100} borderRadius={6} />
              <Skeleton width={68} height={10} borderRadius={4} />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Service Centers Section */}
      {showServiceCenters && (
        <View style={styles.section}>
          <View style={styles.serviceCenterHeader}>
            <Skeleton width={120} height={28} borderRadius={6} />
          </View>

          {Array.from({ length: 2 }).map((_, index) => (
            <View key={`service-center-skeleton-${index}`} style={styles.serviceCenterCard}>
              <Skeleton width="100%" height={140} borderRadius={8} />
              <View style={styles.serviceCenterContent}>
                <Skeleton width="55%" height={14} borderRadius={4} />
                <View style={styles.metaRow}>
                  <Skeleton width={76} height={12} borderRadius={4} />
                  <Skeleton width={60} height={12} borderRadius={4} />
                </View>
                <Skeleton width="100%" height={1} borderRadius={1} />
                <View style={styles.infoRow}>
                  <Skeleton width={52} height={12} borderRadius={4} />
                  <Skeleton width={64} height={12} borderRadius={4} />
                  <Skeleton width={54} height={12} borderRadius={4} />
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  section: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  serviceCenterHeader: {
    marginBottom: 12,
  },
  serviceRow: {
    paddingRight: 8,
  },
  serviceCard: {
    width: 100,
    marginRight: 12,
    gap: 8,
  },
  serviceCenterCard: {
    marginBottom: 12,
    gap: 0,
  },
  serviceCenterContent: {
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 10,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
