import React, { useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../../../general/theme/theme";
import type { DeliveryNearbyStore } from "../../api/types";
import type { MultiVendorStackParamList } from "../../multiVendor/navigation/types";
import { styles } from "./styles";
import StoreImage from "./subComponents/StoreImage";
import StoreInfo from "./subComponents/StoreInfo";
import StoreRating from "./subComponents/StoreRating";
import StoreDeliveryInfo from "./subComponents/StoreDeliveryInfo";

export interface StoreCardProps {
  store?: DeliveryNearbyStore;
  imageUrl?: string;
  offer?: string;
  name?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  cuisine?: string;
  price?: number;
  deliveryTime?: number | string;
  distance?: number;
  actionSlot?: React.ReactNode;
  onPress?: () => void;
}

type NavigationProp = NativeStackNavigationProp<MultiVendorStackParamList>;

export default function StoreCard({
  store,
  imageUrl,
  offer,
  name,
  location,
  rating,
  reviewCount,
  cuisine,
  price,
  deliveryTime,
  distance,
  actionSlot,
  onPress,
}: StoreCardProps) {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const resolvedImageUrl =
    imageUrl || store?.coverImage || store?.logo || "https://placehold.co/400x400.png";
  const resolvedOffer =
    offer || undefined;
  const resolvedName = name || store?.name || "";
  const resolvedLocation = location || store?.address || undefined;
  const resolvedRating = rating ?? store?.averageRating ?? undefined;
  const resolvedReviewCount = reviewCount ?? store?.reviewCount ?? undefined;
  const resolvedCuisine = cuisine ?? store?.shopTypeName ?? undefined;
  const resolvedPrice = price ?? store?.baseFee ?? 0;
  const resolvedDeliveryTime = deliveryTime ?? store?.deliveryTime ?? 0;
  const resolvedDistance = distance ?? store?.distanceKm ?? 0;
  const hasPressHandler = Boolean(onPress || store);

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
      return;
    }

    if (store) {
      navigation.navigate("StoreDetails", { store });
    }
  }, [navigation, onPress, store]);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
      activeOpacity={hasPressHandler ? 0.7 : 1}
      disabled={!hasPressHandler}
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
