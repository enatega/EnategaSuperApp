import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View, type ViewStyle } from "react-native";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";
import Icon from "../../../../general/components/Icon";

type Props = {
  containerStyle?: ViewStyle;
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  iconWrapperStyle?: ViewStyle;
  isCompact?: boolean;
  isIconContained?: boolean;
  trailingIconName?: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string | null;
  onPress?: () => void;
};

export default function OrderTrackingInfoRow({
  containerStyle,
  iconName,
  iconWrapperStyle,
  isCompact = false,
  isIconContained = true,
  title,
  subtitle,
  onPress,
  trailingIconName = "chevron-forward",
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={[styles.container, isCompact && styles.containerCompact, containerStyle]}
    >
      <View
        style={[
          styles.iconWrapper,
          isCompact && styles.iconWrapperCompact,
          isIconContained
            ? {
                backgroundColor: colors.backgroundTertiary,
              }
            : styles.iconWrapperBare,
          iconWrapperStyle,
        ]}
      >
        <Icon type="Ionicons" color={colors.text} name={iconName} size={20} />
      </View>

      <View style={styles.content}>
        <Text
          color={colors.text}
          style={{
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md,
          }}
          weight={isCompact ? "medium" : "semiBold"}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            color={colors.mutedText}
            style={styles.subtitle}
            weight="medium"
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      <Icon
        type="Ionicons"
        color={colors.iconMuted}
        name={trailingIconName}
        size={20}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 16,
  },
  containerCompact: {
    paddingVertical: 8,
  },
  content: {
    flex: 1,
  },
  iconWrapper: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  iconWrapperBare: {
    backgroundColor: "transparent",
    borderRadius: 0,
    height: 24,
    width: 24,
  },
  iconWrapperCompact: {
    height: 24,
    width: 24,
  },
  subtitle: {
    marginTop: 2,
  },
});
