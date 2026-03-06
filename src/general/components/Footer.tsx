import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
  withSafeArea?: boolean;
  borderTop?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  paddingHorizontal?: number;
}

const Footer: React.FC<FooterProps> = ({
  children,
  style,
  withSafeArea = true,
  borderTop = false,
  borderColor,
  backgroundColor = "transparent",
  paddingHorizontal = 16,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footer,
        {
          paddingBottom: withSafeArea ? insets.bottom + 12 || 16 : 16,
          paddingHorizontal,
          backgroundColor,
          borderTopWidth: borderTop ? 1 : 0,
          borderTopColor: borderColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    backgroundColor: "red",
  },
});

export default Footer;
