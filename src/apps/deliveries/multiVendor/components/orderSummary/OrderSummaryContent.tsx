import React from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../../general/theme/theme";
import type {
  DeliveryOrderDeliveryDetails,
  DeliveryOrderSummary,
} from "../../../api/ordersServiceTypes";
import OrderDetailsSummaryRow from "../orderDetails/OrderDetailsSummaryRow";
import { formatCurrency } from "../../utils/orderDetails/orderDetailsUtils";

type Props = {
  deliveryDetails: DeliveryOrderDeliveryDetails;
  summary: DeliveryOrderSummary;
};

export default function OrderSummaryContent({
  deliveryDetails,
  summary,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <OrderDetailsSummaryRow
        label={t("order_details_order_number")}
        value={summary.orderNumber}
      />
      <OrderDetailsSummaryRow
        label={t("order_details_delivery_address")}
        value={deliveryDetails.address || "-"}
      />
      <OrderDetailsSummaryRow
        label={t("order_details_item_subtotal")}
        value={formatCurrency(summary.itemSubtotal)}
      />
      {summary.discountAmount > 0 ? (
        <OrderDetailsSummaryRow
          label={t("order_details_discount")}
          value={formatCurrency(summary.discountAmount)}
        />
      ) : null}
      <OrderDetailsSummaryRow
        label={t("order_details_tax")}
        value={formatCurrency(summary.taxAmount)}
      />
      <OrderDetailsSummaryRow
        label={t("order_details_packing_charges")}
        value={formatCurrency(summary.packingCharges)}
      />
      <OrderDetailsSummaryRow
        label={t("order_details_delivery_fee")}
        value={formatCurrency(summary.deliveryFee)}
      />
      <OrderDetailsSummaryRow
        label={t("order_details_courier_tip")}
        value={formatCurrency(summary.courierTip)}
      />
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <OrderDetailsSummaryRow
        isEmphasized
        label={t("order_details_total_amount")}
        value={formatCurrency(summary.totalAmount)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
});
