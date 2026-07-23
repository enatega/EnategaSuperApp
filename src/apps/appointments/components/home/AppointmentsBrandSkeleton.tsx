import React from "react";
import { StyleSheet, View } from "react-native";
import HorizontalList from "../../../../general/components/HorizontalList";
import Skeleton from "../../../../general/components/Skeleton";

const ITEMS = Array.from(
  { length: 4 },
  (_, index) => `brand-skeleton-${index}`,
);

export default function AppointmentsBrandSkeleton() {
  return (
    <HorizontalList
      data={ITEMS}
      keyExtractor={(item) => item}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={() => (
        <View style={styles.card}>
          <Skeleton height={96} width={118} borderRadius={16} />
          <View style={styles.copy}>
            <Skeleton height={14} width={72} borderRadius={6} />
            <Skeleton height={12} width={54} borderRadius={6} />
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    height: 158,
    overflow: "hidden",
    width: 118,
  },
  copy: {
    gap: 6,
    justifyContent: "center",
    minHeight: 60,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  listContent: {
    paddingRight: 16,
  },
  separator: {
    width: 12,
  },
});
