import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import type { ThemeColors } from "../../../../../../general/theme/colors";
import { useTheme } from "../../../../../../general/theme/theme";
import Text from "../../../../../../general/components/Text";
import Icon from "../../../../../../general/components/Icon";
import type { HomeVisitsSingleVendorCategory } from "../../api/types";

const QUICK_CATEGORY_CARD_COLORS: Array<keyof ThemeColors> = [
  "cardBlue",
  "cardLavender",
  "cardPeach",
  "cardMint",
  "cardSoft",
];

type Props = {
  items: HomeVisitsSingleVendorCategory[];
  onPressItem: (item: HomeVisitsSingleVendorCategory) => void;
};

export default function QuickCategoriesRow({ items, onPressItem }: Props) {
  const { colors, typography } = useTheme();

  if (items.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.quickCategoriesCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      {items.map((item, index) => (
        <Pressable
          key={item.id}
          accessibilityRole="button"
          onPress={() => onPressItem(item)}
          style={({ pressed }) => [
            styles.quickCategoryItem,
            { opacity: pressed ? 0.84 : 1 },
          ]}
        >
          <View
            style={[
              styles.quickCategoryIcon,
              {
                backgroundColor:
                  colors[
                    QUICK_CATEGORY_CARD_COLORS[
                      index % QUICK_CATEGORY_CARD_COLORS.length
                    ]
                  ],
              },
            ]}
          >
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.quickIconImage} />
            ) : (
              <Icon
                type="Ionicons"
                name="grid-outline"
                size={18}
                color={colors.primary}
              />
            )}
          </View>
          <Text
            numberOfLines={1}
            weight="medium"
            style={[
              styles.quickCategoryLabel,
              {
                color: colors.text,
                fontSize: typography.size.sm,
              },
            ]}
          >
            {item.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  quickCategoriesCard: {
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
    flexDirection: "row",
    marginHorizontal: 16,
    paddingHorizontal: 10,
    paddingVertical: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  quickCategoryItem: {
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  quickCategoryIcon: {
    alignItems: "center",
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  quickIconImage: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  quickCategoryLabel: {
    maxWidth: 62,
    textAlign: "center",
  },
});
