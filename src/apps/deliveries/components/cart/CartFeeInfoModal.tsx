import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';
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

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.45)' }]}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <View style={styles.headerRow}>
            <Text
              weight="extraBold"
              style={{
                color: colors.text,
                fontSize: typography.size.h5,
                lineHeight: typography.lineHeight.h5,
              }}
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
      </View>
    </Modal>
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
    marginTop: 6,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
  },
  sheet: {
    borderRadius: 20,
    gap: 18,
    padding: 20,
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
