import React from "react";
import type {
  ActiveOrderDeliveryDetails,
  ActiveOrderSummary,
} from "../../../api/ordersServiceTypes";
import ExtendableOrderSummary from "../orderSummary/ExtendableOrderSummary";

type Props = {
  deliveryDetails: ActiveOrderDeliveryDetails;
  summary: ActiveOrderSummary;
};

export default function OrderDetailsSummarySection({
  deliveryDetails,
  summary,
}: Props) {
  return (
    <ExtendableOrderSummary
      deliveryDetails={deliveryDetails}
      summary={summary}
      variant="details"
    />
  );
}
