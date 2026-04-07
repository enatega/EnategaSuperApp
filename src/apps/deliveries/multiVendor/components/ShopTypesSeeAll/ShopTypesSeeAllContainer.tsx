import React, { useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { usePaginatedShopTypes } from "../../../hooks";
import type { DeliveryShopType } from "../../../api/types";
import type { MultiVendorStackParamList } from "../../navigation/types";
import ShopTypesSeeAllEmptyState from "./ShopTypesSeeAllEmptyState";
import ShopTypesSeeAllErrorState from "./ShopTypesSeeAllErrorState";
import ShopTypesSeeAllItem from "./ShopTypesSeeAllItem";
import ShopTypesSeeAllListHeader from "./ShopTypesSeeAllListHeader";
import ShopTypesSeeAllSkeleton from "./ShopTypesSeeAllSkeleton";

type NavigationProp = NativeStackNavigationProp<
  MultiVendorStackParamList,
  "SeeAllScreen"
>;

const ShopTypesSeeAllContainer = () => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation("deliveries");
  const {
    data: shopTypes = [],
    isPending,
    isError,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = usePaginatedShopTypes({
    mode: "paginated",
  });

  const handleShopTypePress = useCallback(
    (shopType: DeliveryShopType) => {
      navigation.navigate("SeeAllScreen", {
        queryType: "shop-type-stores",
        title: shopType.name,
        cardType: "store",
        shopTypeId: shopType.id,
      });
    },
    [navigation],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return <ShopTypesSeeAllSkeleton />;
  }

  if (isError) {
    return (
      <ShopTypesSeeAllErrorState
        isRetrying={isRefetching}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <FlatList
      data={shopTypes}
      numColumns={3}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <ShopTypesSeeAllListHeader title={t("multi_vendor_shop_types_title")} />
      }
      ListEmptyComponent={<ShopTypesSeeAllEmptyState />}
      renderItem={({ item }) => (
        <ShopTypesSeeAllItem item={item} onPress={handleShopTypePress} />
      )}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.4}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default ShopTypesSeeAllContainer;

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 28,
  },
});
