import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useTheme } from "../../../../general/theme/theme";
import { styles } from "./styles";
import StoreImage from "./sub-components/StoreImage";
import StoreInfo from "./sub-components/StoreInfo";
import StoreRating from "./sub-components/StoreRating";
import StoreDeliveryInfo from "./sub-components/StoreDeliveryInfo";

interface StoreCardProps {
  imageUrl: string;
  offer?: string;
  name: string;
  rating?: number;
  reviewCount?: number;
  cuisine?: string;
  price: number;
  deliveryTime: number;
  distance: number;
  onPress: () => void;
}

export default function StoreCard({
  imageUrl,
  offer,
  name,
  rating,
  reviewCount,
  cuisine,
  price,
  deliveryTime,
  distance,
  onPress,
}: StoreCardProps) {
  const { colors } = useTheme();

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
      onPress={onPress}
      activeOpacity={0.7}
    >
      <StoreImage imageUrl={imageUrl} offer={offer} />

      <View style={styles.content}>
        <StoreInfo name={name} />
        <StoreRating
          rating={rating}
          reviewCount={reviewCount}
          cuisine={cuisine}
        />
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <StoreDeliveryInfo
          price={price}
          deliveryTime={deliveryTime}
          distance={distance}
        />
      </View>
    </TouchableOpacity>
  );
}
