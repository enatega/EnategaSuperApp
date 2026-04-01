import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import type {
  ActiveOrderDeliveryDetails,
  ActiveOrderSummary,
} from "../../../api/ordersServiceTypes";
import OrderDetailsSection from "../orderDetails/OrderDetailsSection";
import { formatCurrency } from "../../utils/orderDetails/orderDetailsUtils";
import OrderSummaryContent from "./OrderSummaryContent";
import { styles } from "./ExtendableOrderSummary.styles";

type Props = {
  deliveryDetails: ActiveOrderDeliveryDetails;
  summary: ActiveOrderSummary;
  variant: "details" | "tracking";
  layout?: "inline" | "footer";
};

export default function ExtendableOrderSummary({
  deliveryDetails,
  summary,
  variant,
  layout,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();
  const resolvedLayout =
    layout ?? (variant === "tracking" ? "footer" : "inline");
  const [isExpanded, setIsExpanded] = useState(resolvedLayout === "inline");
  const title =
    variant === "tracking"
      ? t("order_tracking_summary")
      : t("order_details_summary");
  const note =
    summary.note ||
    (variant === "tracking" ? t("order_tracking_summary_note") : null);

  if (resolvedLayout === "inline") {
    return (
      <OrderDetailsSection subtitle={note} title={title}>
        <OrderSummaryContent
          deliveryDetails={deliveryDetails}
          summary={summary}
        />
      </OrderDetailsSection>
    );
  }

  return (
    <OrderDetailsSection title={title}>
      <Pressable
        accessibilityRole="button"
        hitSlop={8}
        onPress={() => setIsExpanded((previousState) => !previousState)}
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.leftContent}>
          {note ? (
            <Text color={colors.mutedText} style={styles.note} weight="medium">
              {note}
            </Text>
          ) : null}
        </View>

        <View style={styles.rightContent}>
          <Text
            color={colors.text}
            style={{
              fontSize: typography.size.lg,
              lineHeight: typography.lineHeight.lg,
            }}
            weight="bold"
          >
            {formatCurrency(summary.totalAmount)}
          </Text>
          <Ionicons
            color={colors.iconMuted}
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={18}
          />
        </View>
      </Pressable>

      {isExpanded ? (
        <View
          style={[
            styles.expandedPanel,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}
        >
          <OrderSummaryContent
            deliveryDetails={deliveryDetails}
            summary={summary}
          />
        </View>
      ) : null}
    </OrderDetailsSection>
  );
}
