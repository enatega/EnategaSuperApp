import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useShopTypeStoresSections, useShopTypes } from "../../../hooks";
import {
  DiscoveryCategoryResultsSection,
  DiscoveryCategorySection,
} from "../../../../../general/components/discovery";
import StoreCard from "../../../components/storeCard/StoreCard";

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
        title={t("multi_vendor_shop_types_title")}
      />

      {shopTypeStoreSections.map(
        ({ shopType, data = [], error, isPending: isStoresPending }) => (
          <View key={shopType.id} style={styles.storeSection}>
            <DiscoveryCategoryResultsSection
              title={shopType.name}
              actionLabel={t('multi_vendor_see_all')}
              items={data}
              hasError={Boolean(error)}
              isLoading={isStoresPending}
              keyExtractor={(item) => item.storeId}
              renderItem={(item) => <StoreCard store={item} />}
              onActionPress={() =>
                handleShopTypeSeeAll(shopType.id, shopType.name)
              }
              emptyState={{
                title: t('multi_vendor_home_section_empty_title'),
                message: t('multi_vendor_shop_type_stores_empty'),
              }}
              errorState={{
                title: t('multi_vendor_home_section_error_title'),
                message: t('multi_vendor_home_section_error_message'),
              }}
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
