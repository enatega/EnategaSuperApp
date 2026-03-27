import React from "react";
import { View } from "react-native";
import Icon from "../../../../../general/components/Icon";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import { styles } from "../styles";

interface StoreDeliveryInfoProps {
  price: number;
  deliveryTime: number | string;
  distance: number;
}

function formatDeliveryTime(value: number | string) {
  if (typeof value === "string") {
    return value;
  }

  return `${value} mins`;
}

export default function StoreDeliveryInfo({ price, deliveryTime, distance }: StoreDeliveryInfoProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <View style={[styles.infoItem, { gap: 6 }]}>
        <Icon
          type="Ionicons"
          name="bicycle"
          size={20}
          color={colors.mutedText}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon
            type="MaterialIcons"
            name="attach-money"
            size={20}
            color={colors.mutedText}
          />
          <Text
            variant="body"
            weight="medium"
            style={{ color: colors.mutedText }}
          >
            {price}
          </Text>
        </View>
      </View>

      <Icon
        type="Entypo"
        name="dot-single"
        size={20}
        color={colors.border}
      />
      <View style={styles.infoItem}>
        <Icon
          type="Ionicons"
          name="time-outline"
          size={20}
          color={colors.mutedText}
        />
        <Text
          variant="body"
          weight="medium"
          style={[styles.infoText, { color: colors.mutedText }]}
        >
          {formatDeliveryTime(deliveryTime)}
        </Text>
      </View>

      <Icon
        type="Entypo"
        name="dot-single"
        size={20}
        color={colors.border}
      />
      <View style={styles.infoItem}>
        <Icon
          type="Ionicons"
          name="location-outline"
          size={20}
          color={colors.mutedText}
        />
        <Text
          variant="body"
          weight="medium"
          style={[styles.infoText, { color: colors.mutedText }]}
        >
          {distance} km
        </Text>
      </View>
    </View>
  );
}
