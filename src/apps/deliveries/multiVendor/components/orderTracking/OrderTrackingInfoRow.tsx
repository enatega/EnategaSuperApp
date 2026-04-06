import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import Icon from "../../../../../general/components/Icon";

type Props = {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  subtitle?: string | null;
  onPress?: () => void;
};

export default function OrderTrackingInfoRow({
  iconName,
  title,
  subtitle,
  onPress,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      style={styles.container}
    >
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: colors.backgroundTertiary,
          },
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
          weight="semiBold"
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
        name="chevron-forward"
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
  subtitle: {
    marginTop: 4,
  },
});
