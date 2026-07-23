import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Icon from "../../../../general/components/Icon";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import { typography } from "../../../../general/theme/typography";
import type { AppointmentCoupon } from "../../api/couponsService";

type Props = {
  coupon: AppointmentCoupon;
  isBusy: boolean;
  onToggle: (coupon: AppointmentCoupon) => void;
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

export default function AppointmentCouponCard({
  coupon,
  isBusy,
  onToggle,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation("appointments");
  const isPercentage = coupon.discount_type
    .toUpperCase()
    .includes("PERCENTAGE");
  const discountLabel = isPercentage
    ? `${coupon.discount_value}%`
    : `$${coupon.discount_value}`;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.backgroundTertiary },
      ]}
    >
      <View style={[styles.valueBlock, { backgroundColor: colors.primaryDark }]}>
        <Text color={colors.white} style={styles.value} weight="extraBold">
          {discountLabel}
        </Text>
        <Text color={colors.white} style={styles.off} weight="bold">
          {t("coupons_off")}
        </Text>
      </View>
      <View style={[styles.separator, { borderColor: colors.border }]} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            color={colors.text}
            numberOfLines={1}
            style={styles.title}
            weight="bold"
          >
            {coupon.name}
          </Text>
          <View style={[styles.codeBadge, { backgroundColor: colors.blue100 }]}>
            <Text color={colors.primary} style={styles.code} weight="bold">
              {coupon.code}
            </Text>
          </View>
        </View>
        {coupon.description ? (
          <Text
            color={colors.mutedText}
            numberOfLines={2}
            style={styles.description}
          >
            {coupon.description}
          </Text>
        ) : null}
        <View style={styles.metaRow}>
          <Icon color={colors.iconMuted} name="bag-handle-outline" size={14} />
          <Text color={colors.iconMuted} style={styles.meta}>
            {t("coupons_minimum", { value: coupon.min_order_value })}
          </Text>
        </View>
        <Text color={colors.warningText} style={styles.validity}>
          {t("coupons_valid_until", { date: formatDate(coupon.end_date) })}
        </Text>
        <Pressable
          accessibilityRole="button"
          disabled={isBusy}
          onPress={() => onToggle(coupon)}
          style={({ pressed }) => [
            styles.action,
            {
              borderColor: colors.border,
              opacity: isBusy ? 0.5 : pressed ? 0.75 : 1,
            },
          ]}
        >
          <Text color={colors.primary} style={styles.actionText} weight="bold">
            {coupon.is_active
              ? t("coupons_deactivate")
              : t("coupons_use")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
    paddingVertical: 9,
  },
  actionText: { fontSize: typography.size.sm2 },
  card: {
    borderRadius: 14,
    flexDirection: "row",
    minHeight: 184,
    overflow: "hidden",
  },
  code: { fontSize: typography.size.xs2 },
  codeBadge: {
    borderRadius: 7,
    maxWidth: 96,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  content: {
    flex: 1,
    gap: 7,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  description: {
    fontSize: typography.size.sm2,
    lineHeight: typography.lineHeight.md,
  },
  meta: { fontSize: typography.size.xs2 },
  metaRow: { alignItems: "center", flexDirection: "row", gap: 6 },
  off: { fontSize: typography.size.sm2 },
  separator: {
    borderLeftWidth: 1,
    borderStyle: "dashed",
  },
  title: { flex: 1, fontSize: typography.size.md2 },
  titleRow: { alignItems: "center", flexDirection: "row", gap: 8 },
  validity: { fontSize: typography.size.xs2 },
  value: { fontSize: typography.size.xl2 },
  valueBlock: {
    alignItems: "center",
    justifyContent: "center",
    width: 88,
  },
});
