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
  onPendingChange?: (itemId: string, isPending: boolean) => void;
  onSetQuantity: (quantity: number) => Promise<void>;
  onRemove: () => void;
};

const QUANTITY_SYNC_DEBOUNCE_MS = 500;

export default function CartItemRow({
  item,
  isUpdating = false,
  onPendingChange,
  onSetQuantity,
  onRemove,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const subtitle = getCartItemSubtitle(item);
  const [localQuantity, setLocalQuantity] = React.useState(item.quantity);
  const desiredQuantityRef = React.useRef(item.quantity);
  const inflightQuantityRef = React.useRef<number | null>(null);
  const queuedQuantityRef = React.useRef<number | null>(null);
  const isSyncingRef = React.useRef(false);
  const debounceTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPendingRef = React.useRef(false);
  const displayedLineTotal = item.unitPrice * localQuantity;
  const hasPendingState = isUpdating || localQuantity !== item.quantity;

  const clearDebounceTimeout = React.useCallback(() => {
    if (!debounceTimeoutRef.current) {
      return;
    }

    clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = null;
  }, []);

  const flushQuantity = React.useCallback(
    async (targetQuantity: number) => {
      if (targetQuantity < 1 || targetQuantity === item.quantity) {
        return;
      }

      isSyncingRef.current = true;
      inflightQuantityRef.current = targetQuantity;

      try {
        await onSetQuantity(targetQuantity);
      } finally {
        isSyncingRef.current = false;

        const queuedQuantity = queuedQuantityRef.current;
        if (queuedQuantity != null && queuedQuantity !== targetQuantity) {
          queuedQuantityRef.current = null;
          void flushQuantity(queuedQuantity);
        }
      }
    },
    [item.quantity, onSetQuantity],
  );

  const scheduleQuantitySync = React.useCallback(() => {
    clearDebounceTimeout();

    debounceTimeoutRef.current = setTimeout(() => {
      const targetQuantity = desiredQuantityRef.current;

      if (isSyncingRef.current) {
        queuedQuantityRef.current = targetQuantity;
        return;
      }

      void flushQuantity(targetQuantity);
    }, QUANTITY_SYNC_DEBOUNCE_MS);
  }, [clearDebounceTimeout, flushQuantity]);

  React.useEffect(() => {
    const desiredQuantity = desiredQuantityRef.current;
    const inflightQuantity = inflightQuantityRef.current;

    if (item.quantity === desiredQuantity) {
      desiredQuantityRef.current = item.quantity;
      inflightQuantityRef.current = null;
      setLocalQuantity(item.quantity);
      return;
    }

    if (inflightQuantity === item.quantity) {
      return;
    }

    desiredQuantityRef.current = item.quantity;
    inflightQuantityRef.current = null;
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  React.useEffect(() => () => {
    clearDebounceTimeout();
  }, [clearDebounceTimeout]);

  React.useEffect(() => {
    if (!onPendingChange || lastPendingRef.current === hasPendingState) {
      return;
    }

    lastPendingRef.current = hasPendingState;
    onPendingChange(item.id, hasPendingState);
  }, [hasPendingState, item.id, onPendingChange]);

  React.useEffect(
    () => () => {
      if (onPendingChange && lastPendingRef.current) {
        onPendingChange(item.id, false);
      }
    },
    [item.id, onPendingChange],
  );

  const updateLocalQuantity = React.useCallback(
    (nextQuantity: number) => {
      desiredQuantityRef.current = nextQuantity;
      setLocalQuantity(nextQuantity);
      scheduleQuantitySync();
    },
    [scheduleQuantitySync],
  );

  const handleIncrement = React.useCallback(() => {
    updateLocalQuantity(localQuantity + 1);
  }, [localQuantity, updateLocalQuantity]);

  const handleDecrement = React.useCallback(() => {
    if (localQuantity <= 1) {
      return;
    }

    updateLocalQuantity(localQuantity - 1);
  }, [localQuantity, updateLocalQuantity]);

  const handleRemove = React.useCallback(() => {
    clearDebounceTimeout();
    desiredQuantityRef.current = item.quantity;
    inflightQuantityRef.current = null;
    queuedQuantityRef.current = null;
    onRemove();
  }, [clearDebounceTimeout, item.quantity, onRemove]);

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
                  localQuantity > 1 ? t('cart_decrement_item') : t('cart_remove_item')
                }
                accessibilityRole="button"
                onPress={localQuantity > 1 ? handleDecrement : handleRemove}
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
                  name={localQuantity > 1 ? 'remove' : 'trash-outline'}
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
                {localQuantity}
              </Text>

              <Pressable
                accessibilityLabel={t('cart_increment_item')}
                accessibilityRole="button"
                onPress={handleIncrement}
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
              {formatCartPrice(displayedLineTotal)}
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
