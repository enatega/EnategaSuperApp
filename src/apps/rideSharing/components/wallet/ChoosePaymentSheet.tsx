import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { PaymentCard } from '../../types/wallet';

type Props = {
  visible: boolean;
  cards: PaymentCard[];
  selectedCardId: string | null;
  title: string;
  addMethodLabel: string;
  onSelectCard: (card: PaymentCard) => void;
  onAddPaymentMethod: () => void;
  onClose: () => void;
};

export default function ChoosePaymentSheet({
  visible,
  cards,
  selectedCardId,
  title,
  addMethodLabel,
  onSelectCard,
  onAddPaymentMethod,
  onClose,
}: Props) {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={{ flex: 1 }} />
      </Pressable>
      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <View style={styles.headerPlaceholder} />
          <Text variant="subtitle" weight="bold" color={colors.text} style={styles.headerTitle}>
            {title}
          </Text>
          <Pressable
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.backgroundTertiary }]}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={12}
          >
            <Ionicons name="close" size={16} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.cardList}>
          {cards.map((card) => {
            const isSelected = card.id === selectedCardId;
            return (
              <Pressable
                key={card.id}
                onPress={() => onSelectCard(card)}
                style={[
                  styles.cardRow,
                  { backgroundColor: isSelected ? colors.surfaceSoft : colors.background },
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                <View style={[styles.cardIcon, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Text variant="caption" style={{ fontSize: 10 }}>
                    {card.brand === 'mastercard' ? '🟠' : '💳'}
                  </Text>
                </View>
                <Text variant="caption" weight="medium" color={colors.text} style={styles.cardLabel}>
                  **** {card.lastFour}
                </Text>
                {isSelected && (
                  <Ionicons name="checkmark" size={16} color={colors.findingRidePrimary} />
                )}
              </Pressable>
            );
          })}

          <Pressable
            onPress={onAddPaymentMethod}
            style={[styles.cardRow, { backgroundColor: colors.background }]}
            accessibilityRole="button"
          >
            <Ionicons name="add" size={20} color={colors.text} />
            <Text variant="caption" weight="medium" color={colors.text} style={styles.cardLabel}>
              {addMethodLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 9, 11, 0.3)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 34,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
    position: 'relative',
    zIndex: 8,
    elevation: 8,
  },
  headerPlaceholder: {
    width: 32,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 8,
    elevation: 8,
  },
  cardList: {
    gap: 0,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 40,
    borderRadius: 6,
  },
  cardIcon: {
    width: 34,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
});
