import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import VerticalList from "../../../../general/components/VerticalList";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import ProductMiniCard from "../ProductMiniCard";
import TopBrandCard from "../storeCard/TopBrandCard";
import StoreCard from "../storeCard/StoreCard";
import ShopTypeCard from "../../multiVendor/components/HomeTab/ShopTypeCard";
import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
  DeliveryTopBrand,
} from "../../api/types";
import type {
  GenericFilterablePaginatedListScreenProps,
  SupportedCardType,
} from "./types";
import type { GenericFilterChip } from "../filters/types";
import ListStateView from "./ListStateView";
import SelectedFilterChips from "../filters/SelectedFilterChips";

type ProductListItem = {
  title?: string;
  productName?: string;
  imageUri?: string;
  productImage?: string | null;
};

type ShopTypeListItem = {
  image?: string | null;
  name?: string;
};

function isShopTypeProductItem(item: unknown): item is DeliveryShopTypeProduct {
  return (
    typeof item === "object" &&
    item !== null &&
    "productId" in item &&
    "productName" in item
  );
}

function renderCardByType(
  cardType: SupportedCardType,
  item: unknown,
  onPress?: () => void,
) {
  if (cardType === "store") {
    if (isShopTypeProductItem(item)) {
      return (
        <StoreCard
          imageUrl={
            item.productImage ??
            item.storeImage ??
            item.storeLogo ??
            "https://placehold.co/400x400.png"
          }
          offer={item.deal ?? undefined}
          name={item.productName}
          cuisine={item.storeName ?? undefined}
          price={item.price ?? 0}
          deliveryTime=""
          distance={0}
          onPress={onPress ?? (() => {})}
        />
      );
    }

    return (
      <StoreCard
        store={item as DeliveryNearbyStore}
        onPress={onPress ?? (() => {})}
      />
    );
  }

  if (cardType === "top-brand") {
    return <TopBrandCard brand={item as DeliveryTopBrand} />;
  }

  if (cardType === "shop-type") {
    const shopTypeItem = item as ShopTypeListItem;

    return (
      <ShopTypeCard
        image={{ uri: shopTypeItem.image ?? "" }}
        title={shopTypeItem.name ?? ""}
      />
    );
  }

  const productItem = item as ProductListItem;

  return (
    <ProductMiniCard
      title={productItem.title ?? productItem.productName ?? ""}
      imageUri={productItem.imageUri ?? productItem.productImage ?? undefined}
      onPress={onPress}
    />
  );
}

export default function GenericFilterablePaginatedListScreen<
  TItem,
  TCardType extends SupportedCardType,
>({
  title,
  cardType,
  data,
  totalCount,
  isPending,
  isError,
  error,
  refetch,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isRefetching,
  itemKeyExtractor,
  chips = [],
  clearAllLabel,
  onRemoveChip,
  onClearAll,
  emptyTitle,
  emptyDescription,
  loadingComponent,
  paginationLoadingComponent,
  header,
  filterSheet,
  listContentContainerStyle,
  onItemPress,
}: GenericFilterablePaginatedListScreenProps<
  TItem,
  TCardType
>) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation("deliveries");

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleRemoveChip = useCallback(
    (chip: GenericFilterChip) => {
      onRemoveChip?.(chip);
    },
    [onRemoveChip],
  );

  const renderItem = useCallback(
    ({ item }: { item: TItem }) =>
      renderCardByType(
        cardType,
        item,
        onItemPress ? () => onItemPress(item) : undefined,
      ),
    [cardType, onItemPress],
  );

  const keyExtractor = useCallback(
    (item: TItem, index: number) =>
      itemKeyExtractor ? itemKeyExtractor(item, index) : String(index),
    [itemKeyExtractor],
  );

  const items = useMemo(() => data ?? [], [data]);
  const isInitialLoading = isPending && items.length === 0;
  const hasInitialError = isError && items.length === 0;
  const isEmpty = !isInitialLoading && !isError && items.length === 0;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {header}
      <View style={styles.content}>
        {chips.length > 0 && onRemoveChip ? (
          <SelectedFilterChips
            chips={chips}
            onRemoveChip={handleRemoveChip}
            clearAllLabel={clearAllLabel ?? t("clear_all")}
            onClearAll={onClearAll ?? (() => {})}
          />
        ) : null}

        <Text
          weight="extraBold"
          style={{
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
            marginBottom: 12,
            marginTop: chips.length > 0 ? 16 : 4,
          }}
        >
          {title}
        </Text>

        {isInitialLoading ? (
          loadingComponent ?? <ListStateView variant="loading" />
        ) : hasInitialError ? (
          <ListStateView
            variant="error"
            title={t("generic_list_error_title")}
            description={
              error?.message ?? t("generic_list_error_description")
            }
            actionLabel={t("generic_list_retry")}
            onActionPress={() => {
              void refetch();
            }}
          />
        ) : isEmpty ? (
          <ListStateView
            variant="empty"
            title={emptyTitle ?? t("generic_list_empty_title")}
            description={
              emptyDescription ?? t("generic_list_empty_description")
            }
          />
        ) : (
          <VerticalList
            data={items}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={[
              styles.listContent,
              listContentContainerStyle,
            ]}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.35}
            refreshing={isRefetching && !isPending}
            onRefresh={handleRefresh}
            ListFooterComponent={
              isFetchingNextPage ? (
                paginationLoadingComponent ? (
                  <View style={styles.footerContent}>
                    {paginationLoadingComponent}
                  </View>
                ) : (
                  <View style={styles.footerLoader}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                )
              ) : null
            }
          />
        )}
      </View>

      {filterSheet}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  footerLoader: {
    alignItems: "center",
    paddingBottom: 24,
    paddingTop: 8,
  },
  footerContent: {
    paddingBottom: 24,
    paddingTop: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  screen: {
    flex: 1,
  },
  separator: {
    height: 12,
  },
});
