import React from "react";
import { StyleSheet, View } from "react-native";
import Skeleton from "../../../../general/components/Skeleton";

export default function ProductInfoCustomizationsLoadingSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Skeleton borderRadius={6} height={24} width={120} />
        <Skeleton borderRadius={6} height={14} width={84} />
        <View style={styles.optionList}>
          <View style={styles.optionRow}>
            <Skeleton borderRadius={8} height={16} width={16} />
            <Skeleton borderRadius={6} height={16} width="42%" />
            <Skeleton borderRadius={6} height={16} style={styles.optionPrice} width={52} />
          </View>
          <View style={styles.optionRow}>
            <Skeleton borderRadius={8} height={16} width={16} />
            <Skeleton borderRadius={6} height={16} width="35%" />
            <Skeleton borderRadius={6} height={16} style={styles.optionPrice} width={52} />
          </View>
          <View style={styles.optionRow}>
            <Skeleton borderRadius={8} height={16} width={16} />
            <Skeleton borderRadius={6} height={16} width="28%" />
            <Skeleton borderRadius={6} height={16} style={styles.optionPrice} width={52} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Skeleton borderRadius={6} height={24} width={156} />
        <Skeleton borderRadius={6} height={14} width={72} />
        <View style={styles.optionList}>
          <View style={styles.optionRow}>
            <Skeleton borderRadius={4} height={16} width={16} />
            <Skeleton borderRadius={6} height={16} width="44%" />
            <Skeleton borderRadius={6} height={16} style={styles.optionPrice} width={52} />
          </View>
          <View style={styles.optionRow}>
            <Skeleton borderRadius={4} height={16} width={16} />
            <Skeleton borderRadius={6} height={16} width="52%" />
            <Skeleton borderRadius={6} height={16} style={styles.optionPrice} width={52} />
          </View>
          <View style={styles.optionRow}>
            <Skeleton borderRadius={4} height={16} width={16} />
            <Skeleton borderRadius={6} height={16} width="36%" />
            <Skeleton borderRadius={6} height={16} style={styles.optionPrice} width={52} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  optionList: {
    gap: 12,
    paddingTop: 12,
  },
  optionPrice: {
    marginLeft: "auto",
  },
  optionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  section: {
    gap: 2,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
});
