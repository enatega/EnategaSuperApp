import React from "react";
import { useScheduledOrders } from "../../hooks/useOrders";
import OrdersListSection from "./OrdersListSection";

const ScheduleDeliveriesSection = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useScheduledOrders();

  const orders = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <OrdersListSection
      variant="scheduled"
      orders={orders}
      isLoading={isLoading}
      isError={isError}
      isRetrying={isLoading}
      onRetry={() => {
        void refetch();
      }}
      hasNextPage={Boolean(hasNextPage)}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={() => {
        if (hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      }}
      showEndLabel
      emptySvgName="emptyCart2"
      titleWeight="bold"
    />
  );
};

export default ScheduleDeliveriesSection;
