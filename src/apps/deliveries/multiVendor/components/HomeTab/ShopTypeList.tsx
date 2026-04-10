import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import HorizontalList from "../../../../../general/components/HorizontalList";
import SectionActionHeader from "../../../../../general/components/SectionActionHeader";
import { useShopTypeStoresSections, useShopTypes } from "../../../hooks";
import ShopTypeCardSkeleton from "./HomeTabSkeletons/ShopTypeCardSkeleton";
import MultiVendorShopTypeCard from "../../../components/ShopTypeCard";
import ShopTypeStoreList from "./ShopTypeStoreList";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MultiVendorStackParamList } from "../../navigation/types";

type NavProp = NativeStackNavigationProp<
  MultiVendorStackParamList,
  "ShopTypesSeeAll"
>;

export default function ShopTypeList() {
  const { t } = useTranslation("deliveries");
  const navigation = useNavigation<NavProp>();
  const { data: shopTypes = [], isPending } = useShopTypes();
  const shopTypeStoreSections = useShopTypeStoresSections(shopTypes);

  const handleSeeAll = useCallback(() => {
    navigation.navigate("ShopTypesSeeAll");
  }, [navigation, t]);

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={t("multi_vendor_see_all")}
        title={t("multi_vendor_shop_types_title")}
        onActionPress={handleSeeAll}
      />

      {isPending ? (
        <ShopTypeCardSkeleton />
      ) : (
        <HorizontalList
          data={shopTypes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <MultiVendorShopTypeCard
              image={{ uri: item.image ?? "" }}
              title={item.name}
            />
          )}
        />
      )}

      {shopTypeStoreSections.map(
        ({ shopType, data = [], error, isPending: isStoresPending }) => (
          <ShopTypeStoreList
            key={shopType.id}
            hasError={Boolean(error)}
            isLoading={isStoresPending}
            shopTypeId={shopType.id}
            stores={data}
            title={shopType.name}
          />
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingRight: 16,
  },
  separator: {
    width: 12,
  },
});
