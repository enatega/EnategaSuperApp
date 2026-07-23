import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet, View } from "react-native";
import Card from "../../../../general/components/Card";
import Image from "../../../../general/components/Image";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import type { AppointmentTopBrand } from "../../api/types";

type Props = {
  brand: AppointmentTopBrand;
  isFullWidth?: boolean;
};

export default function AppointmentsTopBrandCard({
  brand,
  isFullWidth = false,
}: Props) {
  const { colors, typography } = useTheme();
  const badgeLabel =
    typeof brand.dealAmount === "number" && brand.dealAmount > 0
      ? brand.dealType === "percentage"
        ? `${brand.dealAmount}%`
        : String(brand.dealAmount)
      : null;

  return (
    <Card
      style={[
        styles.card,
        isFullWidth ? styles.cardFullWidth : null,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      variant="outlined"
    >
      <View
        style={[
          styles.imageWrap,
          { backgroundColor: colors.backgroundTertiary },
        ]}
      >
        <Image
          source={{ uri: brand.logo ?? "" }}
          style={styles.image}
          resizeMode="cover"
        />
        {badgeLabel ? (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <MaterialCommunityIcons
              color={colors.white}
              name="tag-outline"
              size={12}
            />
            <Text color={colors.white} style={styles.badgeText} weight="medium">
              {badgeLabel}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.copy}>
        <Text
          weight="bold"
          numberOfLines={1}
          style={{
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.sm2,
          }}
        >
          {brand.name}
        </Text>
        <Text
          color={colors.mutedText}
          numberOfLines={1}
          style={styles.subtitle}
        >
          {brand.deal || " "}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 4,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "absolute",
    top: 8,
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 14,
  },
  card: {
    height: 158,
    overflow: "hidden",
    padding: 0,
    width: 118,
  },
  cardFullWidth: {
    width: "100%",
  },
  copy: {
    flex: 1,
    gap: 4,
    justifyContent: "center",
    minHeight: 60,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  imageWrap: {
    alignItems: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 96,
    justifyContent: "center",
    overflow: "hidden",
  },
  subtitle: {
    fontSize: 11,
    lineHeight: 14,
  },
});
