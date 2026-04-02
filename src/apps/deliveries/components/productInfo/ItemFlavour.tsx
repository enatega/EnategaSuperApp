import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import ProductOptionRow from "./ProductOptionRow";
import type { ProductSelectionSection } from "./useProductSelectionState";

type Props = {
  sections: ProductSelectionSection[];
  selectedOptionIdsByGroup: Record<string, string[]>;
  onToggle: (groupId: string, optionId: string) => void;
  formatPrice: (value: number) => string;
};

export default function ItemFlavour({
  sections,
  selectedOptionIdsByGroup,
  onToggle,
  formatPrice,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();
  const resolveSectionSubtitle = React.useCallback(
    (helperText: string | null, isMarkedRequired: boolean) => {
      const normalizedHelperText = helperText?.trim().toLowerCase() ?? "";

      if (isMarkedRequired) {
        return t("required_label");
      }

      if (normalizedHelperText === "optional") {
        return t("optional_label");
      }

      return helperText || t("select_one");
    },
    [t],
  );

  if (sections.length === 0) {
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
        {t("choose_your_addons")}
      </Text>
      {sections.map((section) => (
        <View key={section.groupId} style={styles.sectionBlock}>
          <Text color={colors.iconDisabled} style={styles.subtitle}>
            {resolveSectionSubtitle(section.helperText, section.isMarkedRequired)}
          </Text>

          <View style={styles.options}>
            <FlatList
              data={section.options}
              keyExtractor={(item) => item.optionId}
              renderItem={({ item }) => (
                <ProductOptionRow
                  controlType={section.selectionType === "single" ? "radio" : "checkbox"}
                  isSelected={
                    (selectedOptionIdsByGroup[section.groupId] ?? []).includes(item.optionId)
                  }
                  label={item.label}
                  onPress={() => onToggle(section.groupId, item.optionId)}
                  priceLabel={item.price === 0 ? t("free") : formatPrice(item.price)}
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
