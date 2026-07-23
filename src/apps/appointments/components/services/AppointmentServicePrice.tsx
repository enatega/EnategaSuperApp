import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import { formatPrice } from "../details/detailHelpers";

type Props = {
  dealName?: string | null;
  originalPrice?: number | null;
  price?: number | null;
  size?: number;
};

export default function AppointmentServicePrice({
  dealName,
  originalPrice,
  price,
  size,
}: Props) {
  const { colors, typography } = useTheme();
  const effectiveLabel = formatPrice(price);
  const originalLabel = formatPrice(originalPrice);
  const hasDiscount =
    effectiveLabel &&
    originalLabel &&
    Number(originalPrice) > Number(price);

  if (!effectiveLabel) {
    return null;
  }

  return (
    <View style={styles.row}>
      {hasDiscount ? (
        <Text
          style={[
            styles.original,
            { color: colors.mutedText, fontSize: size ?? typography.size.sm2 },
          ]}
        >
          {originalLabel}
        </Text>
      ) : null}
      <Text
        style={{
          color: hasDiscount ? colors.primary : colors.text,
          fontSize: size ?? typography.size.md,
        }}
        weight="semiBold"
      >
        {effectiveLabel}
      </Text>
      {hasDiscount && dealName ? (
        <Text
          numberOfLines={1}
          style={{ color: colors.primary, fontSize: typography.size.xs }}
          weight="semiBold"
        >
          {dealName}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  original: {
    textDecorationLine: "line-through",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
});
