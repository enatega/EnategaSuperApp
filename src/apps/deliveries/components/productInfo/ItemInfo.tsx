import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../../../../general/components/Text";
import Icon from "../../../../general/components/Icon";
import { useTheme } from "../../../../general/theme/theme";

type Props = {
  name: string;
  description: string;
  priceLabel: string;
};

export default function ItemInfo({ name, description, priceLabel }: Props) {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        color={colors.text}
        weight="extraBold"
        style={[
          styles.title,
          {
            fontSize: typography.size.xxl,
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
          {/* Todo: can show isPopular, when the backend will send it in responce */}
          {/* <View style={[styles.badge, { backgroundColor: colors.blue800 }]}>
            <Icon color={colors.white} name="flame" size={10} type="Ionicons" />
            <Text
              color={colors.white}
              weight="medium"
              style={{
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {t("popular")}
            </Text>
          </View> */}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.shareButton,
            {
              backgroundColor: colors.backgroundTertiary,
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
  badge: {
    alignItems: "center",
    borderRadius: 6,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  container: {
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 4,
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
    width: 32,
  },
  title: {
    letterSpacing: -0.36,
  },
});
