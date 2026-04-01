import React from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import Button from "../../../../../general/components/Button";
import { useTheme } from "../../../../../general/theme/theme";
import type { ActiveOrderSummary } from "../../../api/ordersServiceTypes";
import type { MultiVendorStackParamList } from "../../navigation/types";
import OrderDetailsSection from "./OrderDetailsSection";
import OrderDetailsSummaryRow from "./OrderDetailsSummaryRow";
import { formatCurrency } from "../../utils/orderDetails/orderDetailsUtils";

type Props = {
  navigation: NativeStackNavigationProp<
    MultiVendorStackParamList,
    "OrderDetailsScreen"
  >;
  isScheduledOrder: boolean;
  orderId: string;
  paymentMethod: string;
  showTrackProgress: boolean;
  storeName: string;
  summary: ActiveOrderSummary;
  onIncreaseTipPress: () => void;
};

export default function OrderDetailsActionsSection({
  navigation,
  isScheduledOrder,
  orderId,
  paymentMethod,
  showTrackProgress,
  storeName,
  summary,
  onIncreaseTipPress,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors } = useTheme();

  return (
    <OrderDetailsSection title={t("order_details_payment_details")}>
      <OrderDetailsSummaryRow
        label={paymentMethod || "-"}
        value={formatCurrency(summary.totalAmount)}
      />

      {!isScheduledOrder ? (
        <Button
          label={t("order_details_rate_order")}
          onPress={() => {
            navigation.navigate("RateOrder", {
              orderId,
              storeName,
            });
          }}
          style={{
            marginTop: 4,
            backgroundColor: colors.blue100,
            borderColor: colors.blue100,
          }}
        />
      ) : null}
      <Button
        label={t("order_details_increase_tip")}
        onPress={onIncreaseTipPress}
        style={{
          marginTop: 4,
          backgroundColor: colors.blue100,
          borderColor: colors.blue100,
        }}
      />
      {showTrackProgress ? (
        <Button
          label={t("order_details_track_progress")}
          onPress={() => navigation.navigate("OrderTrackingScreen", { orderId })}
        />
      ) : null}
      {isScheduledOrder ? (
        <Button
          label={t("order_details_order_again")}
          onPress={() => undefined}
        />
      ) : null}
    </OrderDetailsSection>
  );
}
