import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Image from "../../../../../general/components/Image";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import type { DeliveryShopTypeCategory } from "../../../api/categoriesServicesTypes";

type Props = {
  item: DeliveryShopTypeCategory;
  onPress: (item: DeliveryShopTypeCategory) => void;
};

export default function ShopTypeCategoryCard({ item, onPress }: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityLabel={item.name}
      accessibilityRole="button"
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View
        style={[styles.imageWrap, { backgroundColor: colors.backgroundTertiary }]}
      >
        <Image source={{ uri: item.imageUrl ?? "" }} style={styles.image} />
      </View>
      <Text
        numberOfLines={2}
        weight="semiBold"
        style={{
          flex: 1,
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {item.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 10,
    maxWidth: "48%",
    minHeight: 88,
    padding: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  image: {
    borderRadius: 9,
    height: 48,
    width: 48,
  },
  imageWrap: {
    alignItems: "center",
    borderRadius: 11,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
});
