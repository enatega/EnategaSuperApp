import React from "react";
import { usePastOrders } from "../../hooks/useOrders";
import OrdersListSection from "./OrdersListSection";

const OrderHistorySection = () => {
  const {
    data: pastData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPastLoading,
    isError: isPastError,
    refetch: refetchPast,
  } = usePastOrders();

  const pastOrders = pastData?.pages.flatMap((page) => page.items) ?? [];

  return (
    <OrdersListSection
      variant="past"
      orders={pastOrders}
      isLoading={isPastLoading}
      isError={isPastError}
      isRetrying={isPastLoading}
      onRetry={() => {
        void refetchPast();
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

export default OrderHistorySection;
