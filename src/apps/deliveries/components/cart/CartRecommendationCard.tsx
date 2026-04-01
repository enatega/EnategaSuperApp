import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { DeliveryOrderAgainItem } from '../../api/types';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { formatCartPrice } from './cartUtils';

type Props = {
  item: DeliveryOrderAgainItem;
  onPress: () => void;
};

export default function CartRecommendationCard({ item, onPress }: Props) {
  const { colors, typography } = useTheme();
  const imageUri =
    item.productImage?.trim() ||
    item.storeImage?.trim() ||
    item.storeLogo?.trim() ||
    'https://placehold.co/320x180.png';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={styles.imageWrap}>
        <Image resizeMode="cover" source={{ uri: imageUri }} style={styles.image} />
        <Pressable
          accessibilityRole="button"
          onPress={() => undefined}
          style={[styles.addButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Ionicons color={colors.text} name="add" size={18} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text
          weight="semiBold"
          style={{
            color: colors.text,
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {item.productName}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.ratingRow}>
            <Ionicons color={colors.yellow500} name="star" size={14} />
            <Text
              style={{
                color: colors.text,
                fontSize: typography.size.sm,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              4.1
            </Text>
            <Text
              style={{
                color: colors.mutedText,
                fontSize: typography.size.sm,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              (5000+)
            </Text>
          </View>

          {item.storeName ? (
            <Text
              style={{
                color: colors.mutedText,
                fontSize: typography.size.sm,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {item.storeName}
            </Text>
          ) : null}
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.footerRow}>
          <View style={styles.detailRow}>
            <Ionicons color={colors.mutedText} name="bicycle-outline" size={14} />
            <Text
              style={{
                color: colors.mutedText,
                fontSize: typography.size.sm,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              $2
            </Text>
          </View>

          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.sm,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            {formatCartPrice(item.price ?? 0)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    width: 36,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    width: 282,
  },
  content: {
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  detailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  divider: {
    height: 1,
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageWrap: {
    height: 140,
    overflow: 'hidden',
    position: 'relative',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
});
