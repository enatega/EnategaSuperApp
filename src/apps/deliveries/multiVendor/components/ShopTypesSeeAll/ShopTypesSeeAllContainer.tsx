import React, { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import CategorySeeAllGrid from "../../../components/categorySeeAll/CategorySeeAllGrid";
import type { DeliveryDiscoveryCategoryItem } from "../../../components/discovery";
import { usePaginatedShopTypes } from "../../../hooks";
import type { DeliveriesStackParamList } from "../../../navigation/types";

type NavigationProp = NativeStackNavigationProp<
  DeliveriesStackParamList,
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
    (shopType: DeliveryDiscoveryCategoryItem) => {
      navigation.navigate("SeeAllScreen", {
        queryType: "shop-type-stores",
        title: shopType.name,
        cardType: "store",
        shopTypeId: shopType.id,
      });
    },
    [navigation],
  );

  return (
    <CategorySeeAllGrid
      data={shopTypes.map((shopType) => ({
        id: shopType.id,
        name: shopType.name,
        imageUrl: shopType.image ?? null,
      }))}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isError={isError}
      isFetchingNextPage={isFetchingNextPage}
      isPending={isPending}
      isRefetching={isRefetching}
      onItemPress={handleShopTypePress}
      refetch={refetch}
      title={t("multi_vendor_shop_types_title")}
    />
  );
};

export default ShopTypesSeeAllContainer;
