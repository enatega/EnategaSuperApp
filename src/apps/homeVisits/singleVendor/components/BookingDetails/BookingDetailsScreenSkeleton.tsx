import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Skeleton from "../../../../../general/components/Skeleton";
import { useTheme } from "../../../../../general/theme/theme";

type Props = {
  topInset: number;
};

export default function BookingDetailsScreenSkeleton({ topInset }: Props) {
  const { colors } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.hero, { backgroundColor: colors.backgroundTertiary }]}>
        <View style={[styles.heroActions, { paddingTop: topInset + 8 }]}>
          <View
            style={[
              styles.headerButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              color={colors.text}
              name="arrow-left"
              size={22}
            />
          </View>
          <View
            style={[
              styles.headerButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <MaterialCommunityIcons
              color={colors.text}
              name="close"
              size={22}
            />
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Skeleton
          borderRadius={6}
          height={28}
          style={styles.badge}
          width={110}
        />
        <Skeleton height={38} style={styles.title} width="75%" />
        <Skeleton height={22} style={styles.subtitle} width="58%" />

        <View style={styles.actions}>
          <Skeleton height={68} width="100%" />
          <Skeleton height={68} width="100%" />
          <Skeleton height={68} width="100%" />
        </View>

        <Skeleton height={32} style={styles.sectionTitle} width={170} />
        <Skeleton height={18} style={styles.sectionSubtitle} width="72%" />
        <Skeleton height={72} style={styles.sectionBlock} width="100%" />
        <Skeleton height={1} style={styles.divider} width="100%" />
        <Skeleton height={24} style={styles.totalRow} width="100%" />
        <Skeleton height={24} style={styles.totalRow} width="100%" />
        <Skeleton height={96} style={styles.sectionBlock} width="100%" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  badge: {
    marginBottom: 14,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  divider: {
    marginBottom: 16,
    marginTop: 16,
  },
  headerButton: {
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  hero: {
    height: 212,
    overflow: "hidden",
  },
  heroActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionSubtitle: {
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 18,
  },
  title: {
    marginBottom: 8,
  },
  totalRow: {
    marginBottom: 12,
  },
});
