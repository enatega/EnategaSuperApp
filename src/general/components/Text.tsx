import React from "react";
import { StyleProp, Text as RNText, TextStyle } from "react-native";
import { useTheme } from "../theme/theme";

export type TextVariant = "title" | "subtitle" | "body" | "caption";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: TextVariant;
  weight?: "regular" | "medium" | "semiBold" | "bold" | "extraBold";
  color?: string;
  numberOfLines?: number;
};

export default function Text({
  children,
  style,
  variant = "body",
  weight = "regular",
  color,
  numberOfLines,
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
          fontWeight: typography.fontWeight[weight] as any,
        },
        
        variantStyle,
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
}
