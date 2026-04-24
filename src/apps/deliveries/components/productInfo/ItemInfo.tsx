import React from "react";
import { Pressable, Share, StyleSheet, View } from "react-native";
import { useTranslation } from 'react-i18next';
import Text from "../../../../general/components/Text";
import Icon from "../../../../general/components/Icon";
import { useTheme } from "../../../../general/theme/theme";

type Props = {
  name: string;
  description?: string | null;
  priceLabel: string;
};

export default function ItemInfo({ name, description, priceLabel }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');

  const handleSharePress = React.useCallback(() => {
    const shareText = [name, priceLabel, description]
      .map((value) => (typeof value === 'string' ? value.trim() : ''))
      .filter(Boolean)
      .join('\n');

    if (!shareText) {
      return;
    }

    void Share.share({
      message: shareText,
      title: name,
    }).catch(() => {
      // Ignore canceled/failed share action.
    });
  }, [description, name, priceLabel]);

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
          accessibilityLabel={t('store_details_action_share')}
          accessibilityRole="button"
          onPress={handleSharePress}
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
