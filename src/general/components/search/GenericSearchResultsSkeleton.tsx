import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Skeleton from "../Skeleton";

export type GenericSearchResultsSkeletonProps = {
  showSecondarySection?: boolean;
  primarySectionConfig?: {
    showHeader?: boolean;
    itemCount?: number;
    itemWidth?: number;
    itemHeight?: number;
  };
  secondarySectionConfig?: {
    headerWidth?: number;
    cardCount?: number;
  };
};

export default function GenericSearchResultsSkeleton({
  showSecondarySection = true,
  primarySectionConfig = {
    showHeader: true,
    itemCount: 4,
    itemWidth: 100,
    itemHeight: 100,
  },
  secondarySectionConfig = {
    headerWidth: 88,
    cardCount: 2,
  },
}: GenericSearchResultsSkeletonProps) {
  return (
    <View style={styles.container}>
      {/* Primary Section (Products/Services) */}
      <View style={styles.section}>
        {primarySectionConfig.showHeader && (
          <View style={styles.headerRow}>
            <Skeleton width={110} height={28} borderRadius={6} />
            <Skeleton width={74} height={32} borderRadius={6} />
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.itemRow}
        >
          {Array.from({ length: primarySectionConfig.itemCount || 4 }).map((_, index) => (
            <View
              key={`primary-skeleton-${index}`}
              style={styles.itemCard}
            >
              <Skeleton 
                width={primarySectionConfig.itemWidth || 100} 
                height={primarySectionConfig.itemHeight || 100} 
                borderRadius={6} 
              />
              <Skeleton width={68} height={10} borderRadius={4} />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Secondary Section (Stores/Service Centers) */}
      {showSecondarySection && (
        <View style={styles.section}>
          <View style={styles.secondaryHeader}>
            <Skeleton width={secondarySectionConfig.headerWidth || 88} height={28} borderRadius={6} />
          </View>

          {Array.from({ length: secondarySectionConfig.cardCount || 2 }).map((_, index) => (
            <View key={`secondary-skeleton-${index}`} style={styles.secondaryCard}>
              <Skeleton width="100%" height={140} borderRadius={8} />
              <View style={styles.secondaryContent}>
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
  secondaryHeader: {
    marginBottom: 12,
  },
  itemRow: {
    paddingRight: 8,
  },
  itemCard: {
    width: 100,
    marginRight: 12,
    gap: 8,
  },
  secondaryCard: {
    marginBottom: 12,
    gap: 0,
  },
  secondaryContent: {
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