import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useShopTypeStoresSections, useShopTypes } from "../../../hooks";
import {
  DiscoveryCategoryResultsSection,
  DiscoveryCategorySection,
} from "../../../components/discovery";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MultiVendorStackParamList } from "../../navigation/types";

type NavProp = NativeStackNavigationProp<MultiVendorStackParamList>;

export default function ShopTypeList() {
  const { t } = useTranslation("deliveries");
  const navigation = useNavigation<NavProp>();
  const { data: shopTypes = [], isPending } = useShopTypes();
  const shopTypeStoreSections = useShopTypeStoresSections(shopTypes);

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

      {shopTypeStoreSections.map(
        ({ shopType, data = [], error, isPending: isStoresPending }) => (
          <View key={shopType.id} style={styles.storeSection}>
            <DiscoveryCategoryResultsSection
              actionLabel={t('multi_vendor_see_all')}
              cardType="store"
              emptyMessage={t('multi_vendor_shop_type_stores_empty')}
              hasError={Boolean(error)}
              isLoading={isStoresPending}
              items={data}
              onActionPress={() =>
                handleShopTypeSeeAll(shopType.id, shopType.name)
              }
              title={shopType.name}
            />
          </View>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
  storeSection: {
    paddingHorizontal: 16,
  },
});
