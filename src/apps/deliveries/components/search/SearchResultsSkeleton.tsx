import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Skeleton from "../../../../general/components/Skeleton";
import type { SearchResultsSkeletonProps } from "./types";

export default function SearchResultsSkeleton({
  showStores = true,
}: SearchResultsSkeletonProps) {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Skeleton width={110} height={28} borderRadius={6} />
          <Skeleton width={74} height={32} borderRadius={6} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productRow}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={`product-skeleton-${index}`} style={styles.productCard}>
              <Skeleton width={100} height={100} borderRadius={6} />
              <Skeleton width={68} height={10} borderRadius={4} />
            </View>
          ))}
        </ScrollView>
      </View>

      {showStores && (
        <View style={styles.section}>
          <View style={styles.storeHeader}>
            <Skeleton width={88} height={28} borderRadius={6} />
          </View>

          {Array.from({ length: 2 }).map((_, index) => (
            <View key={`store-skeleton-${index}`} style={styles.storeCard}>
              <Skeleton width="100%" height={140} borderRadius={8} />
              <View style={styles.storeContent}>
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
  storeHeader: {
    marginBottom: 12,
  },
  productRow: {
    paddingRight: 8,
  },
  productCard: {
    width: 100,
    marginRight: 12,
    gap: 8,
  },
  storeCard: {
    marginBottom: 12,
    gap: 0,
  },
  storeContent: {
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
