import React from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../../../general/components/Button';
import BottomSheetHandle from '../../../../general/components/BottomSheetHandle';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { CART_MINIMUM_SPEND, CART_SMALL_ORDER_FEE, formatCartPrice } from './cartUtils';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function CartFeeInfoModal({ visible, onClose }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const expandedHeight = Math.min(height * 0.5, 460) + insets.bottom;

  if (!visible) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.modalRoot}>
      <Pressable
        onPress={onClose}
        style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.45)' }]}
      />

      <SwipeableBottomSheet
        collapsedHeight={0}
        expandedHeight={expandedHeight}
        handle={<BottomSheetHandle color={colors.border} />}
        initialState="expanded"
        modal
        onStateChange={(state) => {
          if (state === 'collapsed') {
            onClose();
          }
        }}
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surface,
            shadowColor: colors.shadowColor,
          }
        ]}
      >
        <View
          style={[
            styles.content,
            {
              paddingBottom: insets.bottom + 20,
            },
          ]}
        >
          <View style={styles.headerRow}>
            <View style={styles.headerSpacer} />
            <Text
              variant="subtitle"
              weight="extraBold"
              numberOfLines={1}
              style={[styles.headerTitle, { color: colors.text }]}
            >
              {t('cart_fee_modal_title')}
            </Text>

            <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
              <Ionicons color={colors.mutedText} name="close" size={20} />
            </Pressable>
          </View>

          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.md,
              lineHeight: typography.lineHeight.md + 2,
            }}
          >
            {t('cart_fee_modal_description_prefix')}
            <Text
              weight="semiBold"
              style={{
                color: colors.text,
                fontSize: typography.size.md,
                lineHeight: typography.lineHeight.md + 2,
              }}
            >
              {formatCartPrice(CART_MINIMUM_SPEND)}
            </Text>
            {t('cart_fee_modal_description_suffix')}
          </Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text
                weight="semiBold"
                style={{
                  color: colors.text,
                  fontSize: typography.size.md2,
                  lineHeight: typography.lineHeight.md,
                }}
              >
                {t('cart_fee_modal_total_cart_value')}
              </Text>
              <Text
                weight="semiBold"
                style={{
                  color: colors.text,
                  fontSize: typography.size.md2,
                  lineHeight: typography.lineHeight.md,
                }}
              >
                {t('cart_fee_modal_service_fee')}
              </Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={{ color: colors.mutedText }}>
                {formatCartPrice(1)} - {formatCartPrice(CART_MINIMUM_SPEND - 0.01)}
              </Text>
              <Text style={{ color: colors.mutedText }}>{formatCartPrice(CART_SMALL_ORDER_FEE)}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={{ color: colors.mutedText }}>
                {formatCartPrice(CART_MINIMUM_SPEND)} & {t('cart_fee_modal_above')}
              </Text>
              <Text style={{ color: colors.mutedText }}>{t('cart_fee_modal_no_fee')}</Text>
            </View>
          </View>

          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.sm,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            {t('cart_fee_modal_note_prefix')}
            <Text
              weight="semiBold"
              style={{
                color: colors.text,
                fontSize: typography.size.sm,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {formatCartPrice(CART_MINIMUM_SPEND)}
            </Text>
            {t('cart_fee_modal_note_middle')}
            <Text
              weight="semiBold"
              style={{
                color: colors.text,
                fontSize: typography.size.sm,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {formatCartPrice(CART_SMALL_ORDER_FEE)}
            </Text>
            {t('cart_fee_modal_note_suffix')}
          </Text>

          <Button label={t('store_details_close')} onPress={onClose} style={styles.cta} />
        </View>
      </SwipeableBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  cta: {
    marginTop: 4,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  headerSpacer: {
    height: 28,
    width: 28,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  content: {
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  handle: {
    borderRadius: 999,
    height: 4,
    width: 40,
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 12,
    paddingTop: 4,
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
    paddingTop: 12,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
  },
  table: {
    gap: 14,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
