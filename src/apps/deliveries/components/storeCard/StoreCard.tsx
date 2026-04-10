import React, { useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../../../general/theme/theme";
import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from "../../api/types";
import type { SearchStoreItem } from "../../api/searchServiceTypes";
import type { DeliveriesStoreDetailsParamList } from "../../navigation/sharedTypes";
import { styles } from "./styles";
import StoreImage from "./subComponents/StoreImage";
import StoreInfo from "./subComponents/StoreInfo";
import StoreRating from "./subComponents/StoreRating";
import StoreDeliveryInfo from "./subComponents/StoreDeliveryInfo";

type StoreCardData =
  | DeliveryNearbyStore
  | SearchStoreItem
  | DeliveryShopTypeProduct;

export interface StoreCardProps {
  store: StoreCardData;
  actionSlot?: React.ReactNode;
  layout?: "compact" | "fullWidth";
  onPress?: () => void;
}

type NavigationProp = NativeStackNavigationProp<DeliveriesStoreDetailsParamList>;

function isProductStoreCardData(
  store: StoreCardData,
): store is DeliveryShopTypeProduct {
  return "productId" in store && "productName" in store;
}

export default function StoreCard({
  store,
  actionSlot,
  layout = "compact",
  onPress,
}: StoreCardProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const isProductItem = isProductStoreCardData(store);
  const isPressable = Boolean(onPress) || !isProductItem;
  const resolvedImageUrl = isProductItem
    ? store.productImage ||
      store.storeImage ||
      store.storeLogo ||
      "https://placehold.co/400x400.png"
    : store.coverImage || store.logo || "https://placehold.co/400x400.png";
  const resolvedOffer = store.deal ?? undefined;
  const resolvedName = isProductItem ? store.productName : store.name;
  const resolvedLocation = !isProductItem ? store.address ?? undefined : undefined;
  const resolvedRating = store.averageRating ?? undefined;
  const resolvedReviewCount = store.reviewCount ?? undefined;
  const resolvedCuisine = isProductItem
    ? store.storeName ?? undefined
    : store.shopTypeName ?? undefined;
  const resolvedPrice = isProductItem ? store.price ?? 0 : store.baseFee ?? 0;
  const resolvedDeliveryTime = isProductItem
    ? store.deliveryTime ?? ""
    : store.deliveryTime ?? 0;
  const resolvedDistance = store.distanceKm ?? 0;

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
      return;
    }

    if (isProductStoreCardData(store)) {
      return;
    }

    navigation.navigate("StoreDetails", { store });
  }, [navigation, onPress, store]);

  return (
    <TouchableOpacity
      disabled={!isPressable}
      style={[
        styles.container,
        layout === "fullWidth" ? styles.fullWidthContainer : styles.compactContainer,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
      activeOpacity={isPressable ? 0.7 : 1}
      onPress={handlePress}
    >
      <StoreImage imageUrl={resolvedImageUrl} offer={resolvedOffer} actionSlot={actionSlot} />

      <View style={styles.content}>
        <StoreInfo name={resolvedName} />
        <StoreRating
          rating={resolvedRating}
          reviewCount={resolvedReviewCount}
          cuisine={resolvedCuisine ?? resolvedLocation}
        />
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <StoreDeliveryInfo
          price={resolvedPrice}
          deliveryTime={resolvedDeliveryTime}
          distance={resolvedDistance}
        />
      </View>
    </TouchableOpacity>
  );
}
