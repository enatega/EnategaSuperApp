import React, { useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import { useDealsListing } from "../../hooks";
import type { DeliveryDealItem, DeliveryDealsTabType } from "../../api/dealsServiceTypes";
import type { GenericListFilters } from "../filters/types";
import DealsSeeAllEmptyState from "./DealsSeeAllEmptyState";
import DealsSeeAllErrorState from "./DealsSeeAllErrorState";
import DealsSeeAllItem from "./DealsSeeAllItem";
import DealsSeeAllListHeader from "./DealsSeeAllListHeader";
import DealsSeeAllSkeleton from "./DealsSeeAllSkeleton";

type DealsSeeAllContainerProps = {
  filters: GenericListFilters;
  onDealPress: (deal: DeliveryDealItem) => void;
  onTabChange: (tab: DeliveryDealsTabType) => void;
  search: string;
  selectedTab: DeliveryDealsTabType;
  title: string;
};

const DealsSeeAllContainer = ({
  filters,
  onDealPress,
  onTabChange,
  search,
  selectedTab,
  title,
}: DealsSeeAllContainerProps) => {
  const {
    data: deals = [],
    isPending,
    isError,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = useDealsListing({
    mode: "paginated",
    filters,
    search,
    tab: selectedTab,
  });

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return <DealsSeeAllSkeleton />;
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
      data={deals}
      numColumns={2}
      keyExtractor={(item) => item.dealId}
      ListHeaderComponent={
        <DealsSeeAllListHeader
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
