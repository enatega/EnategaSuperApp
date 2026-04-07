import React, { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Image, Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import type { DeliveryOrderItems } from "../../api/ordersServiceTypes";
import OrderDetailsSection from "../orderDetails/OrderDetailsSection";
import OrderDetailsProductCard from "../orderDetails/OrderDetailsProductCard";
import { formatCurrency } from "../../utils/orderDetails/orderDetailsUtils";
import {
  getOrderPreviewImages,
  getProductAddonLines,
  getRemainingOrderItemsCount,
} from "../../utils/orderItems/orderItemsUtils";
import { styles } from "./ExtendableOrderItems.styles";

type Props = {
  collapsedVariant?: "default" | "tracking";
  defaultExpanded?: boolean;
  isCollapsible?: boolean;
  orderItems: DeliveryOrderItems;
};

export default function ExtendableOrderItems({
  collapsedVariant = "default",
  defaultExpanded = false,
  isCollapsible = true,
  orderItems,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const previewImages = useMemo(
    () => getOrderPreviewImages(orderItems),
    [orderItems],
  );
  const remainingCount = useMemo(
    () => getRemainingOrderItemsCount(orderItems),
    [orderItems],
  );

  const detailsContent =
    orderItems.products.length > 0 ? (
      <FlatList
        data={orderItems.products}
        ItemSeparatorComponent={() => (
          <View
            style={[styles.separator, { backgroundColor: colors.border }]}
          />
        )}
        keyExtractor={(product, index) =>
          String(product.id ?? product.productId ?? `product-${index}`)
        }
        renderItem={({ item: product }) => (
          <OrderDetailsProductCard
            addonLines={getProductAddonLines(product)}
            imageUri={product.image}
            name={
              product.name ||
              orderItems.summaryLabel ||
              t("order_details_empty_items")
            }
            priceLabel={
              typeof (
                product.price ??
                product.unitPrice ??
                product.totalPrice
              ) === "number"
                ? formatCurrency(
                    product.price ?? product.unitPrice ?? product.totalPrice,
                  )
                : null
            }
            quantityLabel={t("order_details_quantity_one", {
              count: product.quantity ?? 0,
            })}
            subtitle={
              product.note ||
              product.description ||
              product.specialInstructions ||
              null
            }
          />
        )}
        scrollEnabled={false}
      />
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
    );

  const sectionContent = (
    <>
      {isCollapsible ? (
        <View style={styles.trackingWrapper}>
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => setIsExpanded((previousState) => !previousState)}
            style={[
              styles.trackingHeader,
              collapsedVariant === "tracking" && styles.trackingHeaderCompact,
            ]}
          >
            <View style={styles.previewGroup}>
              {previewImages.map((imageUri, index) => (
                <Image
                  key={`${imageUri}-${index}`}
                  source={{ uri: imageUri }}
                  style={[
                    styles.previewImage,
                    collapsedVariant === "tracking" && styles.previewImageCompact,
                    {
                      borderColor: colors.background,
                      marginLeft:
                        index === 0
                          ? 0
                          : collapsedVariant === "tracking"
                            ? -12
                            : -10,
                    },
                  ]}
                />
              ))}
              {remainingCount > 0 ? (
                <View
                  style={[
                    styles.countBadge,
                    collapsedVariant === "tracking" && styles.countBadgeCompact,
                    {
                      backgroundColor: colors.backgroundTertiary,
                      borderColor: colors.background,
                      marginLeft:
                        previewImages.length === 0
                          ? 0
                          : collapsedVariant === "tracking"
                            ? -12
                            : -10,
                    },
                  ]}
                >
                  <Text
                    color={colors.text}
                    style={{
                      fontSize: typography.size.xs2,
                      lineHeight: typography.lineHeight.sm,
                    }}
                    weight="semiBold"
                  >
                    +{remainingCount}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={styles.headerContent}>
              <Text
                color={colors.text}
                numberOfLines={1}
                style={{
                  fontSize:
                    collapsedVariant === "tracking"
                      ? typography.size.md2
                      : typography.size.md2,
                  lineHeight: typography.lineHeight.md,
                }}
                weight={collapsedVariant === "tracking" ? "medium" : "semiBold"}
              >
                {orderItems.summaryLabel || t("order_details_empty_items")}
              </Text>
            </View>

            <Ionicons
              color={colors.iconMuted}
              name={
                collapsedVariant === "tracking"
                  ? isExpanded
                    ? "chevron-down"
                    : "chevron-forward"
                  : isExpanded
                    ? "chevron-up"
                    : "chevron-down"
              }
              size={20}
            />
          </Pressable>

          {isExpanded ? (
            <View
              style={[
                styles.expandedContent,
                { borderTopColor: colors.border },
              ]}
            >
              {detailsContent}
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.staticContent}>{detailsContent}</View>
      )}
    </>
  );

  if (collapsedVariant === "tracking") {
    return (
      <View style={styles.compactSection}>
        <Text
          color={colors.text}
          style={{
            fontSize: typography.size.xl2,
            lineHeight: typography.lineHeight.xl2,
          }}
          weight="semiBold"
        >
          {t("order_details_items")}
        </Text>
        {sectionContent}
      </View>
    );
  }

  return (
    <OrderDetailsSection title={t("order_details_items")}>
      {sectionContent}
    </OrderDetailsSection>
  );
}
