import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import { Image, Pressable, View } from "react-native";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import { styles } from "./OrderDetailsProductCard.styles";

type Props = {
  addonLines?: string[];
  imageUri?: string | null;
  name: string;
  quantityLabel: string;
  priceLabel?: string | null;
  subtitle?: string | null;
};

export default function OrderDetailsProductCard({
  addonLines = [],
  imageUri,
  name,
  quantityLabel,
  priceLabel,
  subtitle,
}: Props) {
  const { colors, typography } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasAddons = addonLines.length > 0;

  return (
    <View style={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View
          style={[
            styles.imageFallback,
            { backgroundColor: colors.backgroundTertiary },
          ]}
        >
          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
            weight="extraBold"
          >
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <Text
          numberOfLines={1}
          style={[
            styles.name,
            {
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            },
          ]}
          weight="semiBold"
        >
          {name}
        </Text>

        {subtitle ? (
          <View style={styles.subtitleRow}>
            <Text
              numberOfLines={isExpanded ? undefined : 1}
              style={[
                styles.subtitle,
                {
                  color: colors.mutedText,
                  flex: 1,
                  fontSize: typography.size.xs2,
                  lineHeight: typography.lineHeight.sm,
                },
              ]}
              weight="medium"
            >
              {subtitle}
            </Text>

            {hasAddons ? (
              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => setIsExpanded((previousState) => !previousState)}
                style={styles.chevronButton}
              >
                <MaterialCommunityIcons
                  color={colors.iconColor}
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={18}
                />
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {isExpanded && hasAddons ? (
          <View style={styles.addonList}>
            {addonLines.map((addonLine, index) => (
              <Text
                key={`${addonLine}-${index}`}
                style={[
                  styles.addonText,
                  {
                    color: colors.mutedText,
                    fontSize: typography.size.xs2,
                    lineHeight: typography.lineHeight.sm,
                  },
                ]}
                weight="medium"
              >
                {addonLine}
              </Text>
            ))}
          </View>
        ) : null}

        <View style={styles.metaRow}>
          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
            weight="medium"
          >
            {quantityLabel}
          </Text>

          {priceLabel ? (
            <Text
              style={{
                color: colors.mutedText,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
              weight="medium"
            >
              {priceLabel}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
