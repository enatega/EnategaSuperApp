import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Image from '../../../general/components/Image';
import Icon from '../../../general/components/Icon';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';
import type { DeliveryOrderAgainItem } from '../api/types';

type Props = {
  item: DeliveryOrderAgainItem;
};

export default function StoreMiniCard({ item }: Props) {
  const { t } = useTranslation('deliveries');
  const { colors, typography } = useTheme();
  const imageUri =
    item.productImage?.trim() ||
    item.storeImage?.trim() ||
    item.storeLogo?.trim() ||
    'https://placehold.co/400x400.png';
  const formattedPrice =
    typeof item.price === 'number' ? `€ ${item.price.toFixed(2)}` : t('multi_vendor_order_again_price_unavailable');

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />

        {item.deal ? (
          <View style={[styles.badge, { backgroundColor: colors.blue800 }]}>
            <Icon type="Feather" name="tag" size={12} color={colors.white} />
            <Text
              color={colors.white}
              weight="medium"
              style={{
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {item.deal}
            </Text>
          </View>
        ) : null}

        <Pressable
          accessibilityLabel={t('multi_vendor_order_again_add_item')}
          accessibilityRole="button"
          style={[styles.addButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Icon type="Feather" name="plus" size={16} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text
          weight="medium"
          color={colors.primary}
          style={{
            fontSize: typography.size.xs2,
            lineHeight: typography.lineHeight.sm,
          }}
        >
          {formattedPrice}
        </Text>

        <Text
          weight="semiBold"
          numberOfLines={1}
          style={{
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {item.productName}
        </Text>

        {item.storeName ? (
          <Text
            color={colors.mutedText}
            numberOfLines={1}
            style={{
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            {item.storeName}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    width: 160,
  },
  imageWrapper: {
    height: 140,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  badge: {
    alignItems: 'center',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 4,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    top: 8,
  },
  addButton: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
    top: 8,
    width: 32,
  },
  content: {
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});
