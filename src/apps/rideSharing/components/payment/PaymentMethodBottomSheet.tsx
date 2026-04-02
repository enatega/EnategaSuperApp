import React, { memo, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import BottomSheetHandle from '../../../../general/components/BottomSheetHandle';
import SwipeableBottomSheet from '../../../../general/components/SwipeableBottomSheet';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import Button from '../../../../general/components/Button';
import PaymentMethodBadge from './PaymentMethodBadge';
import {
  getPaymentMethodOption,
  PAYMENT_METHOD_OPTIONS,
  type PaymentMethodId,
} from './paymentTypes';

type Props = {
  visible: boolean;
  selectedPaymentMethodId: PaymentMethodId;
  onClose: () => void;
  onSelect: (paymentMethodId: PaymentMethodId) => void;
};

function PaymentMethodBottomSheet({
  visible,
  selectedPaymentMethodId,
  onClose,
  onSelect,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'list' | 'addCard'>('list');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [securityCode, setSecurityCode] = useState('');

  const canSaveCard = useMemo(
    () => cardNumber.trim().length > 0 && expiry.trim().length > 0 && securityCode.trim().length > 0,
    [cardNumber, expiry, securityCode],
  );
  const getPaymentLabel = (paymentMethodId: PaymentMethodId, value?: string) => {
    if (value) {
      return value;
    }

    if (paymentMethodId === 'cash') {
      return t('ride_payment_cash');
    }

    return '';
  };

  const handleClose = () => {
    setMode('list');
    onClose();
  };

  const handleSaveCard = () => {
    if (!canSaveCard) {
      return;
    }

    onSelect('visa');
    setMode('list');
    setCardNumber('');
    setExpiry('');
    setSecurityCode('');
  };

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={handleClose} />

      <SwipeableBottomSheet
        modal
        expandedHeight={mode === 'list' ? 430 + Math.max(insets.bottom, 16) + 18 : 360 + Math.max(insets.bottom, 16) + 18}
        collapsedHeight={0}
        onCollapsed={handleClose}
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surface,
            paddingBottom: Math.max(insets.bottom, 16) + 18,
            shadowColor: colors.shadowColor,
          },
        ]}
        handle={<BottomSheetHandle color={colors.border} />}
      >

        {mode === 'list' ? (
          <>
            <View style={styles.header}>
              <View style={styles.headerSpacer} />
              <Text variant='subtitle' weight="extraBold" >
                {t('ride_payment_choose_title')}
              </Text>
              <Pressable
                onPress={handleClose}
                style={[styles.headerButton, { backgroundColor: colors.backgroundTertiary }]}
              >
                <Icon type="Feather" name="x" size={18} color={colors.text} />
              </Pressable>
            </View>

            <View style={styles.list}>
              {PAYMENT_METHOD_OPTIONS.map((item) => {
                const isSelected = item.id === selectedPaymentMethodId;
                const optionValue = getPaymentMethodOption(item.id).value;

                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      onSelect(item.id);
                      handleClose();
                    }}
                    style={[
                      styles.optionRow,
                      isSelected ? { backgroundColor: colors.surfaceSoft } : null,
                    ]}
                  >
                    <PaymentMethodBadge paymentMethodId={item.id} size="sm" />
                    <View style={styles.optionText}>
                      <Text weight={isSelected ? 'medium' : 'regular'}>
                        {getPaymentLabel(item.id, optionValue)}
                      </Text>
                    </View>
                    {isSelected ? (
                      <Icon type="Feather" name="check" size={18} color={colors.text} />
                    ) : null}
                  </Pressable>
                );
              })}

              <Pressable
                onPress={() => setMode('addCard')}
                style={styles.optionRow}
              >
                <View style={styles.plusWrap}>
                  <Icon type="Feather" name="plus" size={18} color={colors.iconMuted} />
                </View>
                <View style={styles.optionText}>
                  <Text weight="medium">{t('ride_payment_add_method')}</Text>
                </View>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <View style={styles.header}>
              <Pressable
                onPress={() => setMode('list')}
                style={[styles.headerButton, { backgroundColor: colors.backgroundTertiary }]}
              >
                <Icon type="Ionicons" name="arrow-back" size={18} color={colors.text} />
              </Pressable>
              <Text variant='subtitle' weight="extraBold" >
                {t('ride_payment_choose_title')}
              </Text>
              <Pressable
                onPress={handleClose}
                style={[styles.headerButton, { backgroundColor: colors.backgroundTertiary }]}
              >
                <Icon type="Feather" name="x" size={18} color={colors.text} />
              </Pressable>
            </View>

            <View style={styles.form}>
              <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <TextInput
                  placeholder={t('ride_payment_card_number')}
                  placeholderTextColor={colors.mutedText}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  style={[styles.input, { color: colors.text, fontSize: typography.size.md2 }]}
                />
                <Icon type="Feather" name="lock" size={18} color={colors.mutedText} />
              </View>

              <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <TextInput
                  placeholder={t('ride_payment_expiry')}
                  placeholderTextColor={colors.mutedText}
                  value={expiry}
                  onChangeText={setExpiry}
                  style={[styles.input, { color: colors.text, fontSize: typography.size.md2 }]}
                />
              </View>

              <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <TextInput
                  placeholder={t('ride_payment_security_code')}
                  placeholderTextColor={colors.mutedText}
                  value={securityCode}
                  onChangeText={setSecurityCode}
                  style={[styles.input, { color: colors.text, fontSize: typography.size.md2 }]}
                />
                <Icon type="Feather" name="help-circle" size={18} color={colors.mutedText} />
              </View>
            </View>

            <View style={[styles.saveWrap, { borderTopColor: colors.border }]}>
              <Button
                label={t('ride_payment_save')}
                onPress={handleSaveCard}
                disabled={!canSaveCard}
                style={styles.saveButton}
              />
            </View>
          </>
        )}
      </SwipeableBottomSheet>
    </View>
  );
}

export default memo(PaymentMethodBottomSheet);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(9, 9, 11, 0.3)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 999,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerSpacer: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    // fontSize: 24,
    // lineHeight: 28,
    // letterSpacing: -0.36,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingTop: 24,
  },
  optionRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionText: {
    flex: 1,
    marginLeft: 12,
  },
  plusWrap: {
    width: 34,
    alignItems: 'center',
  },
  form: {
    paddingTop: 24,
    paddingHorizontal: 16,
    gap: 12,
  },
  inputWrap: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    minHeight: 44,
  },
  saveWrap: {
    marginTop: 16,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    minHeight: 44,
    borderRadius: 6,
    borderWidth: 0,
  },
});
