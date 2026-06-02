import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import ExtendableOrderItems from "../orderItems/ExtendableOrderItems";
import OrderTrackingInfoRow from "./OrderTrackingInfoRow";
import type { OrderTrackingViewModel } from "./useOrderTrackingViewModel";
import { getPreviewImages } from "./OrderTrackingModern.shared";

type Props = {
  isOrderItemsExpanded: boolean;
  onToggleItems: () => void;
  order: NonNullable<OrderTrackingViewModel["order"]>;
  t: (key: string) => string;
  viewModel: OrderTrackingViewModel;
};

export default function OrderTrackingModernSections({
  isOrderItemsExpanded,
  onToggleItems,
  order,
  t,
  viewModel,
}: Props) {
  const { colors } = useTheme();

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text color={colors.text} style={styles.sectionTitle} weight="semiBold">
          Delivery details
        </Text>
      </View>
      <OrderTrackingInfoRow
        iconName="home-outline"
        isCompact
        isIconContained={false}
        onPress={viewModel.onOpenOrderDetails}
        subtitle={order.deliveryDetails.address || "-"}
        subtitleNumberOfLines={1}
        subtitleStyle={styles.rowSubtitle}
        titleStyle={styles.rowTitle}
        title={order.deliveryDetails.label || t("order_tracking_delivery_details")}
        containerStyle={styles.rowItem}
      />
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {viewModel.canContactCourier ? (
        <>
          <OrderTrackingInfoRow
            iconName="chatbox-ellipses-outline"
            isCompact
            isIconContained={false}
            onPress={viewModel.onContactCourierPress}
            subtitle={t("order_tracking_contact_subtitle")}
            subtitleStyle={styles.rowSubtitle}
            titleStyle={styles.rowTitle}
            title={t("order_tracking_contact_title")}
            containerStyle={styles.rowItem}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text color={colors.text} style={styles.sectionTitle} weight="semiBold">
          Order items
        </Text>
      </View>
      <Pressable accessibilityRole="button" onPress={onToggleItems} style={styles.rowItemCustom}>
        <View style={styles.rowBetween}>
          <View style={styles.rowGap}>
            <View style={styles.avatarsRow}>
              {getPreviewImages(order.orderItems.previewImages).map((imageUri, index) => (
                <Image
                  key={`${imageUri}-${index}`}
                  source={{ uri: imageUri }}
                  style={[styles.avatar, index > 0 && styles.avatarOverlap]}
                />
              ))}
              {order.orderItems.additionalItemsCount > 0 ? (
                <View style={[styles.avatar, styles.avatarCount, styles.avatarOverlap]}>
                  <Text color={colors.mutedText} style={styles.avatarCountText} weight="medium">
                    +{order.orderItems.additionalItemsCount}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text color={colors.text} numberOfLines={1} style={styles.orderItemsTitleText} weight="medium">
              {order.orderItems.summaryLabel || "Order items"}
            </Text>
          </View>
          <Ionicons
            color={colors.iconMuted}
            name={isOrderItemsExpanded ? "chevron-down" : "chevron-forward"}
            size={18}
          />
        </View>
      </Pressable>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      {isOrderItemsExpanded ? (
        <View style={styles.itemsExpandedContainer}>
          <ExtendableOrderItems
            collapsedVariant="tracking"
            hideHeading
            isCollapsible={false}
            orderItems={order.orderItems}
          />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderColor: "#FAFAFA",
    borderRadius: 20,
    borderWidth: 1.5,
    height: 40,
    width: 40,
  },
  avatarCount: {
    alignItems: "center",
    backgroundColor: "#F4F4F5",
    justifyContent: "center",
  },
  avatarCountText: {
    fontSize: 16,
    lineHeight: 24,
  },
  avatarOverlap: {
    marginLeft: -12,
  },
  avatarsRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  itemsExpandedContainer: {
    paddingHorizontal: 16,
    paddingTop: 2,
  },
  orderItemsTitleText: {
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  rowBetween: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowGap: {
    alignItems: "center",
    columnGap: 12,
    flex: 1,
    flexDirection: "row",
    minWidth: 0,
    paddingRight: 8,
  },
  rowItem: {
    paddingHorizontal: 16,
  },
  rowItemCustom: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionHeader: {
    paddingBottom: 2,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  sectionTitle: {
    fontSize: 18,
    letterSpacing: -0.2,
    lineHeight: 26,
  },
  rowSubtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  rowTitle: {
    fontSize: 16,
    lineHeight: 24,
  },
});
