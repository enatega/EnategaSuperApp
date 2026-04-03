import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import OrderDetailsSection from "./OrderDetailsSection";
import { formatScheduledDateTime } from "../../utils/orderDetails/orderDetailsUtils";

type Props = {
  scheduledAt: string;
};


export default function OrderDetailsScheduledSection({ scheduledAt }: Props) {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();

  return (
    <OrderDetailsSection title={t("order_details_scheduled_for")}>
      <View style={styles.infoRow}>
        <Ionicons
          color={colors.iconMuted}
          name="calendar-outline"
          size={20}
        />
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
          {formatScheduledDateTime(scheduledAt)}
        </Text>
      </View>
    </OrderDetailsSection>
  );
}

const styles = StyleSheet.create({
  infoRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  metaText: {
    letterSpacing: 0,
  },
});
