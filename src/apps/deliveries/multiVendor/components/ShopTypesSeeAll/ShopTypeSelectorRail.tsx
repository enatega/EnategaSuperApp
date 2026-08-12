import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Image from "../../../../../general/components/Image";
import HorizontalList from "../../../../../general/components/HorizontalList";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import type { DeliveryShopType } from "../../../api/types";

type Props = {
  items: DeliveryShopType[];
  selectedShopTypeId: string;
  onSelect: (shopTypeId: string) => void;
  onEndReached: () => void;
};

function decodeDisplayText(value: string) {
  try {
    return decodeURIComponent(value).replace(/%amp;|&amp;|&#38;/gi, "&");
  } catch {
    return value.replace(/%amp;|&amp;|&#38;/gi, "&");
  }
}

export default function ShopTypeSelectorRail({
  items,
  selectedShopTypeId,
  onSelect,
  onEndReached,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <HorizontalList
      data={items}
      contentContainerStyle={styles.content}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      keyExtractor={(item) => item.id}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      renderItem={({ item }) => {
        const isSelected = item.id === selectedShopTypeId;
        const name = decodeDisplayText(item.name);

        return (
          <Pressable
            accessibilityLabel={name}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onSelect(item.id)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: isSelected
                  ? colors.primary
                  : colors.backgroundTertiary,
                borderColor: isSelected ? colors.primary : colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View
              style={[styles.iconWrap, { backgroundColor: colors.surface }]}
            >
              <Image
                source={{ uri: item.image ?? item.icon ?? "" }}
                style={styles.icon}
              />
            </View>
            <Text
              color={isSelected ? colors.white : colors.text}
              numberOfLines={2}
              weight="semiBold"
              style={{
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {name}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    gap: 7,
    height: 104,
    justifyContent: "center",
    padding: 8,
    width: 104,
  },
  content: {
    paddingRight: 16,
  },
  icon: {
    borderRadius: 8,
    height: 44,
    width: 44,
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: 10,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
  separator: {
    width: 10,
  },
});
