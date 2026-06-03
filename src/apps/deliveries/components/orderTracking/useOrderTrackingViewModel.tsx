import { useEffect, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import type { LatLng, Region } from "react-native-maps";

import type { MapMarker, MapPolyline } from "../../../../general/components/Map";
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

export type OrderTrackingViewModel = {
  canContactCourier: boolean;
  chatBoxId: string | null | undefined;
  courierNote: string | null;
  estimatedMinutes: number;
  helpPress: () => void;
  isDelivered: boolean;
  mapMarkers: MapMarker[];
  mapPolylines: MapPolyline[];
  mapRegion: Region | null;
  onContactCourierPress: () => void;
  onOpenOrderDetails: () => void;
  order: OrderDetailsResponse | undefined;
  orderDetailsQuery: ReturnType<typeof useOrderDetails>;
  orderId: string;
  restaurantNote: string | null;
  riderAvatarUri: string | undefined;
  riderId: string | null;
  riderName: string;
  shouldShowNotes: boolean;
};

type Props = {
  navigation: NativeStackNavigationProp<
    DeliveriesStackParamList,
    "OrderTrackingScreen"
  >;
  onMissingReceiver: () => void;
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

export function useOrderTrackingViewModel({
  navigation,
  onMissingReceiver,
  orderId,
}: Props): OrderTrackingViewModel {
  const { t } = useTranslation("deliveries");
  const { colors } = useTheme();

  useOrderStatusSocketSync(orderId);

  const orderDetailsQuery = useOrderDetails(orderId);
  const order = orderDetailsQuery.data;

  const riderId = resolveRiderId(order?.rider);
  const riderName =
    order?.rider?.name ||
    t("ride_active_driver_fallback", {
      ns: "rideSharing",
      defaultValue: "Rider",
    });
  const riderAvatarUri =
    typeof order?.rider?.profile === "string"
      ? order.rider.profile
      : typeof order?.rider?.image === "string"
        ? order.rider.image
        : undefined;
  const chatBoxId = order?.chatBoxId;
  const estimatedMinutes = Number(order?.store.estimatedDeliveryTime) || 0;

  useEffect(() => {
    console.log(
      "OrderTracking MainContainer data",
      JSON.stringify(
        {
          chatBoxId,
          chatReceiverId: riderId,
          deliveryDetails: order?.deliveryDetails,
          orderData: order,
          orderId,
          rider: order?.rider,
          riderId: order?.rider?.id,
          riderUserId: order?.rider?.userId,
          status: order?.status,
        },
        null,
        2,
      ),
    );
  }, [chatBoxId, order, orderId, riderId]);

  useEffect(() => {
    console.log("[OrderTracking][QueryState]", {
      errorMessage:
        orderDetailsQuery.error instanceof Error
          ? orderDetailsQuery.error.message
          : orderDetailsQuery.error,
      hasOrder: Boolean(order),
      isError: orderDetailsQuery.isError,
      isFetching: orderDetailsQuery.isFetching,
      isLoading: orderDetailsQuery.isLoading,
      orderId,
      status: orderDetailsQuery.status,
    });
  }, [
    order,
    orderDetailsQuery.error,
    orderDetailsQuery.isError,
    orderDetailsQuery.isFetching,
    orderDetailsQuery.isLoading,
    orderDetailsQuery.status,
    orderId,
  ]);

  const riderLocation = useOrderRiderLocationSync(
    order?.orderType === "delivery" ? (order?.rider?.userId ?? null) : null,
    getOrderRiderLocation(order?.rider),
    { enabled: order?.orderType === "delivery" },
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
      order?.deliveryDetails.latitude,
      order?.deliveryDetails.longitude,
      order?.deliveryDetails.storeLatitude,
      order?.deliveryDetails.storeLongitude,
      order?.orderType,
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
    order?.orderType === "delivery" ? mapCoordinates.rider : mapCoordinates.pickup;
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

  const isDelivered = order?.status === "delivered";
  const canContactCourier = order?.status === "picked_up" && Boolean(riderId || chatBoxId);
  const restaurantNote = order?.restaurantNote?.trim() || null;
  const courierNote = order?.courierNote?.trim() || null;
  const shouldShowNotes = Boolean(restaurantNote || courierNote);

  return {
    canContactCourier,
    chatBoxId,
    courierNote,
    estimatedMinutes,
    helpPress: () => navigation.navigate("Support"),
    isDelivered,
    mapMarkers,
    mapPolylines,
    mapRegion,
    onContactCourierPress: () => {
      if (!riderId && !chatBoxId) {
        onMissingReceiver();
        return;
      }

      navigation.navigate("RiderChat", {
        chatBoxId: chatBoxId ?? undefined,
        estimatedMinutes,
        orderCode: order?.summary.orderNumber || orderId,
        receiverId: riderId ?? undefined,
        riderAvatarUri,
        riderName,
      });
    },
    onOpenOrderDetails: () => navigation.navigate("OrderDetailsScreen", { orderId }),
    order,
    orderDetailsQuery,
    orderId,
    restaurantNote,
    riderAvatarUri,
    riderId,
    riderName,
    shouldShowNotes,
  };
}

function resolveRiderId(rider: DeliveryOrderRider | null | undefined): string | null {
  if (!rider) {
    return null;
  }

  const directCandidates = [rider.userId, rider.id] as const;
  for (const candidate of directCandidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  const objectCandidate = rider as { _id?: unknown; user?: { id?: unknown; _id?: unknown } };
  const nestedCandidates = [
    objectCandidate._id,
    objectCandidate.user?.id,
    objectCandidate.user?._id,
  ];

  for (const candidate of nestedCandidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return null;
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
      typeof deliveryLatitude === "number" && typeof deliveryLongitude === "number"
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
  colors: {
    background: string;
    blue100: string;
    primary: string;
    shadowColor: string;
    surface: string;
    white: string;
  },
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
            markerStyles.markerBase,
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
            markerStyles.markerBase,
            markerStyles.deliveryMarker,
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
            markerStyles.riderMarker,
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

const markerStyles = StyleSheet.create({
  deliveryMarker: {
    borderRadius: 20,
    height: 40,
    width: 40,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    width: 28,
  },
});

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
