import React, { useEffect } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import ScreenHeader from "../../../../../general/components/ScreenHeader";
import { useTheme } from "../../../../../general/theme/theme";
import { useOrderDetails } from "../../../hooks";
import type { MultiVendorStackParamList } from "../../navigation/types";
import ExtendableOrderItems from "../orderItems/ExtendableOrderItems";
import ExtendableOrderSummary from "../orderSummary/ExtendableOrderSummary";
import { formatTrackingEta } from "../../utils/orderTracking/orderTrackingUtils";
import EstimatedTimeBanner from "./EstimatedTimeBanner";
import OrderTrackingErrorState from "./OrderTrackingErrorState";
import OrderTrackingInfoRow from "./OrderTrackingInfoRow";
import OrderTrackingLoadingSkeleton from "./OrderTrackingLoadingSkeleton";
import OrderTrackingTimelineSection from "./OrderTrackingTimelineSection";
import OrderDetailsSection from "../orderDetails/OrderDetailsSection";
import OrderDetailsSummaryRow from "../orderDetails/OrderDetailsSummaryRow";
import { formatCurrency } from "../../utils/orderDetails/orderDetailsUtils";

type Props = {
  navigation: NativeStackNavigationProp<
    MultiVendorStackParamList,
    "OrderTrackingScreen"
  >;
  orderId: string;
};

export default function MainContainer({ navigation, orderId }: Props) {
  const { t } = useTranslation("deliveries");
  const { colors } = useTheme();
  const orderDetailsQuery = useOrderDetails(orderId);
  const riderId =
    typeof orderDetailsQuery.data?.rider?.userId === "string"
      ? orderDetailsQuery.data.rider.userId
      : orderDetailsQuery.data?.rider?.id;
  const riderName =
    orderDetailsQuery.data?.rider?.name
    || t("ride_active_driver_fallback", { ns: "rideSharing", defaultValue: "Rider" });
  const riderAvatarUri =
    typeof orderDetailsQuery.data?.rider?.profile === "string"
      ? orderDetailsQuery.data.rider.profile
      : typeof orderDetailsQuery.data?.rider?.image === "string"
        ? orderDetailsQuery.data.rider.image
        : undefined;
  const chatBoxId = orderDetailsQuery.data?.chatBoxId;
  const estimatedMinutes = Number(orderDetailsQuery.data?.store.estimatedDeliveryTime) || 0;

  useEffect(() => {
    console.log("OrderTracking MainContainer data", {
      orderId,
      orderData: orderDetailsQuery.data,
      rider: orderDetailsQuery.data?.rider,
      riderId: orderDetailsQuery.data?.rider?.id,
      riderUserId: orderDetailsQuery.data?.rider?.userId,
      chatReceiverId: riderId,
      chatBoxId,
      deliveryDetails: orderDetailsQuery.data?.deliveryDetails,
      status: orderDetailsQuery.data?.status,
    });
  }, [chatBoxId, orderDetailsQuery.data, orderId, riderId]);

  const helpButton = (
    <Pressable
      accessibilityLabel={t("order_tracking_help")}
      accessibilityRole="button"
      hitSlop={8}
      onPress={() => navigation.navigate("Support")}
      style={({ pressed }) => [
        styles.helpButton,
        {
          backgroundColor: colors.backgroundTertiary,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Ionicons color={colors.text} name="help-circle-outline" size={22} />
    </Pressable>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader
        rightSlot={helpButton}
        title={t("order_tracking_title")}
        variant="close"
      />

      {orderDetailsQuery.isLoading ? (
        <OrderTrackingLoadingSkeleton />
      ) : orderDetailsQuery.isError || !orderDetailsQuery.data ? (
        <OrderTrackingErrorState
          isRetrying={orderDetailsQuery.isFetching}
          onRetry={() => {
            void orderDetailsQuery.refetch();
          }}
        />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
          >
            <EstimatedTimeBanner
              etaLabel={t("order_tracking_eta_label")}
              etaValue={formatTrackingEta(
                orderDetailsQuery.data.store.estimatedDeliveryTime,
                orderDetailsQuery.data.scheduledAt,
              )}
            />

            <OrderTrackingTimelineSection
              timeline={orderDetailsQuery.data.timeline}
            />

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            <OrderTrackingInfoRow
              iconName="home-outline"
              onPress={() =>
                navigation.navigate("OrderDetailsScreen", { orderId })
              }
              subtitle={
                orderDetailsQuery.data.deliveryDetails.address ?? undefined
              }
              title={
                orderDetailsQuery.data.deliveryDetails.label ||
                t("order_tracking_delivery_details")
              }
            />

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            <OrderTrackingInfoRow
              iconName="chatbubbles-outline"
              onPress={() => {
                if (!riderId) {
                  console.log("OrderTracking missing riderId for chat", {
                    orderId,
                    rider: orderDetailsQuery.data?.rider,
                  });
                  return;
                }

                navigation.navigate("RiderChat", {
                  chatBoxId,
                  estimatedMinutes,
                  orderCode: orderDetailsQuery.data?.summary.orderNumber || orderId,
                  receiverId: riderId,
                  riderAvatarUri,
                  riderName,
                });
              }}
              subtitle={t("order_tracking_contact_subtitle")}
              title={t("order_tracking_contact_title")}
            />

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            <ExtendableOrderItems
              orderItems={orderDetailsQuery.data.orderItems}
            />
            <ExtendableOrderSummary
              deliveryDetails={orderDetailsQuery.data.deliveryDetails}
              summary={orderDetailsQuery.data.summary}
            />

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            <OrderDetailsSection title={t("order_details_payment_details")}>
              <OrderDetailsSummaryRow
                label={orderDetailsQuery?.data?.paymentMethod || "-"}
                value={formatCurrency(
                  orderDetailsQuery?.data?.summary?.totalAmount,
                )}
              />
            </OrderDetailsSection>
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
  },
  helpButton: {
    alignItems: "center",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  screen: {
    flex: 1,
  },
});
