import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import ProductOptionRow from "./ProductOptionRow";

type Props = {
  items: Array<{ id: string; label: string; price: number }>;
  selectedIds: string[];
  helperText?: string | null;
  onToggle: (id: string) => void;
  formatPrice: (value: number) => string;
};

export default function ItemFlavour({
  items,
  selectedIds,
  helperText,
  onToggle,
  formatPrice,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();

  if (items.length === 0) {
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
        {t("choose_your_addons")}
      </Text>
      <Text color={colors.iconDisabled} style={styles.subtitle}>
        {helperText || t("select_one")}
      </Text>

      <View style={styles.options}>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductOptionRow
              controlType="checkbox"
              isSelected={selectedIds.includes(item.id)}
              label={item.label}
              onPress={() => onToggle(item.id)}
              priceLabel={item.price === 0 ? t("free") : formatPrice(item.price)}
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
    paddingTop: 22,
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
