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

function toPositiveNumber(value: number | string) {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  const parsedValue = Number.parseFloat(value);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

export default function StoreDeliveryInfo({ price, deliveryTime, distance }: StoreDeliveryInfoProps) {
  const { colors } = useTheme();
  const currencyLabel = useDeliveriesCurrencyLabel();
  const deliveryTimeValue = toPositiveNumber(deliveryTime);
  const distanceValue = toPositiveNumber(distance);
  const priceValue = toPositiveNumber(price);
  const infoItems = [
    priceValue != null
      ? {
          iconName: "bicycle",
          iconType: "Ionicons" as const,
          label: formatPrice(priceValue, currencyLabel),
        }
      : null,
    deliveryTimeValue != null
      ? {
          iconName: "time-outline",
          iconType: "Ionicons" as const,
          label: formatDeliveryTime(deliveryTime),
        }
      : null,
    distanceValue != null
      ? {
          iconName: "location-outline",
          iconType: "Ionicons" as const,
          label: `${distanceValue} km`,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item != null);

  if (infoItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.row}>
      {infoItems.map((item, index) => (
        <React.Fragment key={`${item.iconName}-${item.label}`}>
          {index > 0 ? (
            <Icon
              type="Entypo"
              name="dot-single"
              size={16}
              color={colors.border}
            />
          ) : null}
          <View style={[styles.infoItem, index === 0 ? { gap: 6 } : null]}>
            <Icon
              type={item.iconType}
              name={item.iconName}
              size={16}
              color={colors.mutedText}
            />
            <Text
              weight="medium"
              style={[styles.infoText, { color: colors.mutedText }]}
            >
              {item.label}
            </Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}
