import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import type {
  DeliveryOrderDeliveryDetails,
  DeliveryOrderSummary,
} from "../../../api/ordersServiceTypes";
import OrderDetailsSection from "../orderDetails/OrderDetailsSection";
import { formatCurrency } from "../../utils/orderDetails/orderDetailsUtils";
import OrderSummaryContent from "./OrderSummaryContent";
import { styles } from "./ExtendableOrderSummary.styles";

type Props = {
  deliveryDetails: DeliveryOrderDeliveryDetails;
  summary: DeliveryOrderSummary;
};

export default function ExtendableOrderSummary({
  deliveryDetails,
  summary,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const title = t("order_details_summary");
  const note =
    summary.note || t("order_tracking_summary_note");

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
          },
        ]}
      >
        <View style={styles.leftContent}>
          {note ? (
            <Text color={colors.mutedText} weight="medium">
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
