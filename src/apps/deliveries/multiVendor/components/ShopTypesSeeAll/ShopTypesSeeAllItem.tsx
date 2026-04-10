import React from "react";
import { Pressable, StyleSheet } from "react-native";
import type { DeliveryShopType } from "../../../api/types";
import ShopTypeCard from "../../../components/ShopTypeCard";
import { useTheme } from "../../../../../general/theme/theme";

type Props = {
  item: DeliveryShopType;
  onPress: (shopType: DeliveryShopType) => void;
};

export default function ShopTypesSeeAllItem({ item, onPress }: Props) {
  const { typography } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.name}
      onPress={() => onPress(item)}
      style={styles.item}
    >
      <ShopTypeCard
        image={{ uri: item.image ?? "" }}
        title={item.name}
        containerStyle={styles.cardContainer}
        imageWrapStyle={styles.imageWrap}
        imageStyle={styles.image}
        titleStyle={{
          fontSize: typography.size.sm2,
          lineHeight: typography.lineHeight.md,
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    gap: 10,
    width: "100%",
  },
  image: {
    borderRadius: 8,
    height: "100%",
    width: "100%",
  },
  imageWrap: {
    borderRadius: 14,
    height: 112,
    padding: 12,
    width: 112,
  },
  item: {
    width: "31%",
  },
});
