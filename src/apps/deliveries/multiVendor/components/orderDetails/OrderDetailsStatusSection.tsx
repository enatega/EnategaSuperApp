import React from "react";
import { useTranslation } from "react-i18next";
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

  return (
    <OrderDetailsSection
      subtitle={statusMessage}
      title={t("order_details_status")}
    >
      <OrderDetailsStatusBadge label={statusTitle} tone={statusTone} />
    </OrderDetailsSection>
  );
}
