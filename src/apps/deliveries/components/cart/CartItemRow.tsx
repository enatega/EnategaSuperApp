import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { CartItem } from '../../api/cartServiceTypes';
import { formatCartPrice, getCartItemSubtitle } from './cartUtils';

type Props = {
  item: CartItem;
  isUpdating?: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove: () => void;
};

export default function CartItemRow({
  item,
  isUpdating = false,
  onDecrement,
  onIncrement,
  onRemove,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const subtitle = getCartItemSubtitle(item);

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={styles.contentRow}>
        <Image
          resizeMode="cover"
          source={{ uri: item.imageUrl?.trim() || 'https://placehold.co/120x120.png' }}
          style={styles.image}
        />

        <View style={styles.details}>
          <View style={styles.titleRow}>
            <View style={styles.textColumn}>
              <Text
                numberOfLines={1}
                weight="semiBold"
                style={{
                  color: colors.text,
                  fontSize: typography.size.md2,
                  lineHeight: typography.lineHeight.md,
                }}
              >
                {item.name}
              </Text>

              {subtitle ? (
                <Text
                  numberOfLines={1}
                  style={{
                    color: colors.mutedText,
                    fontSize: typography.size.sm,
                    lineHeight: typography.lineHeight.sm,
                  }}
                >
                  {subtitle}
                </Text>
              ) : null}
            </View>

            <Ionicons color={colors.text} name="chevron-down" size={18} />
          </View>

          <View style={styles.controlsRow}>
            <View style={styles.quantityControls}>
              <Pressable
                accessibilityLabel={
                  item.quantity > 1 ? t('cart_decrement_item') : t('cart_remove_item')
                }
                accessibilityRole="button"
                disabled={isUpdating}
                onPress={item.quantity > 1 ? onDecrement : onRemove}
                style={({ pressed }) => [
                  styles.iconButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed || isUpdating ? 0.6 : 1,
                  },
                ]}
              >
                <Ionicons
                  color={colors.text}
                  name={item.quantity > 1 ? 'remove' : 'trash-outline'}
                  size={16}
                />
              </Pressable>

              <Text
                weight="semiBold"
                style={{
                  color: colors.text,
                  fontSize: typography.size.md,
                  lineHeight: typography.lineHeight.md,
                }}
              >
                {item.quantity}
              </Text>

              <Pressable
                accessibilityLabel={t('cart_increment_item')}
                accessibilityRole="button"
                disabled={isUpdating}
                onPress={onIncrement}
                style={({ pressed }) => [
                  styles.iconButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed || isUpdating ? 0.6 : 1,
                  },
                ]}
              >
                <Ionicons color={colors.text} name="add" size={16} />
              </Pressable>
            </View>

            <Text
              weight="medium"
              style={{
                color: colors.mutedText,
                fontSize: typography.size.md,
                lineHeight: typography.lineHeight.md,
              }}
            >
              {formatCartPrice(item.lineTotal)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  contentRow: {
    flexDirection: 'row',
    gap: 12,
  },
  controlsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  details: {
    flex: 1,
    gap: 12,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  image: {
    borderRadius: 10,
    height: 44,
    width: 44,
  },
  quantityControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  textColumn: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
});
