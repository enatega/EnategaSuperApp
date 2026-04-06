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
      colors={[colors.blue800, colors.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
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
  value: {
    letterSpacing: -0.48,
  },
});
