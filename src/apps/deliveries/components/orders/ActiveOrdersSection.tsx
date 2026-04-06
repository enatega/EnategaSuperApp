import React from "react";
import OrdersListSection from "./OrdersListSection";
import { useActiveOrders } from "../../hooks/useOrders";

const ActiveOrdersSection = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useActiveOrders();

  const orders =
    data?.pages
      .flatMap((page) => page.items) ?? [];

  return (
    <OrdersListSection
      variant="active"
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
      emptySvgName="emptyCart"
      titleWeight="bold"
    />
  );
};

export default ActiveOrdersSection;
