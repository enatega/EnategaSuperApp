import React from "react";
import { StyleSheet, View } from "react-native";
import type { EdgeInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import Button from "../../../../general/components/Button";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";

type Props = {
  countLabel: string;
  disabled: boolean;
  durationLabel?: string | null;
  insets: EdgeInsets;
  isLoading?: boolean;
  onContinue: () => void;
  originalTotalPriceLabel?: string | null;
  totalPriceLabel: string;
};

export default function AppointmentServicesFooter({
  countLabel,
  disabled,
  durationLabel,
  insets,
  isLoading = false,
  onContinue,
  originalTotalPriceLabel,
  totalPriceLabel,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation("appointments");

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.summaryWrap}>
        {originalTotalPriceLabel ? (
          <Text
            style={[
              styles.originalPrice,
              { color: colors.mutedText, fontSize: typography.size.sm },
            ]}
          >
            {originalTotalPriceLabel}
          </Text>
        ) : null}
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md,
          }}
          weight="semiBold"
        >
          {totalPriceLabel}
        </Text>
        <View style={styles.metaRow}>
          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.sm,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            {countLabel}
          </Text>
          {durationLabel ? (
            <>
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.sm,
                  lineHeight: typography.lineHeight.sm,
                }}
              >
                •
              </Text>
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.sm,
                  lineHeight: typography.lineHeight.sm,
                }}
              >
                {durationLabel}
              </Text>
            </>
          ) : null}
        </View>
      </View>

      <Button
        disabled={disabled}
        isLoading={isLoading}
        label={t("services_continue")}
        onPress={onContinue}
        style={[
          styles.button,
          {
            backgroundColor: disabled
              ? colors.backgroundTertiary
              : colors.primary,
            borderColor: disabled ? colors.border : colors.primary,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    flex: 1,
    minHeight: 48,
  },
  container: {
    alignItems: "center",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 2,
  },
  originalPrice: {
    textDecorationLine: "line-through",
  },
  summaryWrap: {
    flex: 1,
  },
});
