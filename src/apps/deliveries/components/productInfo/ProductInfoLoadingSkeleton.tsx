import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Skeleton from "../../../../general/components/Skeleton";
import { useTheme } from "../../../../general/theme/theme";

export default function ProductInfoLoadingSkeleton() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const headerHeight = Math.min(Math.max(width * 0.82, 300), 420);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.imageHeader, { height: headerHeight }]}>
          <Skeleton height={headerHeight} width="100%" borderRadius={0} />
          <Skeleton
            borderRadius={20}
            height={40}
            style={{ ...styles.closeButton, top: insets.top + 8 }}
            width={40}
          />
        </View>

        <View style={styles.infoSection}>
          <Skeleton height={34} width="52%" borderRadius={8} />
          <View style={styles.priceRow}>
            <Skeleton height={18} width={72} borderRadius={6} />
            <Skeleton height={32} width={32} borderRadius={16} style={styles.shareButton} />
          </View>
          <Skeleton height={16} width="92%" borderRadius={6} />
          <Skeleton height={16} width="82%" borderRadius={6} />
          <Skeleton height={16} width="76%" borderRadius={6} />
        </View>

        <Skeleton height={1} width="100%" borderRadius={1} style={styles.mainDivider} />

        <View style={styles.section}>
          <Skeleton height={24} width={120} borderRadius={6} />
          <Skeleton height={14} width={84} borderRadius={6} />
          <View style={styles.optionList}>
            <View style={styles.optionRow}>
              <Skeleton height={16} width={16} borderRadius={8} />
              <Skeleton height={16} width="42%" borderRadius={6} />
              <Skeleton height={16} width={52} borderRadius={6} style={styles.optionPrice} />
            </View>
            <View style={styles.optionRow}>
              <Skeleton height={16} width={16} borderRadius={8} />
              <Skeleton height={16} width="35%" borderRadius={6} />
              <Skeleton height={16} width={52} borderRadius={6} style={styles.optionPrice} />
            </View>
            <View style={styles.optionRow}>
              <Skeleton height={16} width={16} borderRadius={8} />
              <Skeleton height={16} width="28%" borderRadius={6} />
              <Skeleton height={16} width={52} borderRadius={6} style={styles.optionPrice} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Skeleton height={24} width={156} borderRadius={6} />
          <Skeleton height={14} width={72} borderRadius={6} />
          <View style={styles.optionList}>
            <View style={styles.optionRow}>
              <Skeleton height={16} width={16} borderRadius={4} />
              <Skeleton height={16} width="44%" borderRadius={6} />
              <Skeleton height={16} width={52} borderRadius={6} style={styles.optionPrice} />
            </View>
            <View style={styles.optionRow}>
              <Skeleton height={16} width={16} borderRadius={4} />
              <Skeleton height={16} width="52%" borderRadius={6} />
              <Skeleton height={16} width={52} borderRadius={6} style={styles.optionPrice} />
            </View>
            <View style={styles.optionRow}>
              <Skeleton height={16} width={16} borderRadius={4} />
              <Skeleton height={16} width="36%" borderRadius={6} />
              <Skeleton height={16} width={52} borderRadius={6} style={styles.optionPrice} />
            </View>
          </View>
        </View>

        <Skeleton height={1} width="100%" borderRadius={1} style={styles.bottomDivider} />
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.footerRow}>
          <View style={styles.stepper}>
            <Skeleton height={32} width={32} borderRadius={16} />
            <Skeleton height={24} width={24} borderRadius={6} />
            <Skeleton height={32} width={32} borderRadius={16} />
          </View>
          <Skeleton height={48} width="100%" borderRadius={6} style={styles.cta} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomDivider: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  closeButton: {
    left: 16,
    position: "absolute",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  content: {
    paddingBottom: 24,
  },
  cta: {
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  footerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
  },
  imageHeader: {
    width: "100%",
  },
  infoSection: {
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
  },
  mainDivider: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
  optionList: {
    gap: 14,
    paddingTop: 10,
  },
  optionPrice: {
    marginLeft: "auto",
  },
  optionRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  priceRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  section: {
    gap: 2,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  shareButton: {
    marginLeft: "auto",
  },
  stepper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
});
