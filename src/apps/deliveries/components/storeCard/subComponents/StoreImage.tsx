import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Image from "../../../../../general/components/Image";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import { styles } from "../styles";

interface StoreImageProps {
  imageUrl: string;
  offer?: string | number | undefined;
  actionSlot?: React.ReactNode;
}

export default function StoreImage({ imageUrl, offer, actionSlot }: StoreImageProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      {offer && (
        <View style={[styles.offerBadge, { backgroundColor: colors.primary }]}>
          <Ionicons
            name="pricetag"
            size={12}
            color={colors.white}
            style={styles.offerIcon}
          />
          <Text
            variant="caption"
            weight="semiBold"
            style={[styles.offerText, { color: colors.white }]}
          >
            {offer}
          </Text>
        </View>
      )}

      {actionSlot ?? null}
    </View>
  );
}
