import React from "react";
import { StyleProp, Text as RNText, TextStyle } from "react-native";
import { useTheme } from "../theme/theme";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: "title" | "subtitle" | "body" | "caption";
  weight?: "regular" | "medium" | "semiBold" | "bold" | "extraBold";
  color?: string;
};

export default function Text({
  children,
  style,
  variant = "body",
  weight = "regular",
  color,
}: Props) {
  const { colors, typography } = useTheme();

  const variantStyle: TextStyle = (() => {
    switch (variant) {
      case "title":
        return {
          fontSize: typography.size.xxl,
          lineHeight: typography.lineHeight.xl,
        };
      case "subtitle":
        return {
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.lg,
        };
      case "caption":
        return {
          fontSize: typography.size.sm,
          lineHeight: typography.lineHeight.sm,
        };
      default:
        return {
          fontSize: typography.size.md,
          lineHeight: typography.lineHeight.md,
        };
    }
  })();

  return (
    <RNText
      style={[
        {
          color: color ?? colors.text,
          fontFamily: typography.fontFamily.regular,
          fontWeight: typography.fontWeight[weight],
        },
        
        variantStyle,
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
