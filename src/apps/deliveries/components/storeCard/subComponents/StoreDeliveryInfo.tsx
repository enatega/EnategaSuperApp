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

function hasNonZeroPrice(value: number) {
  return Number.isFinite(value) && value > 0;
}

function hasNonZeroDeliveryTime(value: number | string) {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0;
  }

  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return false;
  }

  const numericValue = Number.parseFloat(normalizedValue);
  if (Number.isNaN(numericValue)) {
    return true;
  }

  return numericValue > 0;
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
  const infoItems: React.ReactNode[] = [];

  if (hasNonZeroPrice(price)) {
    infoItems.push(
      <View key="price" style={[styles.infoItem, { gap: 6 }]}>
        <Icon
          type="Ionicons"
          name="bicycle"
          size={16}
          color={colors.mutedText}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            weight="medium"
            style={{ color: colors.mutedText, fontSize: 12, lineHeight: 18 }}
          >
            {formatPrice(price, currencyLabel)}
          </Text>
        </View>
      </View>,
    );
  }

  if (hasNonZeroDeliveryTime(deliveryTime)) {
    infoItems.push(
      <View key="delivery-time" style={styles.infoItem}>
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
      </View>,
    );
  }

  infoItems.push(
    <View key="distance" style={styles.infoItem}>
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
    </View>,
  );

  return (
    <View style={styles.row}>
      {infoItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 ? (
            <Icon
              type="Entypo"
              name="dot-single"
              size={16}
              color={colors.border}
            />
          ) : null}
          {item}
        </React.Fragment>
      ))}
    </View>
  );
}
