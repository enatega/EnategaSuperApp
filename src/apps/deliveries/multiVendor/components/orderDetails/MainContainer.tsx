import React, { useState } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import ScreenHeader from "../../../../../general/components/ScreenHeader";
import { useTheme } from "../../../../../general/theme/theme";
import { useOrderDetails } from "../../../hooks";
import type { MultiVendorStackParamList } from "../../navigation/types";
import OrderDetailsErrorState from "./OrderDetailsErrorState";
import OrderDetailsActionsSection from "./OrderDetailsActionsSection";
import OrderDetailsHeroSection from "./OrderDetailsHeroSection";
import IncreaseTipBottomSheet from "./IncreaseTipBottomSheet";
import OrderDetailsLoadingSkeleton from "./OrderDetailsLoadingSkeleton";
import OrderDetailsScheduledSection from "./OrderDetailsScheduledSection";
import OrderDetailsStatusSection from "./OrderDetailsStatusSection";
import ExtendableOrderSummary from "../orderSummary/ExtendableOrderSummary";
import { TERMINAL_STATUSES } from "../../utils/orderDetails/orderDetailsUtils";
import ExtendableOrderItems from "../orderItems/ExtendableOrderItems";

type Props = {
  navigation: NativeStackNavigationProp<
    MultiVendorStackParamList,
    "OrderDetailsScreen"
  >;
  orderId: string;
};

export default function MainContainer({ navigation, orderId }: Props) {
  const { t } = useTranslation("deliveries");
  const { colors } = useTheme();
  const orderDetailsQuery = useOrderDetails(orderId);
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
  const shouldShowRateOrder = order?.status === "delivered" || order?.status === "cancelled"
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

        <ExtendableOrderItems
          orderItems={orderDetailsQuery.data.orderItems}
          variant="tracking"
        />

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <ExtendableOrderSummary
          deliveryDetails={order.deliveryDetails}
          layout="footer"
          summary={order.summary}
          variant="details"
        />

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <OrderDetailsActionsSection
          shouldShowRateOrder={shouldShowRateOrder}
          navigation={navigation}
          onIncreaseTipPress={() => setIsIncreaseTipVisible(true)}
          orderId={order.orderId}
          paymentMethod={order.paymentMethod}
          storeName={order.store.name}
          summary={order.summary}
        />
      </ScrollView>

      <IncreaseTipBottomSheet
        isVisible={isIncreaseTipVisible}
        onChangeTipAmount={setTipAmount}
        onClose={() => setIsIncreaseTipVisible(false)}
        onDone={() => setIsIncreaseTipVisible(false)}
        tipAmount={tipAmount}
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
