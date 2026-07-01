import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import OrderDetailsStatusBadge from "./OrderDetailsStatusBadge";

type Props = {
  logoUri?: string | null;
  orderCode?: string | null;
  orderedAt: string;
  storeName: string;
  storeAddress: string | null;
  statusMessage: string;
  statusTitle: string;
  statusTone: "warning" | "success" | "danger";
};

export default function OrderDetailsHeroSection({
  logoUri,
  orderCode,
  orderedAt,
  storeName,
  storeAddress,
  statusMessage,
  statusTitle,
  statusTone,
}: Props) {
  const { colors, typography } = useTheme();
  const trimmedAddress = storeAddress?.trim() ?? "";
  const normalizedOrderCode = orderCode?.trim() || null;
  const formattedDate = formatHeroOrderDateTime(orderedAt);

  return (
    <View style={styles.hero}>
      <View style={styles.topRow}>
        <View
          style={[
            styles.logoWrap,
            { backgroundColor: colors.blue50 },
          ]}
        >
          {logoUri ? (
            <Image source={{ uri: logoUri }} style={styles.logoImage} />
          ) : (
            <Ionicons color={colors.primary} name="storefront-outline" size={24} />
          )}
        </View>

        <View style={styles.primaryContent}>
          <View style={styles.metaRow}>
            {normalizedOrderCode ? (
              <Text
                style={[
                  styles.orderCode,
                  {
                    color: colors.mutedText,
                    fontSize: typography.size.xs,
                    lineHeight: typography.lineHeight.xs2,
                  },
                ]}
                weight="medium"
              >
                {normalizedOrderCode}
              </Text>
            ) : (
              <View />
            )}

            <OrderDetailsStatusBadge label={statusTitle} tone={statusTone} />
          </View>

          <Text
            style={[
              styles.storeName,
              {
                color: colors.text,
                fontSize: typography.size.lg,
                lineHeight: typography.lineHeight.xs2,
              },
            ]}
            weight="bold"
            numberOfLines={2}
          >
            {storeName}
          </Text>

          {trimmedAddress ? (
            <Text
              style={[
                styles.address,
                {
                  color: colors.text,
                  fontSize: typography.size.md,
                  lineHeight: typography.lineHeight.xs2,
                },
              ]}
              weight="semiBold"
              numberOfLines={3}
            >
              {trimmedAddress}
            </Text>
          ) : null}

          <View style={styles.dateRow}>
            <Ionicons color={colors.iconMuted} name="calendar-outline" size={18} />
            <Text
              style={[
                styles.metaText,
                {
                  color: colors.mutedText,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.xs2,
                },
              ]}
              weight="medium"
            >
              {formattedDate}
            </Text>
          </View>
        </View>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  address: {
    letterSpacing: -0.2,
  },
  dateRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  hero: {
    gap: 16,
  },
  logoImage: {
    borderRadius: 16,
    height: "100%",
    width: "100%",
  },
  logoWrap: {
    alignItems: "center",
    borderRadius: 16,
    height: 42,
    justifyContent: "center",
    overflow: "hidden",
    width: 42,
  },
  metaText: {
    letterSpacing: 0,
  },
  metaRow: {
    alignItems: "flex-start",
    columnGap: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderCode: {
    alignSelf: "center",
    flex: 1,
    textTransform: "uppercase",
  },
  primaryContent: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  statusLabel: {
    letterSpacing: 0.6,
  },
  statusMessage: {
    marginTop: 2,
  },
  statusSection: {
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  storeName: {
    letterSpacing: -0.4,
  },
  topRow: {
    alignItems: "flex-start",
    columnGap: 16,
    flexDirection: "row",
  },
});

function formatHeroOrderDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
