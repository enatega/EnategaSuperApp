import React, { useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../../../general/theme/theme";
import type { DeliveryNearbyStore } from "../../api/types";
import type { SearchStoreItem } from "../../api/searchServiceTypes";
import type { DeliveriesStoreDetailsParamList } from "../../navigation/sharedTypes";
import { styles } from "./styles";
import StoreImage from "./subComponents/StoreImage";
import StoreInfo from "./subComponents/StoreInfo";
import StoreRating from "./subComponents/StoreRating";
import StoreDeliveryInfo from "./subComponents/StoreDeliveryInfo";

type StoreCardData = DeliveryNearbyStore | SearchStoreItem;

export interface StoreCardProps {
  store: StoreCardData;
  actionSlot?: React.ReactNode;
  layout?: "compact" | "fullWidth";
}

type NavigationProp = NativeStackNavigationProp<DeliveriesStoreDetailsParamList>;

export default function StoreCard({
  store,
  actionSlot,
  layout = "compact",
}: StoreCardProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const resolvedImageUrl =
    store.coverImage || store.logo || "https://placehold.co/400x400.png";
  const resolvedOffer = store.deal ?? undefined;
  const resolvedName = store.name;
  const resolvedLocation = store.address ?? undefined;
  const resolvedRating = store.averageRating ?? undefined;
  const resolvedReviewCount = store.reviewCount ?? undefined;
  const resolvedCuisine = store.shopTypeName ?? undefined;
  const resolvedPrice = store.baseFee ?? 0;
  const resolvedDeliveryTime = store.deliveryTime ?? 0;
  const resolvedDistance = store.distanceKm ?? 0;

  const handlePress = useCallback(() => {
    navigation.navigate("StoreDetails", { store });
  }, [navigation, store]);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        layout === "fullWidth" ? styles.fullWidthContainer : styles.compactContainer,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
      activeOpacity={0.7}
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
