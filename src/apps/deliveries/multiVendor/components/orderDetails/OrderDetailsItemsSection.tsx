import React from "react";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import type { ActiveOrderItems } from "../../../api/ordersServiceTypes";
import OrderDetailsProductCard from "./OrderDetailsProductCard";
import OrderDetailsSection from "./OrderDetailsSection";
import { formatCurrency } from "../../utils/orderDetails/orderDetailsUtils";

type Props = {
  orderItems: ActiveOrderItems;
};

export default function OrderDetailsItemsSection({ orderItems }: Props) {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();

  return (
    <OrderDetailsSection title={t("order_details_items")}>
      {orderItems.products.length > 0 ? (
        orderItems.products.map((product, index) => (
          <OrderDetailsProductCard
            key={String(product.id ?? product.productId ?? `product-${index}`)}
            imageUri={product.image}
            name={
              product.name ||
              orderItems.summaryLabel ||
              t("order_details_empty_items")
            }
            priceLabel={
              typeof (product.price ?? product.unitPrice ?? product.totalPrice) ===
              "number"
                ? formatCurrency(
                    product.price ?? product.unitPrice ?? product.totalPrice,
                  )
                : null
            }
            quantityLabel={t("order_details_quantity", {
              count: product.quantity ?? 0,
            })}
            subtitle={
              product.note ||
              product.description ||
              product.specialInstructions ||
              null
            }
          />
        ))
      ) : (
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
          {orderItems.summaryLabel || t("order_details_empty_items")}
        </Text>
      )}
    </OrderDetailsSection>
  );
}

const styles = StyleSheet.create({
  metaText: {
    letterSpacing: 0,
  },
});
