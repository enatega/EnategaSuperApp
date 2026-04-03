import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import { formatOrderDateTime } from "../../utils/orderDetails/orderDetailsUtils";

type Props = {
  orderedAt: string;
  storeName: string;
  storeAddress: string | null;
};

export default function OrderDetailsHeroSection({
  orderedAt,
  storeName,
  storeAddress,
}: Props) {
  const { colors, typography } = useTheme();
  const trimmedAddress = storeAddress?.trim();
  const title = trimmedAddress ? `${storeName} @ ${trimmedAddress}` : storeName;

  return (
    <View style={styles.hero}>
      <Text
        style={[
          styles.metaText,
          {
            color: colors.mutedText,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          },
        ]}
        weight="medium"
      >
        {formatOrderDateTime(orderedAt)}
      </Text>
      <Text
        style={[
          styles.storeName,
          {
            color: colors.text,
            fontSize: typography.size.xxl,
            lineHeight: 34,
          },
        ]}
        weight="extraBold"
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 8,
    paddingVertical: 12,
  },
  metaText: {
    letterSpacing: 0,
  },
  storeName: {
    letterSpacing: -0.48,
  },
});
