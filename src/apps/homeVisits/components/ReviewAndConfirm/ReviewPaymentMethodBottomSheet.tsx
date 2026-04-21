import React, { memo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import BottomSheetHandle from '../../../../general/components/BottomSheetHandle';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

export type ReviewPaymentMethod = 'cash' | 'card';

type Props = {
  visible: boolean;
  selectedMethod: ReviewPaymentMethod;
  totalAmountLabel: string;
  cardMaskedLabel: string;
  onClose: () => void;
  onChangeMethod: (method: ReviewPaymentMethod) => void;
};

type PaymentMethodRowProps = {
  icon: React.ReactNode;
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
};

function PaymentMethodRow({ icon, isSelected = false, label, onPress }: PaymentMethodRowProps) {
  const { colors, typography } = useTheme();
  const isInteractive = Boolean(onPress);

  if (!isInteractive) {
    return (
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <View style={styles.iconWrap}>{icon}</View>
          <Text
            weight="medium"
            style={{
              color: colors.text,
              fontSize: typography.size.sm,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {label}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: isSelected ? colors.backgroundTertiary : colors.background,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.rowLeft}>
        <View style={styles.iconWrap}>{icon}</View>
        <Text
          weight="medium"
          style={{
            color: colors.text,
            fontSize: typography.size.sm,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {label}
        </Text>
      </View>
      {isSelected ? (
        <Ionicons name="checkmark" size={18} color={colors.iconMuted} />
      ) : null}
    </Pressable>
  );
}

function ReviewPaymentMethodBottomSheet({
  cardMaskedLabel,
  onChangeMethod,
  onClose,
  selectedMethod,
  totalAmountLabel,
  visible,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('homeVisits');
  const insets = useSafeAreaInsets();

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <SwipeableBottomSheet
        modal
        collapsedHeight={0}
        expandedHeight={390 + Math.max(insets.bottom, 16)}
        handle={<BottomSheetHandle color={colors.border} />}
        onCollapsed={onClose}
        style={[
          styles.sheet,
          {
            backgroundColor: colors.background,
            paddingBottom: Math.max(insets.bottom, 16),
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text
            weight="bold"
            style={{
              color: colors.text,
              flex: 1,
              fontSize: typography.size.lg,
              lineHeight: typography.lineHeight.lg,
              textAlign: 'center',
            }}
          >
            {t('review_confirm_choose_payment_method_title')}
          </Text>

          <Pressable
            hitSlop={12}
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.backgroundTertiary }]}
          >
            <Ionicons name="close" size={16} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <PaymentMethodRow
            icon={<Ionicons name="wallet-outline" size={20} color={colors.iconMuted} />}
            label={totalAmountLabel}
          />

          <PaymentMethodRow
            icon={<Ionicons name="cash-outline" size={20} color={colors.iconMuted} />}
            isSelected={selectedMethod === 'cash'}
            label={t('review_confirm_payment_title')}
            onPress={() => onChangeMethod('cash')}
          />

          <PaymentMethodRow
            icon={<Ionicons name="card-outline" size={20} color={colors.iconMuted} />}
            isSelected={selectedMethod === 'card'}
            label={cardMaskedLabel}
            onPress={() => onChangeMethod('card')}
          />

          <PaymentMethodRow
            icon={<Ionicons name="add" size={20} color={colors.iconMuted} />}
            label={t('review_confirm_add_payment_method')}
          />
        </View>
      </SwipeableBottomSheet>
    </View>
  );
}

export default memo(ReviewPaymentMethodBottomSheet);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  content: {
    width: '100%',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  headerSpacer: {
    height: 32,
    width: 32,
  },
  iconWrap: {
    width: 34,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 9, 11, 0.3)',
    justifyContent: 'flex-end',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
});
