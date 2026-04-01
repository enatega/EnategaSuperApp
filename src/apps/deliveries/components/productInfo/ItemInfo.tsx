import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Text from "../../../../general/components/Text";
import Icon from "../../../../general/components/Icon";
import { useTheme } from "../../../../general/theme/theme";

type Props = {
  name: string;
  description: string;
  priceLabel: string;
};

export default function ItemInfo({ name, description, priceLabel }: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        color={colors.text}
        weight="extraBold"
        style={[
          styles.title,
          {
            fontSize: typography.size.h5,
            lineHeight: 38,
          },
        ]}
      >
        {name}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.priceRow}>
          <Text
            color={colors.blue800}
            weight="medium"
            style={{
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {priceLabel}
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.shareButton,
            {
              backgroundColor: colors.backgroundTertiary,
              shadowColor: colors.shadowColor,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Icon
            color={colors.iconColor}
            name="upload"
            size={16}
            type="Feather"
          />
        </Pressable>
      </View>
      {description && (
        <Text
          color={colors.text}
          style={{
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md + 2,
          }}
        >
          {description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  shareButton: {
    alignItems: "center",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: 32,
  },
  title: {
    letterSpacing: -0.36,
  },
});
