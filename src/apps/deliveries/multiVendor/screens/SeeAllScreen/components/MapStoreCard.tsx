import React from "react";
import { StyleSheet, View } from "react-native";
import Image from "../../../../../../general/components/Image";
import Icon from "../../../../../../general/components/Icon";
import Text from "../../../../../../general/components/Text";
import { useTheme } from "../../../../../../general/theme/theme";
import type { SeeAllMapStore } from "./mapStoreUtils";

type Props = {
  store: SeeAllMapStore;
};

function formatDeliveryTime(value?: number | string) {
  if (value === undefined || value === null || value === "") {
    return "0 mins";
  }

  return typeof value === "number" ? `${value} mins` : String(value);
}

function formatFee(value?: number) {
  if (value === undefined || value === null) {
    return null;
  }

  return `$${value}`;
}

function formatDistance(value?: number) {
  if (value === undefined || value === null) {
    return null;
  }

  return `${value} km`;
}

export default function MapStoreCard({ store }: Props) {
  const { colors, typography } = useTheme();
  const metaItems = [
    {
      id: "fee",
      icon: "bicycle",
      type: "Ionicons" as const,
      label: formatFee(store.deliveryFee),
    },
    {
      id: "time",
      icon: "time-outline",
      type: "Ionicons" as const,
      label: formatDeliveryTime(store.deliveryTime),
    },
    {
      id: "distance",
      icon: "location-outline",
      type: "Ionicons" as const,
      label: formatDistance(store.distanceKm),
    },
  ].filter((item) => item.label !== null);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.gray100,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Image source={{ uri: store.imageUrl }} style={styles.image} />

        <View style={styles.content}>
          <Text
            weight="semiBold"
            style={{
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
            numberOfLines={1}
          >
            {store.title}
          </Text>

          {store.subtitle ? (
            <Text
              color={colors.mutedText}
              style={{
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
              numberOfLines={1}
            >
              {store.subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.rating}>
          <View style={styles.ratingRow}>
            <Icon
              type="MaterialIcons"
              name="star"
              size={16}
              color={colors.yellow500}
            />
            <Text
              weight="semiBold"
              style={{
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {store.rating?.toFixed(1) ?? "-"}
            </Text>
          </View>
          {store.reviewCount ? (
            <Text
              color={colors.mutedText}
              style={{
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              ({store.reviewCount}+)
            </Text>
          ) : null}
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.metaRow}>
        {metaItems.map((item, index) => (
          <React.Fragment key={item.id}>
            <View style={styles.metaItem}>
              <Icon
                type={item.type}
                name={item.icon}
                size={16}
                color={colors.mutedText}
              />
              <Text
                color={colors.mutedText}
                style={{
                  fontSize: typography.size.xs2,
                  lineHeight: typography.lineHeight.sm,
                }}
              >
                {item.label}
              </Text>
            </View>
            {index < metaItems.length - 1 ? (
              <Icon
                type="Entypo"
                name="dot-single"
                size={20}
                color={colors.border}
              />
            ) : null}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  content: {
    flex: 1,
    gap: 2,
    justifyContent: "center",
    minHeight: 48,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  image: {
    borderRadius: 8,
    height: 48,
    width: 48,
  },
  metaDivider: {
    borderRadius: 2,
    height: 4,
    marginHorizontal: 2,
    opacity: 0.4,
    width: 4,
  },
  metaItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  rating: {
    alignItems: "flex-end",
    gap: 2,
    justifyContent: "center",
  },
  ratingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
});
