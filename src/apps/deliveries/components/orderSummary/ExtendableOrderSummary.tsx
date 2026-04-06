import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import type {
  DeliveryOrderDeliveryDetails,
  DeliveryOrderSummary,
} from "../../api/ordersServiceTypes";
import OrderDetailsSection from "../orderDetails/OrderDetailsSection";
import { formatCurrency } from "../../utils/orderDetails/orderDetailsUtils";
import OrderSummaryContent from "./OrderSummaryContent";
import { styles } from "./ExtendableOrderSummary.styles";

type Props = {
  defaultExpanded?: boolean;
  deliveryDetails: DeliveryOrderDeliveryDetails;
  isCollapsible?: boolean;
  layout?: "section" | "footer";
  summary: DeliveryOrderSummary;
  title?: string;
};

export default function ExtendableOrderSummary({
  defaultExpanded = false,
  deliveryDetails,
  isCollapsible = true,
  layout = "section",
  summary,
  title: titleProp,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const title = titleProp || t("order_details_summary");
  const note = summary.note || t("order_tracking_summary_note");

  if (layout === "footer") {
    return (
      <View
        style={[
          styles.footerContainer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        {isExpanded ? (
          <View
            style={[
              styles.footerExpandedPanel,
              {
                borderBottomColor: colors.border,
              },
            ]}
          >
            <OrderSummaryContent
              deliveryDetails={deliveryDetails}
              summary={summary}
            />
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => setIsExpanded((previousState) => !previousState)}
          style={styles.footerBar}
        >
          <View style={styles.footerBarHeader}>
            <View style={styles.footerBarTitleRow}>
              <Text
                color={colors.text}
                style={{
                  fontSize: typography.size.xl2,
                  lineHeight: typography.lineHeight.xl2,
                }}
                weight="semiBold"
              >
                {title}
              </Text>
              <Ionicons
                color={colors.iconMuted}
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={20}
              />
            </View>

            <Text
              color={colors.text}
              style={{
                fontSize: typography.size.md2,
                lineHeight: typography.lineHeight.md,
              }}
              weight="semiBold"
            >
              {formatCurrency(summary.totalAmount)}
            </Text>
          </View>

          {note ? (
            <Text color={colors.mutedText} weight="medium">
              {note}
            </Text>
          ) : null}
        </Pressable>
      </View>
    );
  }

  return (
    <OrderDetailsSection title={title}>
      {isCollapsible ? (
        <>
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
        </>
      ) : (
        <View style={styles.staticContent}>
          {note ? (
            <Text color={colors.mutedText} weight="medium">
              {note}
            </Text>
          ) : null}
          <OrderSummaryContent
            deliveryDetails={deliveryDetails}
            summary={summary}
          />
        </View>
      )}
    </OrderDetailsSection>
  );
}
