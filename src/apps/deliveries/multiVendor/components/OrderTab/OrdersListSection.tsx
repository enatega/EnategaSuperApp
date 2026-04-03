import React from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlatList, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { SvgName } from "../../../components/Svg";
import type { DeliveryOrderListItem } from "../../../api/ordersServiceTypes";
import type { MultiVendorStackParamList } from "../../navigation/types";
import EmptyOrdersSection from "./EmptyOrdersSection";
import OrderListCard from "./OrderListCard";
import OrderListErrorState from "./OrderListErrorState";
import OrderListFooter from "./OrderListFooter";
import OrderListSkeleton from "./OrderListSkeleton";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";

type Props = {
  variant: "active" | "past" | "scheduled";
  orders: DeliveryOrderListItem[];
  isLoading: boolean;
  isError: boolean;
  isRetrying: boolean;
  onRetry?: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore?: () => void;
  showEndLabel?: boolean;
  emptySvgName?: SvgName;
  titleWeight?: "bold" | "extraBold";
};

const OrdersListSection = ({
  variant,
  orders,
  isLoading,
  isError,
  isRetrying,
  onRetry,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  showEndLabel = true,
  emptySvgName = "noResultsFound",
  titleWeight = "extraBold",
}: Props) => {
  const { t } = useTranslation("deliveries");
  const navigation =
    useNavigation<NativeStackNavigationProp<MultiVendorStackParamList>>();
  const { colors, typography } = useTheme();

  if (isLoading) {
    return <OrderListSkeleton />;
  }

  if (isError && onRetry) {
    return (
      <OrderListErrorState
        title={t("orders_list_error")}
        retryLabel={t("orders_list_retry")}
        isRetrying={isRetrying}
        onRetry={onRetry}
      />
    );
  }

  const handleOrderPress = (order: DeliveryOrderListItem) => {
    navigation.navigate("OrderDetailsScreen", {
      orderId: order.orderId,
    });
  };
  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.orderId}
      renderItem={({ item }) => (
        <OrderListCard
          order={item}
          statusLabel={getStatusLabel(item, variant, t)}
          statusTone={getStatusTone(item, variant)}
          onPress={(order) => handleOrderPress(order)}
        />
      )}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <Text
          weight={titleWeight}
          style={[
            styles.heading,
            {
              color: colors.text,
              fontSize: typography.size.h5,
              lineHeight: typography.lineHeight.h5,
            },
          ]}
        >
          {getTitle(variant, t)}
        </Text>
      }
      ListEmptyComponent={
        <EmptyOrdersSection
          title={getEmptyTitle(variant, t)}
          description={getEmptyDescription(variant, t)}
          ctaLabel={t("orders_empty_history_cta")}
          svgName={emptySvgName}
        />
      }
      ListFooterComponent={
        <OrderListFooter
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isVisible={orders.length > 0}
          loadMoreLabel={t("orders_list_load_more")}
          noMoreItemsLabel={t("orders_list_no_more_items")}
          onLoadMore={onLoadMore ?? (() => undefined)}
          showEndLabel={showEndLabel}
        />
      }
    />
  );
};

export default OrdersListSection;

const getTitle = (variant: Props["variant"], t: (key: string) => string) => {
  switch (variant) {
    case "active":
      return t("orders_tab_active");
    case "scheduled":
      return t("orders_tab_scheduled");
    case "past":
    default:
      return t("orders_history_past_heading");
  }
};

const getEmptyTitle = (
  variant: Props["variant"],
  t: (key: string) => string,
) => {
  switch (variant) {
    case "active":
      return t("orders_empty_active_title");
    case "scheduled":
      return t("orders_empty_scheduled_title");
    case "past":
    default:
      return t("orders_empty_history_title");
  }
};

const getEmptyDescription = (
  variant: Props["variant"],
  t: (key: string) => string,
) => {
  switch (variant) {
    case "active":
      return t("orders_empty_active_subtitle");
    case "scheduled":
      return t("orders_empty_scheduled_subtitle");
    case "past":
    default:
      return t("orders_empty_history_subtitle");
  }
};

const getStatusLabel = (
  item: DeliveryOrderListItem,
  variant: Props["variant"],
  t: (key: string) => string,
) => {
  switch (variant) {
    case "active":
      return t("orders_status_ongoing");
    case "scheduled":
      return t("orders_status_upcoming");
    case "past":
    default:
      return item.orderStatus === "cancelled"
        ? t("orders_status_cancelled")
        : t("orders_status_delivered");
  }
};

const getStatusTone = (
  item: DeliveryOrderListItem,
  variant: Props["variant"],
) => {
  switch (variant) {
    case "active":
    case "scheduled":
      return "warning" as const;
    case "past":
    default:
      return item.orderStatus === "cancelled" ? "danger" : "success";
  }
};

const styles = StyleSheet.create({
  heading: {
    letterSpacing: -0.36,
    marginBottom: 12,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
});
