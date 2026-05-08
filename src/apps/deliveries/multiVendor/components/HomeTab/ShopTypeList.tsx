import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useShopTypes } from "../../../hooks";
import { DiscoveryCategorySection } from "../../../../../general/components/discovery";

import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeliveriesStackParamList } from "../../../navigation/types";
import { MultiVendorStackParamList } from "../../navigation/types";

type NavProp = CompositeNavigationProp<
  NativeStackNavigationProp<MultiVendorStackParamList>,
  NativeStackNavigationProp<DeliveriesStackParamList>
>;

export default function ShopTypeList() {
  const { t } = useTranslation("deliveries");
  const navigation = useNavigation<NavProp>();
  const { data: shopTypes = [], isPending } = useShopTypes();

  const handleSeeAll = useCallback(() => {
    navigation.navigate("ShopTypesSeeAll");
  }, [navigation]);

  const handleShopTypeSeeAll = useCallback(
    (shopTypeId: string, title: string) => {
      navigation.navigate('SeeAllScreen', {
        queryType: 'shop-type-stores',
        title,
        cardType: 'store',
        shopTypeId,
      });
    },
    [navigation],
  );

  return (
    <View style={styles.content}>
      <DiscoveryCategorySection
        actionLabel={t("multi_vendor_see_all")}
        items={shopTypes.map((shopType) => ({
          id: shopType.id,
          name: shopType.name,
          imageUrl: shopType.image ?? null,
        }))}
        isPending={isPending}
        onActionPress={handleSeeAll}
        onItemPress={(item) => handleShopTypeSeeAll(item.id, item.name)}
        title={t("multi_vendor_shop_types_title")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 0,
  },
});
