import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";

type Props = {
  etaLabel: string;
  etaValue: string;
};

export default function EstimatedTimeBanner({ etaLabel, etaValue }: Props) {
  const { colors, typography } = useTheme();
  const normalizedEtaValue = etaValue.trim();
  const etaWithUnitMatch = normalizedEtaValue.match(/^(\d+(?:\.\d+)?)\s*(min|mins)$/i);
  const etaAmount = etaWithUnitMatch?.[1];
  const etaUnit = etaWithUnitMatch?.[2]?.toLowerCase() === "mins" ? "min" : etaWithUnitMatch?.[2]?.toLowerCase();

  return (
    <LinearGradient
      colors={[colors.blue800, colors.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <Text color={colors.white} style={styles.label} weight="medium">
        {etaLabel}
      </Text>
      <View style={styles.content}>
        {etaAmount && etaUnit ? (
          <View style={styles.valueRow}>
            <Text
              color={colors.white}
              style={[
                styles.valueAmount,
                {
                  fontFamily: typography.fontFamily.bold,
                  fontSize: typography.size.xxl,
                  lineHeight: typography.lineHeight.xl,
                },
              ]}
              weight="bold"
            >
              {etaAmount}
            </Text>
            <Text
              color={colors.white}
              style={[
                styles.valueUnit,
                {
                  fontSize: typography.size.md,
                  lineHeight: typography.lineHeight.md,
                },
              ]}
              weight="semiBold"
            >
              {etaUnit}
            </Text>
          </View>
        ) : (
          <Text
            color={colors.white}
            style={[
              styles.valueFallback,
              {
                fontFamily: typography.fontFamily.bold,
                fontSize: typography.size.xxl,
                lineHeight: typography.lineHeight.xl,
              },
            ]}
            weight="bold"
          >
            {etaValue}
          </Text>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  content: {
    marginTop: 2,
  },
  label: {
    opacity: 0.92,
  },
  valueAmount: {
    letterSpacing: -0.48,
  },
  valueFallback: {
    letterSpacing: -0.48,
  },
  valueRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
  },
  valueUnit: {
    opacity: 0.95,
    paddingBottom: 3,
  },
});
