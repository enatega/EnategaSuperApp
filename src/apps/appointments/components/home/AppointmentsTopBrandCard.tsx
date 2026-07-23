import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { StyleSheet, View } from "react-native";
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
    <View
      style={[
        styles.card,
        isFullWidth ? styles.cardFullWidth : null,
      ]}
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
          numberOfLines={1}
          style={{
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.sm2,
            fontWeight: "700"
          }}
        >
          {brand.name}
        </Text>
      </View>
    </View>
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
    width: 118,

  },
  cardFullWidth: {
    width: "100%",
  },
  copy: {
    paddingHorizontal: 2,
    paddingTop: 8,
    alignItems: "center",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  imageWrap: {
    alignItems: "center",
    borderRadius: 14,
    height: 110,
    justifyContent: "center",
    overflow: "hidden",
  },
});
