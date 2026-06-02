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
  isClosed?: boolean;
  closedLabel?: string;
}

export default function StoreImage({
  imageUrl,
  offer,
  actionSlot,
  isClosed = false,
  closedLabel,
}: StoreImageProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: imageUrl }} style={styles.image} />

      {isClosed ? (
        <View style={styles.closedOverlay}>
          <Text
            variant="caption"
            weight="bold"
            style={[styles.closedLabel, { color: colors.white }]}
          >
            {closedLabel}
          </Text>
        </View>
      ) : null}

      {offer && (
        <View style={[styles.offerBadge, { backgroundColor: colors.secondary }]}>
          <Ionicons
            name="pricetag"
            size={12}
            color={colors.blue800}
            style={styles.offerIcon}
          />
          <Text
            variant="caption"
            weight="semiBold"
            style={[styles.offerText, { color: colors.blue800 }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {offer}
          </Text>
        </View>
      )}

      {actionSlot ?? null}
    </View>
  );
}
