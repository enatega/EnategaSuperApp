import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../../../../general/components/Button";
import Icon from "../../../../general/components/Icon";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";

type Props = {
  quantity: number;
  totalPriceLabel: string;
  isSubmitting?: boolean;
  isDisabled?: boolean;
  onAddToCart: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
};

export default function Footer({
  quantity,
  totalPriceLabel,
  isSubmitting = false,
  isDisabled = false,
  onAddToCart,
  onIncrement,
  onDecrement,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom + 12,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.stepper}>
          <Pressable
            disabled={isSubmitting}
            onPress={onDecrement}
            style={({ pressed }) => [
              styles.iconButton,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                shadowColor: colors.shadowColor,
                opacity: isSubmitting ? 0.5 : pressed ? 0.7 : 1,
              },
            ]}
          >
            <Icon
              color={colors.iconColor}
              name="remove"
              size={16}
              type="Ionicons"
            />
          </Pressable>

          <Text
            color={colors.text}
            weight="semiBold"
            style={{
              fontSize: typography.size.h5,
              fontVariant: ["tabular-nums"],
              lineHeight: typography.lineHeight.h5,
            }}
          >
            {quantity}
          </Text>

          <Pressable
            disabled={isSubmitting}
            onPress={onIncrement}
            style={({ pressed }) => [
              styles.iconButton,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                shadowColor: colors.shadowColor,
                opacity: isSubmitting ? 0.5 : pressed ? 0.7 : 1,
              },
            ]}
          >
            <Icon
              color={colors.iconColor}
              name="add"
              size={16}
              type="Ionicons"
            />
          </Pressable>
        </View>

        <Button
          disabled={isDisabled}
          isLoading={isSubmitting}
          label={`${t("add_to_cart")} - ${totalPriceLabel}`}
          onPress={onAddToCart}
          style={styles.cta}
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  cta: {
    borderRadius: 6,
    flex: 1,
    minHeight: 48,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: 32,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: 24,
  },
  stepper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
});
