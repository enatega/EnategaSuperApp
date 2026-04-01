import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import ProductOptionRow from "./ProductOptionRow";
import type { ProductSelectionSection } from "./useProductSelectionState";

type Props = {
  variations: ProductSelectionSection[];
  selectedOptionIdsByGroup: Record<string, string>;
  onSelect: (groupId: string, optionId: string) => void;
  formatPrice: (value: number) => string;
};

export default function ItemSizes({
  variations,
  selectedOptionIdsByGroup,
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
          fontSize: typography.size.h5,
          letterSpacing: -0.36,
          lineHeight: typography.lineHeight.h5,
        }}
      >
        {t("choose_variation")}
      </Text>
      {variations.map((variationSection) => (
        <View key={variationSection.groupId} style={styles.sectionBlock}>
          <Text color={colors.iconDisabled} style={styles.subtitle}>
            {variationSection.helperText || t("select_one")}
          </Text>

          <View accessibilityRole="radiogroup" style={styles.options}>
            <FlatList
              data={variationSection.options}
              keyExtractor={(item) => item.optionId}
              renderItem={({ item }) => (
                <ProductOptionRow
                  controlType="radio"
                  isSelected={
                    selectedOptionIdsByGroup[variationSection.groupId] === item.optionId
                  }
                  label={item.label}
                  onPress={() => onSelect(variationSection.groupId, item.optionId)}
                  priceLabel={item.price === 0 ? t("free") : formatPrice(item.price ?? 0)}
                />
              )}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
    paddingHorizontal: 16,
    paddingBottom: 4,
    paddingTop: 16,
  },
  sectionBlock: {
    gap: 2,
  },
  options: {
    paddingTop: 12,
  },
  separator: {
    height: 12,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
});
