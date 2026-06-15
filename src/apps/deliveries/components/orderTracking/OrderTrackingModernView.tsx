import React, { useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useTranslation } from "react-i18next";

import Map from "../../../../general/components/Map";
import ScreenHeader from "../../../../general/components/ScreenHeader";
import { useTheme } from "../../../../general/theme/theme";
import ExtendableOrderSummary from "../orderSummary/ExtendableOrderSummary";
import OrderTrackingErrorState from "./OrderTrackingErrorState";
import OrderTrackingLoadingSkeleton from "./OrderTrackingLoadingSkeleton";
import OrderTrackingModernEtaFrame from "./OrderTrackingModernEtaFrame";
import OrderTrackingModernProgressCard from "./OrderTrackingModernProgressCard";
import OrderTrackingModernSections from "./OrderTrackingModernSections";
import type { OrderTrackingViewModel } from "./useOrderTrackingViewModel";
import { formatTrackingEta } from "../../utils/orderTracking/orderTrackingUtils";

type Props = {
  viewModel: OrderTrackingViewModel;
};

export default function OrderTrackingModernView({ viewModel }: Props) {
  const { t } = useTranslation("deliveries");
  const { colors } = useTheme();
  const { height: windowHeight } = useWindowDimensions();
  const { order, orderDetailsQuery } = viewModel;
  const [isOrderItemsExpanded, setIsOrderItemsExpanded] = useState(false);
  const [isSheetExpanded, setIsSheetExpanded] = useState(true);

  const COLLAPSED_VISIBLE_HEIGHT = 148;
  const SHEET_TOP_PADDING = 38;
  const SUMMARY_RESERVED_HEIGHT = 118;
  const MIN_MAP_HEIGHT = 244;
  const MAX_MAP_HEIGHT = useWindowDimensions().height - SHEET_TOP_PADDING - SUMMARY_RESERVED_HEIGHT - 80; // 80 is an estimated height for the order summary when it's expanded

  const sheetTranslateY = useRef(new Animated.Value(0)).current;
  const dragStartY = useRef(0);

  const collapsedTranslateY = useMemo(() => {
    const estimatedSheetExpandedHeight = windowHeight - MIN_MAP_HEIGHT - SUMMARY_RESERVED_HEIGHT;
    return Math.max(140, estimatedSheetExpandedHeight - COLLAPSED_VISIBLE_HEIGHT);
  }, [windowHeight]);

  const mapHeight = sheetTranslateY.interpolate({
    inputRange: [0, collapsedTranslateY],
    outputRange: [MIN_MAP_HEIGHT, MAX_MAP_HEIGHT],
    extrapolate: "clamp",
  });

  const snapSheet = (expand: boolean) => {
    setIsSheetExpanded(expand);
    Animated.spring(sheetTranslateY, {
      damping: 20,
      mass: 0.9,
      overshootClamping: true,
      stiffness: 260,
      toValue: expand ? 0 : collapsedTranslateY,
      useNativeDriver: false,
    }).start();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dy) > 6 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderGrant: () => {
          sheetTranslateY.stopAnimation((value) => {
            dragStartY.current = value;
          });
        },
        onPanResponderMove: (_, gesture) => {
          const next = Math.min(
            collapsedTranslateY,
            Math.max(0, dragStartY.current + gesture.dy),
          );
          sheetTranslateY.setValue(next);
        },
        onPanResponderRelease: (_, gesture) => {
          const dragDistance = gesture.dy;
          const velocity = gesture.vy;
          if (dragDistance > 40 || velocity > 0.7) {
            snapSheet(false);
            return;
          }
          if (dragDistance < -40 || velocity < -0.7) {
            snapSheet(true);
            return;
          }
          sheetTranslateY.stopAnimation((value) => {
            snapSheet(value < collapsedTranslateY / 2);
          });
        },
      }),
    [collapsedTranslateY, sheetTranslateY],
  );

  const activeOrCompletedTimelineItem = order?.timeline?.find(
    (item) => item.active || item.completed,
  );
  const progressTimeLabel = activeOrCompletedTimelineItem?.completedAt
    ? new Date(activeOrCompletedTimelineItem.completedAt).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    : "--";

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}> 
      <ScreenHeader
        rightSlot={
          <Pressable
            accessibilityLabel={t("order_tracking_help")}
            accessibilityRole="button"
            hitSlop={8}
            onPress={viewModel.helpPress}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <Ionicons color={colors.text} name="help-circle-outline" size={24} />
          </Pressable>
        }
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
          <View style={styles.body}>
            {viewModel.mapRegion ? (
              <Animated.View style={[styles.mapHero, { height: mapHeight }]}>
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
              </Animated.View>
            ) : null}

            <Animated.View
              {...panResponder.panHandlers}
              style={[styles.etaWrap, { transform: [{ translateY: sheetTranslateY }] }]}
            >
              <OrderTrackingModernEtaFrame
                etaLabel={
                  viewModel.isDelivered
                    ? t("order_tracking_delivered_title")
                    : formatTrackingEta(order.store.estimatedDeliveryTime, order.scheduledAt).replace(
                        " min",
                        "",
                      )
                }
                status={order.status}
                showDeliveredTitle={viewModel.isDelivered}
              />
            </Animated.View>

            <Animated.View
              style={[
                styles.bottomSheet,
                {
                  backgroundColor: colors.surface,
                  paddingTop: SHEET_TOP_PADDING,
                  transform: [{ translateY: sheetTranslateY }],
                },
              ]}
            >
              <View
                {...panResponder.panHandlers}
                style={styles.dragHandleZone}
              >
                <View
                  style={[
                    styles.dragHandle,
                    { backgroundColor: isSheetExpanded ? colors.border : colors.primary },
                  ]}
                />
              </View>
              <ScrollView
                contentContainerStyle={styles.content}
                contentInsetAdjustmentBehavior="automatic"
                showsVerticalScrollIndicator={false}
              >
                <OrderTrackingModernProgressCard
                  progressTimeLabel={progressTimeLabel}
                  status={order.status}
                />
                <OrderTrackingModernSections
                  isOrderItemsExpanded={isOrderItemsExpanded}
                  onToggleItems={() => setIsOrderItemsExpanded((prev) => !prev)}
                  order={order}
                  t={t}
                  viewModel={viewModel}
                />
              </ScrollView>
            </Animated.View>
          </View>

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

const styles = StyleSheet.create({
  body: {
    flex: 1,
    overflow: "hidden",
  },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    bottom: 0,
    left: 0,
    overflow: "hidden",
    position: "absolute",
    right: 0,
    top: 188,
  },
  content: {
    paddingBottom: 120,
    paddingHorizontal: 0,
  },
  dragHandle: {
    borderRadius: 3,
    height: 5,
    width: 46,
  },
  dragHandleZone: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
    paddingTop: 4,
  },
  etaWrap: {
    alignItems: "center",
    marginTop: 114,
    overflow: "visible",
    position: "absolute",
    width: "100%",
    zIndex: 2,
    
  },
  map: {
    borderRadius: 0,
  },
  mapHero: {
    overflow: "hidden",
  },
  screen: {
    flex: 1,
  },
});
