import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { CartItem } from '../../api/cartServiceTypes';
import CartItemRow from './CartItemRow';

type Props = {
  isUpdatingItemId?: string | null;
  items: CartItem[];
  onAddMorePress: () => void;
  onDecrementItem: (itemId: string) => void;
  onIncrementItem: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
};

export default function CartItemsSection({
  isUpdatingItemId,
  items,
  onAddMorePress,
  onDecrementItem,
  onIncrementItem,
  onRemoveItem,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');

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

      <View>
        {items.map((item) => (
          <CartItemRow
            key={item.id}
            isUpdating={isUpdatingItemId === item.id}
            item={item}
            onDecrement={() => onDecrementItem(item.id)}
            onIncrement={() => onIncrementItem(item.id)}
            onRemove={() => onRemoveItem(item.id)}
          />
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onAddMorePress}
        style={styles.addMoreButton}
      >
        <Ionicons color={colors.text} name="add" size={18} />
        <Text
          weight="medium"
          style={{
            color: colors.text,
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {t('cart_add_more')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addMoreButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    paddingTop: 8,
  },
  container: {
    gap: 14,
    paddingHorizontal: 16,
  },
});
