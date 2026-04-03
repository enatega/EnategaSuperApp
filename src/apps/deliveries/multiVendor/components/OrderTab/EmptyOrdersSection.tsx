import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import Svg, { type SvgName } from "../../../components/Svg";

type Props = {
  title: string;
  description: string;
  ctaLabel: string;
  svgName?: SvgName;
  onPress?: () => void;
};

const EmptyOrdersSection = ({
  title,
  description,
  ctaLabel,
  svgName = "noResultsFound",
  onPress,
}: Props) => {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        <Svg
          name={svgName}
          width={200}
          height={200}
        />
      </View>
      <View style={styles.content}>
        <Text
          weight="bold"
          style={[
            styles.title,
            {
              color: colors.text,
              fontSize: typography.size.xxl,
              lineHeight: typography.lineHeight.xl,
            },
          ]}
        >
          {title}
        </Text>
        <Text
          weight="medium"
          style={[
            styles.subtitle,
            {
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            },
          ]}
        >
          {description}
        </Text>
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          style={[
            styles.button,
            {
              backgroundColor: colors.blue100,
            },
          ]}
        >
          <Text
            weight="medium"
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {ctaLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default EmptyOrdersSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 72,
  },
  illustrationContainer: {
    marginBottom: 8,
  },
  content: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.48,
  },
  subtitle: {
    maxWidth: 318,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    height: 44,
    borderRadius: 6,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
