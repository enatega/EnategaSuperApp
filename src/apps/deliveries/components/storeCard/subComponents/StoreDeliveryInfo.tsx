import React from "react";
import { View } from "react-native";
import Icon from "../../../../../general/components/Icon";
import Text from "../../../../../general/components/Text";
import { useDeliveriesCurrencyLabel } from "../../../../../general/stores/useAppConfigStore";
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

function formatPrice(value: number, currencyLabel: string) {
  return `${currencyLabel} ${value}`;
}

export default function StoreDeliveryInfo({ price, deliveryTime, distance }: StoreDeliveryInfoProps) {
  const { colors } = useTheme();
  const currencyLabel = useDeliveriesCurrencyLabel();

  return (
    <View style={styles.row}>
      <View style={[styles.infoItem, { gap: 6 }]}>
        <Icon
          type="Ionicons"
          name="bicycle"
          size={16}
          color={colors.mutedText}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            type="MaterialIcons"
            name="attach-money"
            size={16}
            color={colors.mutedText}
          />
          <Text
            weight="medium"
            style={{ color: colors.mutedText, fontSize: 12, lineHeight: 18 }}
          >
            {formatPrice(price, currencyLabel)}
          </Text>
        </View>
      </View>

      <Icon
        type="Entypo"
        name="dot-single"
        size={16}
        color={colors.border}
      />
      <View style={styles.infoItem}>
        <Icon
          type="Ionicons"
          name="time-outline"
          size={16}
          color={colors.mutedText}
        />
        <Text
          weight="medium"
          style={[styles.infoText, { color: colors.mutedText }]}
        >
          {formatDeliveryTime(deliveryTime)}
        </Text>
      </View>

      <Icon
        type="Entypo"
        name="dot-single"
        size={16}
        color={colors.border}
      />
      <View style={styles.infoItem}>
        <Icon
          type="Ionicons"
          name="location-outline"
          size={16}
          color={colors.mutedText}
        />
        <Text
          weight="medium"
          style={[styles.infoText, { color: colors.mutedText }]}
        >
          {distance} km
        </Text>
      </View>
    </View>
  );
}
