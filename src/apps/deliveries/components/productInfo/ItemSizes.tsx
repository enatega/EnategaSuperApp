import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import ProductOptionRow from "./ProductOptionRow";
import type { ProductInfoCustomizationSection } from "../../api/productInfoServiceTypes";

type Props = {
  variations: ProductInfoCustomizationSection[];
  selectedId: string;
  onSelect: (id: string) => void;
  formatPrice: (value: number) => string;
};

export default function ItemSizes({
  variations,
  selectedId,
  onSelect,
  formatPrice,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();

  if (variations.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text
        color={colors.text}
        weight="extraBold"
        style={{
          fontSize: typography.size.xl,
          letterSpacing: -0.36,
          lineHeight: typography.lineHeight.h5,
        }}
      >
        {t("choose_variation")}
      </Text>
      <Text color={colors.iconDisabled} style={styles.subtitle}>
        {variations[0]?.helperText || t("select_one")}
      </Text>

      <View accessibilityRole="radiogroup" style={styles.options}>
        <FlatList
          data={variations}
          keyExtractor={(item) => item.groupId}
          renderItem={({ item }) => (
            <ProductOptionRow
              controlType="radio"
              isSelected={selectedId === item.groupId}
              label={item.name}
              onPress={() => onSelect(item.groupId)}
              priceLabel={item.price === 0 ? t("free") : formatPrice(item.price ?? 0)}
            />
          )}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  options: {
    paddingTop: 10,
  },
  separator: {
    height: 14,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
});
