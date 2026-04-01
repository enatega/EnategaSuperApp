import React from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import { NutritionItem } from "./ProductInfoData";

type Props = {
  ingredients?: string;
  usage?: string;
  amountPer?: string;
  nutrition: NutritionItem[];
  nutritionTitle?: string;
};

export default function ItemNutritions({
  ingredients,
  usage,
  amountPer,
  nutrition,
  nutritionTitle,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();
  const hasIngredients = Boolean(ingredients?.trim());
  const hasUsage = Boolean(usage?.trim());
  const hasNutrition = nutrition.length > 0;

  return (
    <View style={styles.container}>
      {hasIngredients ? (
        <View style={styles.section}>
          <Text
            color={colors.text}
            style={[
              styles.heading,
              {
                fontSize: typography.size.h5,
                lineHeight: typography.lineHeight.h5,
              },
            ]}
          >
            {t("ingredients")}
          </Text>
          <Text color={colors.mutedText} style={styles.body}>
            {ingredients}
          </Text>
        </View>
      ) : null}

      {hasIngredients && (hasUsage || hasNutrition) ? (
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      ) : null}

      {hasUsage ? (
        <View style={styles.section}>
          <Text
            color={colors.text}
            style={[
              styles.heading,
              {
                fontSize: typography.size.h5,
                lineHeight: typography.lineHeight.h5,
              },
            ]}
          >
            {t("usage")}
          </Text>
          <Text color={colors.mutedText} style={styles.body}>
            {usage}
          </Text>
        </View>
      ) : null}

      {hasUsage && hasNutrition ? (
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      ) : null}

      {hasNutrition ? (
        <View style={styles.section}>
          <Text
            color={colors.text}
            style={[
              styles.heading,
              {
                fontSize: typography.size.h5,
                lineHeight: typography.lineHeight.h5,
              },
            ]}
          >
            {nutritionTitle || t("nutrition_facts")}
          </Text>
          {amountPer ? (
            <Text color={colors.iconDisabled} style={styles.body}>
              {`${t("amount_per")} ${amountPer}`}
            </Text>
          ) : null}

          <View style={styles.nutritionList}>
            {nutrition.map((item) => (
              <View key={item.id} style={styles.nutritionRow}>
                <Text color={colors.text} style={styles.body}>
                  {item.label}
                </Text>
                <Text color={colors.mutedText} style={styles.body}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    fontSize: 14,
    lineHeight: 22,
  },
  container: {
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  heading: {
    fontWeight: "800",
    letterSpacing: -0.36,
  },
  nutritionList: {
    gap: 10,
    marginTop: 12,
  },
  nutritionRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  section: {
    gap: 8,
    paddingVertical: 12,
  },
});
