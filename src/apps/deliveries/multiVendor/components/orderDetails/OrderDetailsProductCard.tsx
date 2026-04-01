import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  imageUri?: string | null;
  name: string;
  quantityLabel: string;
  priceLabel?: string | null;
  subtitle?: string | null;
};

export default function OrderDetailsProductCard({
  imageUri,
  name,
  quantityLabel,
  priceLabel,
  subtitle,
}: Props) {
  const { colors, typography } = useTheme();

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
          <Text
            numberOfLines={2}
            style={[
              styles.subtitle,
              {
                color: colors.mutedText,
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              },
            ]}
            weight="medium"
          >
            {subtitle}
          </Text>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    flex: 1,
    gap: 6,
    minWidth: 0,
  },
  image: {
    borderRadius: 8,
    height: 49,
    width: 56,
  },
  imageFallback: {
    alignItems: 'center',
    borderRadius: 8,
    height: 49,
    justifyContent: 'center',
    width: 56,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    letterSpacing: 0,
  },
  subtitle: {
    letterSpacing: 0,
  },
});
