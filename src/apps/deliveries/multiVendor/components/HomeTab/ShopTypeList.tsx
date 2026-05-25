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

function decodeDisplayText(value: string) {
  let decodedValue = value;

  if (decodedValue.includes("%")) {
    try {
      decodedValue = decodeURIComponent(decodedValue);
    } catch {
      decodedValue = value;
    }
  }

  return decodedValue.replace(/%amp;|&amp;|&#38;/gi, "&");
}

export default function ShopTypeList() {
  const { t } = useTranslation("deliveries");
  const navigation = useNavigation<NavProp>();
  const { data: shopTypes = [], isPending } = useShopTypes();

  const handleSeeAll = useCallback(() => {
    navigation.navigate("MainSeeAllScreen");
  }, [navigation]);

  const handleShopTypeSeeAll = useCallback((shopTypeId: string) => {
      navigation.navigate("MainSeeAllScreen", {
        initialShopTypeId: shopTypeId,
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
          name: decodeDisplayText(shopType.name),
          imageUrl: shopType.image ?? null,
        }))}
        isPending={isPending}
        onActionPress={handleSeeAll}
        onItemPress={(item) => handleShopTypeSeeAll(item.id)}
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
