import React, { useEffect, useMemo } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import type { LatLng, Region } from "react-native-maps";
import { useTranslation } from "react-i18next";

import Map, {
  type MapMarker,
  type MapPolyline,
} from "../../../../general/components/Map";
import ScreenHeader from "../../../../general/components/ScreenHeader";
import { useTheme } from "../../../../general/theme/theme";
import type {
  DeliveryOrderRider,
  OrderDetailsResponse,
} from "../../api/ordersServiceTypes";
import {
  useDeliveryRoutePath,
  useOrderDetails,
  useOrderRiderLocationSync,
  useOrderStatusSocketSync,
} from "../../hooks";
import type { DeliveriesStackParamList } from "../../navigation/types";
import ExtendableOrderItems from "../orderItems/ExtendableOrderItems";
import ExtendableOrderSummary from "../orderSummary/ExtendableOrderSummary";
import { formatTrackingEta } from "../../utils/orderTracking/orderTrackingUtils";
import EstimatedTimeBanner from "./EstimatedTimeBanner";
import OrderTrackingErrorState from "./OrderTrackingErrorState";
import OrderTrackingInfoRow from "./OrderTrackingInfoRow";
import OrderTrackingLoadingSkeleton from "./OrderTrackingLoadingSkeleton";
import OrderTrackingTimelineSection from "./OrderTrackingTimelineSection";
import OrderDetailsSection from "../orderDetails/OrderDetailsSection";

type Props = {
  navigation: NativeStackNavigationProp<
    DeliveriesStackParamList,
    "OrderTrackingScreen"
  >;
  orderId: string;
};

type TrackingCoordinates = {
  destination: LatLng | null;
  pickup: LatLng | null;
  rider: LatLng | null;
};

type RiderLocation = {
  latitude: number;
  longitude: number;
};

export default function MainContainer({ navigation, orderId }: Props) {
  const { t } = useTranslation("deliveries");
  const { colors } = useTheme();

  useOrderStatusSocketSync(orderId);

  const orderDetailsQuery = useOrderDetails(orderId);
  const riderId =
    typeof orderDetailsQuery.data?.rider?.userId === "string"
      ? orderDetailsQuery.data.rider.userId
      : orderDetailsQuery.data?.rider?.id;
  const riderName =
    orderDetailsQuery.data?.rider?.name ||
    t("ride_active_driver_fallback", {
      ns: "rideSharing",
      defaultValue: "Rider",
    });
  const riderAvatarUri =
    typeof orderDetailsQuery.data?.rider?.profile === "string"
      ? orderDetailsQuery.data.rider.profile
      : typeof orderDetailsQuery.data?.rider?.image === "string"
        ? orderDetailsQuery.data.rider.image
        : undefined;
  const chatBoxId = orderDetailsQuery.data?.chatBoxId;
  const estimatedMinutes =
    Number(orderDetailsQuery.data?.store.estimatedDeliveryTime) || 0;

  useEffect(() => {
    console.log("OrderTracking MainContainer data", {
      chatBoxId,
      chatReceiverId: riderId,
      deliveryDetails: orderDetailsQuery.data?.deliveryDetails,
      orderData: orderDetailsQuery.data,
      orderId,
      rider: orderDetailsQuery.data?.rider,
      riderId: orderDetailsQuery.data?.rider?.id,
      riderUserId: orderDetailsQuery.data?.rider?.userId,
      status: orderDetailsQuery.data?.status,
    });
  }, [chatBoxId, orderDetailsQuery.data, orderId, riderId]);
  const order = orderDetailsQuery.data;
  const riderLocation = useOrderRiderLocationSync(
    order?.orderType === "delivery" ? order?.rider?.userId ?? null : null,
    getOrderRiderLocation(order?.rider),
    { enabled: order?.orderType === "delivery" },
  );

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

  const mapCoordinates = useMemo(
    () =>
      getTrackingCoordinates(
        order?.orderType,
        order?.deliveryDetails.latitude ?? null,
        order?.deliveryDetails.longitude ?? null,
        order?.deliveryDetails.storeLatitude ?? null,
        order?.deliveryDetails.storeLongitude ?? null,
        riderLocation,
      ),
    [
      order?.orderType,
      order?.deliveryDetails.latitude,
      order?.deliveryDetails.longitude,
      order?.deliveryDetails.storeLatitude,
      order?.deliveryDetails.storeLongitude,
      riderLocation,
    ],
  );
  const mapRegion = useMemo(
    () => getTrackingMapRegion(mapCoordinates),
    [mapCoordinates],
  );
  const mapMarkers = useMemo<MapMarker[]>(
    () => getTrackingMapMarkers(order?.orderType, mapCoordinates, colors),
    [colors, mapCoordinates, order?.orderType],
  );
  const routeOrigin =
    order?.orderType === "delivery"
      ? mapCoordinates.rider
      : mapCoordinates.pickup;
  const routeDestination = mapCoordinates.destination;
  const routePathQuery = useDeliveryRoutePath(routeOrigin, routeDestination, {
    enabled: Boolean(routeOrigin && routeDestination),
    staleTime: order?.orderType === "delivery" ? 15 * 1000 : 5 * 60 * 1000,
  });
  const mapPolylines = useMemo<MapPolyline[]>(
    () =>
      getTrackingMapPolylines(
        order?.orderType,
        mapCoordinates,
        routePathQuery.data,
        colors.primary,
      ),
    [colors.primary, mapCoordinates, order?.orderType, routePathQuery.data],
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
            <EstimatedTimeBanner
              etaLabel={t("order_tracking_eta_label")}
              etaValue={formatTrackingEta(
                order.store.estimatedDeliveryTime,
                order.scheduledAt,
              )}
            />

            <OrderTrackingTimelineSection
              orderLogs={order.orderLogs}
              timeline={order.timeline}
            />

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
                {mapRegion ? (
                  <Map
                    loadingEnabled
                    markers={mapMarkers}
                    polylines={mapPolylines}
                    region={mapRegion}
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
                    iconName={
                      order.orderType === "pickup"
                        ? "storefront-outline"
                        : "home-outline"
                    }
                    iconWrapperStyle={styles.mapInfoIcon}
                    isCompact
                    isIconContained={false}
                    onPress={() =>
                      navigation.navigate("OrderDetailsScreen", { orderId })
                    }
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

            <OrderTrackingInfoRow
              iconName="chatbox-ellipses-outline"
              isCompact
              isIconContained={false}
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
                  orderCode: order.summary.orderNumber || orderId,
                  receiverId: riderId,
                  riderAvatarUri,
                  riderName,
                });
              }}
              subtitle={t("order_tracking_contact_subtitle")}
              title={t("order_tracking_contact_title")}
            />

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <ExtendableOrderItems
              collapsedVariant="tracking"
              defaultExpanded
              orderItems={order.orderItems}
            />
          </ScrollView>

          <ExtendableOrderSummary
            deliveryDetails={order.deliveryDetails}
            layout="footer"
            summary={order.summary}
            title={t("order_tracking_summary")}
          />
        </View>
      )}
    </View>
  );
}

function getTrackingCoordinates(
  orderType: string | null | undefined,
  deliveryLatitude: number | null,
  deliveryLongitude: number | null,
  storeLatitude: number | null,
  storeLongitude: number | null,
  riderLocation: RiderLocation | null,
): TrackingCoordinates {
  return {
    destination:
      typeof deliveryLatitude === "number" &&
        typeof deliveryLongitude === "number"
        ? {
          latitude: deliveryLatitude,
          longitude: deliveryLongitude,
        }
        : null,
    pickup:
      typeof storeLatitude === "number" && typeof storeLongitude === "number"
        ? {
          latitude: storeLatitude,
          longitude: storeLongitude,
        }
        : null,
    rider:
      orderType === "delivery" && riderLocation
        ? {
          latitude: riderLocation.latitude,
          longitude: riderLocation.longitude,
        }
        : null,
  };
}

function getTrackingMapRegion(coordinates: TrackingCoordinates): Region | null {
  const points = [coordinates.destination, coordinates.pickup, coordinates.rider].filter(
    Boolean,
  ) as LatLng[];

  if (points.length === 0) {
    return null;
  }

  if (points.length === 1) {
    return {
      latitude: points[0].latitude,
      longitude: points[0].longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
  }

  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);

  return {
    latitude: (minLatitude + maxLatitude) / 2,
    longitude: (minLongitude + maxLongitude) / 2,
    latitudeDelta: Math.max(maxLatitude - minLatitude, 0.02) * 1.7,
    longitudeDelta: Math.max(maxLongitude - minLongitude, 0.02) * 1.7,
  };
}

function getTrackingMapMarkers(
  orderType: string | null | undefined,
  coordinates: TrackingCoordinates,
  colors: ReturnType<typeof useTheme>["colors"],
): MapMarker[] {
  const markers: MapMarker[] = [];
  const shouldShowPickupMarker = orderType === "pickup" || !coordinates.rider;

  if (shouldShowPickupMarker && coordinates.pickup) {
    markers.push({
      coordinate: coordinates.pickup,
      id: "pickup",
      render: (
        <View
          style={[
            styles.markerBase,
            {
              backgroundColor: colors.surface,
              borderColor: colors.blue100,
            },
          ]}
        >
          <Ionicons color={colors.primary} name="storefront-outline" size={14} />
        </View>
      ),
      zIndex: 1,
    });
  }

  if (coordinates.destination) {
    markers.push({
      coordinate: coordinates.destination,
      id: "destination",
      render: (
        <View
          style={[
            styles.markerBase,
            styles.deliveryMarker,
            {
              backgroundColor: colors.primary,
              borderColor: colors.blue100,
            },
          ]}
        >
          <Ionicons
            color={colors.white}
            name={orderType === "pickup" ? "location-outline" : "home-outline"}
            size={14}
          />
        </View>
      ),
      zIndex: 3,
    });
  }

  if (coordinates.rider) {
    markers.push({
      coordinate: coordinates.rider,
      id: "rider",
      render: (
        <View
          style={[
            styles.riderMarker,
            {
              backgroundColor: colors.surface,
              borderColor: colors.background,
              shadowColor: colors.shadowColor,
            },
          ]}
        >
          <Ionicons color={colors.primary} name="bicycle-outline" size={14} />
        </View>
      ),
      zIndex: 2,
    });
  }

  return markers;
}

function getTrackingMapPolylines(
  orderType: string | null | undefined,
  coordinates: TrackingCoordinates,
  routePath: Array<{ latitude: number; longitude: number }> | undefined,
  strokeColor: string,
): MapPolyline[] {
  if (orderType === "delivery" && coordinates.rider && coordinates.destination) {
    return [
      {
        coordinates:
          (routePath?.length ?? 0) >= 2
            ? routePath!
            : [coordinates.rider, coordinates.destination],
        id: "delivery-route",
        strokeColor,
        strokeWidth: 4,
      },
    ];
  }

  if (coordinates.pickup && coordinates.destination) {
    return [
      {
        coordinates:
          (routePath?.length ?? 0) >= 2
            ? routePath!
            : [coordinates.pickup, coordinates.destination],
        id: "pickup-route",
        strokeColor,
        strokeWidth: 4,
      },
    ];
  }

  return [];
}

function getOrderRiderLocation(rider: DeliveryOrderRider | null | undefined) {
  const latitude = rider?.currentLocation?.latitude ?? rider?.latitude ?? null;
  const longitude = rider?.currentLocation?.longitude ?? rider?.longitude ?? null;

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}

function getMapTitle(order: OrderDetailsResponse, fallbackTitle: string) {
  if (order.orderType === "pickup") {
    return order.store.name || fallbackTitle;
  }

  return order.deliveryDetails.label || fallbackTitle;
}

function getMapSubtitle(order: OrderDetailsResponse) {
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
  deliveryMarker: {
    borderRadius: 20,
    height: 40,
    width: 40,
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
  markerBase: {
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: "center",
    width: 24,
  },
  riderMarker: {
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 2,
    elevation: 2,
    height: 28,
    justifyContent: "center",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    width: 28,
  },
  screen: {
    flex: 1,
  },
});
