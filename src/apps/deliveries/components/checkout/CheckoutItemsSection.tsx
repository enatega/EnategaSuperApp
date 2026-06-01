import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { CartItem } from '../../api/cartServiceTypes';
import { formatCartPrice, getCartItemSubtitle } from '../cart/cartUtils';

type Props = {
  items: CartItem[];
};

export default function CheckoutItemsSection({ items }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text
        weight="extraBold"
        style={{
          color: colors.text,
          fontSize: typography.size.h5,
          lineHeight: typography.lineHeight.h5,
        }}
      >
        {t('cart_items_title')}
      </Text>

      <View style={[styles.list, { borderColor: colors.border }]}> 
        {items.map((item, index) => {
          const subtitle = getCartItemSubtitle(item);
          const hasDivider = index < items.length - 1;

          return (
            <View
              key={item.id}
              style={[
                styles.row,
                hasDivider && { borderBottomColor: colors.border, borderBottomWidth: 1 },
              ]}
            >
              <Image
                resizeMode="cover"
                source={{ uri: item.imageUrl?.trim() || 'https://placehold.co/120x120.png' }}
                style={styles.image}
              />

              <View style={styles.details}>
                <View style={styles.topRow}>
                  <Text
                    numberOfLines={1}
                    weight="semiBold"
                    style={{
                      color: colors.text,
                      flex: 1,
                      fontSize: typography.size.md2,
                      lineHeight: typography.lineHeight.md,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text
                    weight="semiBold"
                    style={{
                      color: colors.text,
                      fontSize: typography.size.md,
                      lineHeight: typography.lineHeight.md,
                    }}
                  >
                    {formatCartPrice(item.lineTotal)}
                  </Text>
                </View>

                {subtitle ? (
                  <Text
                    numberOfLines={2}
                    style={{
                      color: colors.mutedText,
                      fontSize: typography.size.sm,
                      lineHeight: typography.lineHeight.sm,
                    }}
                  >
                    {subtitle}
                  </Text>
                ) : null}

                <Text
                  style={{
                    color: colors.mutedText,
                    fontSize: typography.size.sm,
                    lineHeight: typography.lineHeight.sm,
                  }}
                  weight="medium"
                >
                  {t('order_details_quantity_one', { count: item.quantity })}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  details: {
    flex: 1,
    gap: 4,
  },
  image: {
    borderRadius: 10,
    height: 44,
    width: 44,
  },
  list: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});
