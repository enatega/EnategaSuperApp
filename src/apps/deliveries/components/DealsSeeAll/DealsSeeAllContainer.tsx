import React, { useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import type { DeliveryDealItem, DeliveryDealsTabType } from "../../api/dealsServiceTypes";
import DealsSeeAllEmptyState from "./DealsSeeAllEmptyState";
import DealsSeeAllErrorState from "./DealsSeeAllErrorState";
import DealsSeeAllItem from "./DealsSeeAllItem";
import DealsSeeAllListHeader from "./DealsSeeAllListHeader";
import DealsSeeAllSkeleton from "./DealsSeeAllSkeleton";

type DealsSeeAllContainerProps = {
  data: DeliveryDealItem[];
  fetchNextPage: () => Promise<unknown> | unknown;
  hasNextPage?: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  onDealPress: (deal: DeliveryDealItem) => void;
  onTabChange: (tab: DeliveryDealsTabType) => void;
  isPending: boolean;
  isRefetching: boolean;
  isTabsVisible?: boolean;
  refetch: () => Promise<unknown> | unknown;
  selectedTab: DeliveryDealsTabType;
  title: string;
};

const DealsSeeAllContainer = ({
  data,
  fetchNextPage,
  hasNextPage,
  isError,
  isFetchingNextPage,
  onDealPress,
  onTabChange,
  isPending,
  isRefetching,
  isTabsVisible = true,
  refetch,
  selectedTab,
  title,
}: DealsSeeAllContainerProps) => {
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return <DealsSeeAllSkeleton isTabsVisible={isTabsVisible} />;
  }

  if (isError) {
    return (
      <DealsSeeAllErrorState
        isRetrying={isRefetching}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <FlatList
      data={data}
      numColumns={2}
      keyExtractor={(item) => item.dealId}
      ListHeaderComponent={
        <DealsSeeAllListHeader
          isTabsVisible={isTabsVisible}
          onTabChange={onTabChange}
          selectedTab={selectedTab}
          title={title}
        />
      }
      ListEmptyComponent={<DealsSeeAllEmptyState />}
      renderItem={({ item }) => (
        <DealsSeeAllItem item={item} onPress={onDealPress} />
      )}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.4}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default DealsSeeAllContainer;

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 14,
  },
});
