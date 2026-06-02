import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import Map from "../../../../general/components/Map";
import ScreenHeader from "../../../../general/components/ScreenHeader";
import { useTheme } from "../../../../general/theme/theme";
import ExtendableOrderItems from "../orderItems/ExtendableOrderItems";
import OrderDetailsSection from "../orderDetails/OrderDetailsSection";
import OrderDetailsSummaryRow from "../orderDetails/OrderDetailsSummaryRow";
import ExtendableOrderSummary from "../orderSummary/ExtendableOrderSummary";
import { formatTrackingEta } from "../../utils/orderTracking/orderTrackingUtils";
import DeliveredStatusBanner from "./DeliveredStatusBanner";
import EstimatedTimeBanner from "./EstimatedTimeBanner";
import OrderTrackingErrorState from "./OrderTrackingErrorState";
import OrderTrackingInfoRow from "./OrderTrackingInfoRow";
import OrderTrackingLoadingSkeleton from "./OrderTrackingLoadingSkeleton";
import OrderTrackingTimelineSection from "./OrderTrackingTimelineSection";
import type { OrderTrackingViewModel } from "./useOrderTrackingViewModel";

type Props = {
  viewModel: OrderTrackingViewModel;
};

export default function OrderTrackingLegacyView({ viewModel }: Props) {
  const { t } = useTranslation("deliveries");
  const { colors } = useTheme();
  const { order, orderDetailsQuery } = viewModel;

  const helpButton = (
    <Pressable
      accessibilityLabel={t("order_tracking_help")}
      accessibilityRole="button"
      hitSlop={8}
      onPress={viewModel.helpPress}
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
      <ScreenHeader rightSlot={helpButton} title={t("order_tracking_title")} variant="close" />
      {orderDetailsQuery.isLoading ? (
        <OrderTrackingLoadingSkeleton />
      ) : orderDetailsQuery.isError || !order ? (
        <OrderTrackingErrorState
          isRetrying={orderDetailsQuery.isFetching}
          onRetry={() => {
            void orderDetailsQuery.refetch();
          }}
        />
      ) : (
        <View style={styles.screen}>
          <ScrollView
            contentContainerStyle={styles.content}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
          >
            {viewModel.isDelivered ? (
              <DeliveredStatusBanner
                messageLineOne={t("order_tracking_delivered_message_line_one")}
                messageLineTwo={t("order_tracking_delivered_message_line_two")}
                title={t("order_tracking_delivered_title")}
              />
            ) : (
              <EstimatedTimeBanner
                etaLabel={t("order_tracking_eta_label")}
                etaValue={formatTrackingEta(order.store.estimatedDeliveryTime, order.scheduledAt)}
              />
            )}

            {!viewModel.isDelivered ? (
              <OrderTrackingTimelineSection orderLogs={order.orderLogs} timeline={order.timeline} />
            ) : null}

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <OrderDetailsSection
              title={t(
                order.orderType === "pickup"
                  ? "order_tracking_collection_details"
                  : "order_tracking_delivery_details",
              )}
            >
              <View
                style={[
                  styles.mapCard,
                  {
                    backgroundColor: colors.backgroundTertiary,
                    borderColor: colors.border,
                  },
                ]}
              >
                {viewModel.mapRegion ? (
                  <Map
                    loadingEnabled
                    markers={viewModel.mapMarkers}
                    polylines={viewModel.mapPolylines}
                    region={viewModel.mapRegion}
                    rotateEnabled={false}
                    scrollEnabled
                    style={styles.map}
                    useGoogleProvider
                    zoomEnabled
                    zoomTapEnabled
                  />
                ) : null}

                <View
                  style={[
                    styles.mapOverlay,
                    {
                      backgroundColor: colors.surfaceSoft,
                      borderColor: colors.border,
                      shadowColor: colors.shadowColor,
                    },
                  ]}
                >
                  <OrderTrackingInfoRow
                    containerStyle={styles.mapInfoRow}
                    iconName={order.orderType === "pickup" ? "storefront-outline" : "home-outline"}
                    iconWrapperStyle={styles.mapInfoIcon}
                    isCompact
                    isIconContained={false}
                    onPress={viewModel.onOpenOrderDetails}
                    subtitle={getMapSubtitle(order)}
                    title={getMapTitle(
                      order,
                      t(
                        order.orderType === "pickup"
                          ? "order_tracking_collection_details"
                          : "order_tracking_delivery_details",
                      ),
                    )}
                    trailingIconName="chevron-up"
                  />
                </View>
              </View>
            </OrderDetailsSection>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            {viewModel.canContactCourier ? (
              <>
                <OrderTrackingInfoRow
                  iconName="chatbox-ellipses-outline"
                  isCompact
                  isIconContained={false}
                  onPress={viewModel.onContactCourierPress}
                  subtitle={t("order_tracking_contact_subtitle")}
                  title={t("order_tracking_contact_title")}
                />

                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              </>
            ) : null}

            <ExtendableOrderItems
              collapsedVariant="tracking"
              defaultExpanded
              orderItems={order.orderItems}
            />

            {viewModel.shouldShowNotes ? (
              <>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <OrderDetailsSection title={t("order_details_notes")}>
                  {viewModel.restaurantNote ? (
                    <OrderDetailsSummaryRow
                      label={t("order_details_restaurant_note")}
                      value={viewModel.restaurantNote}
                    />
                  ) : null}
                  {viewModel.courierNote ? (
                    <OrderDetailsSummaryRow
                      label={t("order_details_courier_note")}
                      value={viewModel.courierNote}
                    />
                  ) : null}
                </OrderDetailsSection>
              </>
            ) : null}
          </ScrollView>

          <ExtendableOrderSummary
            deliveryDetails={order.deliveryDetails}
            layout="footer"
            orderCode={order.orderCode}
            orderId={order.orderId}
            summary={order.summary}
            title={t("order_tracking_summary")}
          />
        </View>
      )}
    </View>
  );
}

function getMapTitle(order: OrderTrackingViewModel["order"], fallbackTitle: string) {
  if (!order) {
    return fallbackTitle;
  }

  if (order.orderType === "pickup") {
    return order.store.name || fallbackTitle;
  }

  return order.deliveryDetails.label || fallbackTitle;
}

function getMapSubtitle(order: NonNullable<OrderTrackingViewModel["order"]>) {
  if (order.orderType === "pickup") {
    return order.store.address ?? undefined;
  }

  return order.deliveryDetails.address ?? undefined;
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
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
  map: {
    borderRadius: 6,
  },
  mapCard: {
    borderRadius: 6,
    borderWidth: 1,
    height: 248,
    overflow: "hidden",
    position: "relative",
  },
  mapInfoIcon: {
    marginTop: 2,
  },
  mapInfoRow: {
    paddingVertical: 0,
  },
  mapOverlay: {
    borderBottomWidth: 1,
    elevation: 2,
    left: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: "absolute",
    right: 0,
    top: 0,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
  },
  screen: {
    flex: 1,
  },
});
