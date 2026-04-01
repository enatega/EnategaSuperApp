import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import type { PastOrderItem } from "../../../api/ordersServiceTypes";

type Props = {
  order: PastOrderItem;
  onPress?: (order: PastOrderItem) => void;
  title?: string;
  statusLabel?: string;
  statusTone?: "warning" | "success" | "danger";
};

function formatOrderDate(dateString: string) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatOrderPrice(amount: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatOrderStatus(status: string) {
  if (!status) {
    return "";
  }

  return status
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const OrderListCard = ({
  order,
  onPress,
  title,
  statusLabel,
  statusTone = "warning",
}: Props) => {
  const { colors, typography } = useTheme();
  const imageUri = order.storeImage ?? order.storeLogo ?? undefined;
  const resolvedStatusLabel = statusLabel ?? formatOrderStatus(order.orderStatus);
  const badgeColors =
    statusTone === "success"
      ? {
          backgroundColor: colors.successSoft,
          textColor: colors.successText,
        }
      : statusTone === "danger"
        ? {
            backgroundColor: colors.dangerSoft,
            textColor: colors.dangerText,
          }
        : {
            backgroundColor: colors.warningSoft,
            textColor: colors.warningText,
          };

  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress ? () => onPress(order) : undefined}
      style={styles.container}
    >
      <View style={styles.leftContent}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
          />
        ) : (
          <View
            style={[
              styles.imageFallback,
              {
                backgroundColor: colors.backgroundTertiary,
              },
            ]}
          >
            <Text
              weight="extraBold"
              style={{
                color: colors.mutedText,
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.md,
              }}
            >
              {order.storeName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.info}>
          <Text
            weight="medium"
            numberOfLines={1}
            style={[
              styles.name,
              {
                color: colors.text,
                fontSize: typography.size.md2,
                lineHeight: typography.lineHeight.md,
              },
            ]}
          >
            {title ?? order.storeName}
          </Text>
          <Text
            weight="medium"
            style={[
              styles.time,
              {
                color: colors.mutedText,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              },
            ]}
          >
            {formatOrderDate(order.orderedAt)}
          </Text>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: badgeColors.backgroundColor,
              },
            ]}
          >
            <Text
              weight="medium"
              style={{
                color: badgeColors.textColor,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {resolvedStatusLabel}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.rightContent}>
        <Text
          weight="medium"
          style={{
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {formatOrderPrice(order.orderPrice)}
        </Text>
        <MaterialCommunityIcons
          color={colors.iconColor}
          name="chevron-right"
          size={24}
        />
      </View>
    </Pressable>
  );
};

export default OrderListCard;

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 6,
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    borderRadius: 8,
    height: 48,
    width: 48,
  },
  imageFallback: {
    alignItems: "center",
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  info: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  leftContent: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  name: {
    letterSpacing: 0,
  },
  rightContent: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginLeft: 12,
  },
  time: {
    letterSpacing: 0,
  },
});
