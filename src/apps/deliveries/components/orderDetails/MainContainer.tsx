import React, { useMemo, useState } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import ScreenHeader from "../../../../general/components/ScreenHeader";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import {
  useOrderAgainAction,
  useOrderDetails,
  useOrderStatusSocketSync,
} from "../../hooks";
import type { DeliveriesStackParamList } from "../../navigation/types";
import OrderDetailsErrorState from "./OrderDetailsErrorState";
import OrderDetailsActionsSection from "./OrderDetailsActionsSection";
import OrderDetailsHeroSection from "./OrderDetailsHeroSection";
import IncreaseTipBottomSheet from "./IncreaseTipBottomSheet";
import OrderDetailsLoadingSkeleton from "./OrderDetailsLoadingSkeleton";
import OrderDetailsScheduledSection from "./OrderDetailsScheduledSection";
import ExtendableOrderSummary from "../orderSummary/ExtendableOrderSummary";
import {
  formatCurrency,
} from "../../utils/orderDetails/orderDetailsUtils";
import ExtendableOrderItems from "../orderItems/ExtendableOrderItems";
import OrderDetailsSection from "./OrderDetailsSection";
import CartStoreConflictModal from "../cart/CartStoreConflictModal";

type Props = {
  navigation: NativeStackNavigationProp<
    DeliveriesStackParamList,
    "OrderDetailsScreen"
  >;
  orderId: string;
};

export default function MainContainer({ navigation, orderId }: Props) {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();
  useOrderStatusSocketSync(orderId);
  const orderDetailsQuery = useOrderDetails(orderId);
  const orderAgainAction = useOrderAgainAction(orderDetailsQuery.data);
  const [isIncreaseTipVisible, setIsIncreaseTipVisible] = useState(false);
  const [tipAmount, setTipAmount] = useState("5.00");
  const order = orderDetailsQuery.data;
  const normalizedOrderCode = useMemo(() => {
    const rawCode =
      order?.orderCode?.trim() ||
      order?.summary.orderNumber?.trim() ||
      order?.orderId;

    if (!rawCode) {
      return null;
    }

    const cleanedCode = rawCode
      .replace(/^order\s*#*\s*/i, "")
      .replace(/^#+\s*/, "")
      .trim();

    if (!cleanedCode) {
      return null;
    }

    return `ORDER #${cleanedCode}`;
  }, [order?.orderCode, order?.orderId, order?.summary.orderNumber]);
  const paymentMethodLabel = useMemo(() => {
    const value = order?.paymentMethod?.trim();

    if (!value) {
      return "-";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
  }, [order?.paymentMethod]);
  const isPaid = order?.paymentStatus?.trim().toLowerCase() === "paid";

  if (orderDetailsQuery.isLoading) {
    return <OrderDetailsLoadingSkeleton />;
  }

  if (orderDetailsQuery.isError || !orderDetailsQuery.data) {
    return (
      <OrderDetailsErrorState
        isRetrying={orderDetailsQuery.isFetching}
        onRetry={() => {
          void orderDetailsQuery.refetch();
        }}
      />
    );
  }

  const isPastOrder =
    order.status === "delivered"
    || order.status === "cancelled"
    || order.status === "rejected"
    || order.status === "failed";
  const shouldShowRateOrder =
    order.status === "delivered" || order.status === "cancelled"; // in just delivered and cancelled cases for the time being
  const shouldShowTrackProgress = !isPastOrder;
  const shouldShowIncreaseTip = !isPastOrder;
  const shouldShowOrderAgain = true; // in all cases for the time being
  const statusTone =
    order.status === "delivered"
      ? "success"
      : order.status === "cancelled" ||
        order.status === "rejected" ||
        order.status === "failed"
        ? "danger"
        : "warning";

  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: colors.shadowColor,
    },
  ] as const;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t("order_details_title")} />

      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View style={cardStyle}>
          <OrderDetailsHeroSection
            logoUri={order.store.logo ?? order.store.image}
            orderCode={normalizedOrderCode}
            orderedAt={order.orderedAt}
            storeName={order.store.name}
            storeAddress={order.store.address}
            statusMessage={order.statusMessage}
            statusTitle={order.statusTitle}
            statusTone={statusTone}
          />
        </View>

        {order.scheduledAt ? (
          <View style={cardStyle}>
            <OrderDetailsScheduledSection scheduledAt={order.scheduledAt} />
          </View>
        ) : null}

        <View style={cardStyle}>
          <ExtendableOrderItems orderItems={order.orderItems} />
        </View>

        <View style={cardStyle}>
          <ExtendableOrderSummary
            defaultExpanded
            deliveryDetails={order.deliveryDetails}
            isCollapsible={false}
            orderCode={order.orderCode}
            orderId={order.orderId}
            summary={order.summary}
          />
        </View>

        <View style={cardStyle}>
          <OrderDetailsSection title={t("order_details_payment_details")}>
            <View style={styles.paymentRow}>
              <View style={styles.paymentLeft}>
                <View
                  style={[
                    styles.paymentIconWrap,
                    { backgroundColor: colors.successSoft },
                  ]}
                >
                  <Ionicons color={colors.successText} name="wallet-outline" size={28} />
                </View>

                <View style={styles.paymentTextGroup}>
                  <Text
                    color={colors.mutedText}
                    style={{
                      fontSize: typography.size.md,
                      lineHeight: typography.lineHeight.md,
                    }}
                    weight="medium"
                  >
                    Payment Method
                  </Text>
                  <View style={styles.paymentValueRow}>
                    <Text
                      color={colors.text}
                      style={{
                        fontSize: typography.size.md,
                        lineHeight: typography.lineHeight.lg,
                      }}
                      weight="bold"
                    >
                      {paymentMethodLabel}
                    </Text>
                    <Text
                      color={colors.text}
                      style={{
                        fontSize: typography.size.md,
                        lineHeight: typography.lineHeight.md,
                      }}
                      weight="semiBold"
                    >
                      {formatCurrency(order?.summary?.totalAmount)}
                    </Text>
                  </View>

                  {isPaid ? (
                    <View
                      style={[
                        styles.paidBadge,
                        { backgroundColor: colors.successSoft },
                      ]}
                    >
                      <Text
                        color={colors.successText}
                        style={{
                          fontSize: typography.size.sm2,
                          lineHeight: typography.lineHeight.sm2,
                        }}
                        weight="semiBold"
                      >
                        Paid
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </OrderDetailsSection>
        </View>

        <OrderDetailsActionsSection
          isOrderAgainLoading={orderAgainAction.isSubmitting}
          onIncreaseTip={shouldShowIncreaseTip ? () => setIsIncreaseTipVisible(true) : undefined}
          onOrderAgain={() => {
            void orderAgainAction.handleOrderAgain();
          }}
          shouldShowRateOrder={shouldShowRateOrder}
          shouldShowTrackProgress={shouldShowTrackProgress}
          shouldShowOrderAgain={shouldShowOrderAgain}
          navigation={navigation}
          orderId={orderId}
          storeName={order.store.name}
        />
      </ScrollView>

      <IncreaseTipBottomSheet
        isVisible={isIncreaseTipVisible}
        onChangeTipAmount={setTipAmount}
        onClose={() => setIsIncreaseTipVisible(false)}
        onDone={() => setIsIncreaseTipVisible(false)}
        tipAmount={tipAmount}
      />

      <CartStoreConflictModal
        isSubmitting={orderAgainAction.conflictResolution.isResolving}
        onCancel={orderAgainAction.conflictResolution.cancelResolution}
        onConfirm={() => {
          void orderAgainAction.conflictResolution.confirmResolution();
        }}
        prompt={orderAgainAction.conflictResolution.prompt}
        visible={orderAgainAction.conflictResolution.isVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  content: {
    gap: 16,
    paddingBottom: 32,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  paidBadge: {
    borderRadius: 12,
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  paymentIconWrap: {
    alignItems: "center",
    borderRadius: 18,
    height: 64,
    justifyContent: "center",
    width: 64,
  },
  paymentLeft: {
    alignItems: "center",
    columnGap: 16,
    flex: 1,
    flexDirection: "row",
  },
  paymentRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  paymentTextGroup: {
    flex: 1,
    gap: 8,
  },
  paymentValueRow: {
    alignItems: "center",
    columnGap: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  screen: {
    flex: 1,
  },
});
