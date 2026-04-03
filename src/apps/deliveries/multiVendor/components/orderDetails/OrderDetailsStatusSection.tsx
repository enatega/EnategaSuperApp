import React from "react";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import OrderDetailsSection from "./OrderDetailsSection";
import OrderDetailsStatusBadge from "./OrderDetailsStatusBadge";

type Props = {
  statusTitle: string;
  statusMessage: string;
  statusTone: "warning" | "success" | "danger";
};

export default function OrderDetailsStatusSection({
  statusTitle,
  statusMessage,
  statusTone,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();

  return (
    <OrderDetailsSection title={t("order_details_status")}>
      <OrderDetailsStatusBadge label={statusTitle} tone={statusTone} />
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
        {statusMessage}
      </Text>
    </OrderDetailsSection>
  );
}

const styles = StyleSheet.create({
  metaText: {
    letterSpacing: 0,
  },
});
