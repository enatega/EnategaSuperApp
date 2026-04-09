import React, { useState } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import ScreenHeader from "../../../../general/components/ScreenHeader";
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
import OrderDetailsStatusSection from "./OrderDetailsStatusSection";
import ExtendableOrderSummary from "../orderSummary/ExtendableOrderSummary";
import {
  formatCurrency,
} from "../../utils/orderDetails/orderDetailsUtils";
import ExtendableOrderItems from "../orderItems/ExtendableOrderItems";
import OrderDetailsSummaryRow from "./OrderDetailsSummaryRow";
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
  const { colors } = useTheme();
  useOrderStatusSocketSync(orderId);
  const orderDetailsQuery = useOrderDetails(orderId);
  const orderAgainAction = useOrderAgainAction(orderDetailsQuery.data);
  const [isIncreaseTipVisible, setIsIncreaseTipVisible] = useState(false);
  const [tipAmount, setTipAmount] = useState("5.00");

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

  const order = orderDetailsQuery.data;
  const shouldShowRateOrder =
    order.status === "delivered" || order.status === "cancelled"; // in just delivered and cancelled cases for the time being
  const shouldShowTrackProgress = true; // in all cases for the time being
  const shouldShowOrderAgain = true; // in all cases for the time being
  const statusTone =
    order.status === "delivered"
      ? "success"
      : order.status === "cancelled" ||
          order.status === "rejected" ||
          order.status === "failed"
        ? "danger"
        : "warning";

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t("order_details_title")} />

      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <OrderDetailsHeroSection
          orderedAt={order.orderedAt}
          storeName={order.store.name}
          storeAddress={order.store.address}
        />

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <OrderDetailsStatusSection
          statusMessage={order.statusMessage}
          statusTitle={order.statusTitle}
          statusTone={statusTone}
        />

        {order.scheduledAt ? (
          <>
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <OrderDetailsScheduledSection scheduledAt={order.scheduledAt} />
          </>
        ) : null}

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <ExtendableOrderItems orderItems={order.orderItems} />

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <ExtendableOrderSummary
          deliveryDetails={order.deliveryDetails}
          summary={order.summary}
        />

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <OrderDetailsSection title={t("order_details_payment_details")}>
          <OrderDetailsSummaryRow
            label={order.paymentMethod || "-"}
            value={formatCurrency(order?.summary?.totalAmount)}
          />
        </OrderDetailsSection>

        <OrderDetailsActionsSection
          isOrderAgainLoading={orderAgainAction.isSubmitting}
          onIncreaseTip={() => setIsIncreaseTipVisible(true)}
          onOrderAgain={() => {
            void orderAgainAction.handleOrderAgain();
          }}
          shouldShowRateOrder={shouldShowRateOrder}
          shouldShowTrackProgress={shouldShowTrackProgress}
          shouldShowOrderAgain={shouldShowOrderAgain}
          navigation={navigation}
          orderId={order.orderId}
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
  content: {
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
  },
  screen: {
    flex: 1,
  },
});
