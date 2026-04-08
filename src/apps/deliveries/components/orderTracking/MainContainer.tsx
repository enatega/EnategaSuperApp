import React, { useMemo } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import type { LatLng, Region } from "react-native-maps";
import { useTranslation } from "react-i18next";

import Map, { type MapMarker, type MapPolyline } from "../../../../general/components/Map";




import ScreenHeader from "../../../../general/components/ScreenHeader";
import { useTheme } from "../../../../general/theme/theme";
import { useOrderDetails, useOrderStatusSocketSync } from "../../hooks";
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

export default function MainContainer({ navigation, orderId }: Props) {
  const { t } = useTranslation("deliveries");
  const { colors } = useTheme();
  useOrderStatusSocketSync(orderId);
  const orderDetailsQuery = useOrderDetails(orderId);

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

  const order = orderDetailsQuery.data;
  const mapCoordinates = useMemo(
    () =>
      getTrackingCoordinates(
        order?.deliveryDetails.latitude!,
        order?.deliveryDetails.longitude!,
        order?.deliveryDetails.storeLatitude!,
        order?.deliveryDetails.storeLongitude!,
        order?.rider?.latitude!,
        order?.rider?.longitude!,
      ),
    [
      order?.deliveryDetails.latitude,
      order?.deliveryDetails.longitude,
      order?.deliveryDetails.storeLatitude,
      order?.deliveryDetails.storeLongitude,
      order?.rider?.latitude,
      order?.rider?.longitude,
    ],
  );
  const mapRegion = useMemo(
    () => getTrackingMapRegion(mapCoordinates),
    [mapCoordinates],
  );
  const mapMarkers = useMemo<MapMarker[]>(
    () => getTrackingMapMarkers(mapCoordinates, colors),
    [colors, mapCoordinates],
  );
  const mapPolylines = useMemo<MapPolyline[]>(
    () => getTrackingMapPolylines(mapCoordinates, colors.primary),
    [colors.primary, mapCoordinates],
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

            <OrderTrackingTimelineSection timeline={order.timeline} />

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <OrderDetailsSection title={t("order_tracking_delivery_details")}>
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
                    initialRegion={mapRegion}
                    markers={mapMarkers}
                    polylines={mapPolylines}
                    rotateEnabled={false}
                    scrollEnabled={false}
                    style={styles.map}
                    zoomEnabled={false}
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
                    iconName="home-outline"
                    iconWrapperStyle={styles.mapInfoIcon}
                    isCompact
                    isIconContained={false}
                    onPress={() =>
                      navigation.navigate("OrderDetailsScreen", { orderId })
                    }
                    subtitle={order.deliveryDetails.address ?? undefined}
                    title={
                      order.deliveryDetails.label ||
                      t("order_tracking_delivery_details")
                    }
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
              onPress={() => navigation.navigate("Support")}
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

const styles = StyleSheet.create({
  content: {
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
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
  deliveryMarker: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  helpButton: {
    alignItems: "center",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
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

type TrackingCoordinates = {
  delivery: LatLng | null;
  rider: LatLng | null;
  store: LatLng | null;
};

function getTrackingCoordinates(
  deliveryLatitude: number | null,
  deliveryLongitude: number | null,
  storeLatitude: number | null,
  storeLongitude: number | null,
  riderLatitude: number | null | undefined,
  riderLongitude: number | null | undefined,
): TrackingCoordinates {
  return {
    delivery:
      typeof deliveryLatitude === "number" &&
      typeof deliveryLongitude === "number"
        ? {
            latitude: deliveryLatitude,
            longitude: deliveryLongitude,
          }
        : null,
    rider:
      typeof riderLatitude === "number" &&
      typeof riderLongitude === "number"
        ? {
            latitude: riderLatitude,
            longitude: riderLongitude,
          }
        : null,
    store:
      typeof storeLatitude === "number" && typeof storeLongitude === "number"
        ? {
            latitude: storeLatitude,
            longitude: storeLongitude,
          }
        : null,
  };
}

function getTrackingMapRegion(
  coordinates: TrackingCoordinates,
): Region | null {
  const points = [coordinates.delivery, coordinates.rider, coordinates.store].filter(
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
  coordinates: TrackingCoordinates,
  colors: ReturnType<typeof useTheme>["colors"],
): MapMarker[] {
  const markers: MapMarker[] = [];

  if (coordinates.store) {
    markers.push({
      coordinate: coordinates.store,
      id: "store",
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

  if (coordinates.delivery) {
    markers.push({
      coordinate: coordinates.delivery,
      id: "delivery",
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
          <Ionicons color={colors.white} name="home-outline" size={14} />
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
  coordinates: TrackingCoordinates,
  strokeColor: string,
): MapPolyline[] {
  if (coordinates.rider && coordinates.delivery) {
    return [
      {
        coordinates: [coordinates.rider, coordinates.delivery],
        id: "delivery-route",
        strokeColor,
        strokeWidth: 4,
      },
    ];
  }

  if (coordinates.store && coordinates.delivery) {
    return [
      {
        coordinates: [coordinates.store, coordinates.delivery],
        id: "store-route",
        strokeColor,
        strokeWidth: 4,
      },
    ];
  }

  return [];
}
