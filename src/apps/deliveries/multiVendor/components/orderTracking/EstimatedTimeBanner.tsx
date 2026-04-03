import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";

type Props = {
  etaLabel: string;
  etaValue: string;
};

export default function EstimatedTimeBanner({ etaLabel, etaValue }: Props) {
  const { colors, typography } = useTheme();

  return (
    <LinearGradient
      colors={[colors.bannerGradientStart, colors.bannerGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text color={colors.white} style={styles.label} weight="medium">
        {etaLabel}
      </Text>
      <View style={styles.content}>
        <Text
          color={colors.white}
          style={[
            styles.value,
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
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  content: {
    marginTop: 6,
  },
  label: {
    opacity: 0.92,
  },
  value: {
    letterSpacing: -0.4,
  },
});
