import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../general/components/Text';
import Button from '../../../../general/components/Button';
import { useTheme } from '../../../../general/theme/theme';
import {
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  getCvvLength,
  stripCardNumber,
  validateCardForm,
} from '../../utils/cardFormatting';
import type { PaymentCardBrand } from '../../types/wallet';

type Props = {
  visible: boolean;
  title: string;
  cardNumberPlaceholder: string;
  expiryPlaceholder: string;
  securityCodePlaceholder: string;
  saveLabel: string;
  onSave: (cardNumber: string, expiry: string, securityCode: string) => void;
  onClose: () => void;
};

export default function AddPaymentMethodSheet({
  visible,
  title,
  cardNumberPlaceholder,
  expiryPlaceholder,
  securityCodePlaceholder,
  saveLabel,
  onSave,
  onClose,
}: Props) {
  const { colors } = useTheme();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [touched, setTouched] = useState({ card: false, expiry: false, cvv: false });

  const expiryRef = useRef<TextInput>(null);
  const cvvRef = useRef<TextInput>(null);
  const prevExpiryRef = useRef('');
  const bottomOffset = useRef(new Animated.Value(0)).current;

  // ─── Keyboard handling ────────────────────────────────────────────────────

  useEffect(() => {
    if (!visible) return;

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(bottomOffset, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === 'ios' ? e.duration : 250,
        useNativeDriver: false,
      }).start();
    });

    const onHide = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(bottomOffset, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? (e?.duration ?? 250) : 250,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, [visible, bottomOffset]);

  // Reset offset when sheet closes
  useEffect(() => {
    if (!visible) {
      bottomOffset.setValue(0);
    }
  }, [visible, bottomOffset]);

  // ─── Derived state ────────────────────────────────────────────────────────

  const rawDigits = stripCardNumber(cardNumber);
  const brand: PaymentCardBrand | null = detectCardBrand(rawDigits);
  const cvvLength = getCvvLength(brand);
  const validation = useMemo(
    () => validateCardForm(cardNumber, expiry, cvv, brand),
    [cardNumber, expiry, cvv, brand],
  );

  const brandIcon = useMemo(() => {
    if (brand === 'visa') return '💳';
    if (brand === 'mastercard') return '🟠';
    return null;
  }, [brand]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleCardNumberChange = useCallback((text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
    if (stripCardNumber(formatted).length === 16) {
      expiryRef.current?.focus();
    }
  }, []);

  const handleExpiryChange = useCallback((text: string) => {
    const formatted = formatExpiry(text, prevExpiryRef.current);
    prevExpiryRef.current = formatted;
    setExpiry(formatted);
    if (formatted.length === 7) {
      cvvRef.current?.focus();
    }
  }, []);

  const handleCvvChange = useCallback((text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, cvvLength);
    setCvv(digits);
  }, [cvvLength]);

  const handleSave = useCallback(() => {
    if (validation.isFormValid) {
      Keyboard.dismiss();
      onSave(rawDigits, expiry, cvv);
      setCardNumber('');
      setExpiry('');
      setCvv('');
      setTouched({ card: false, expiry: false, cvv: false });
      prevExpiryRef.current = '';
    }
  }, [validation.isFormValid, rawDigits, expiry, cvv, onSave]);

  const handleClose = useCallback(() => {
    Keyboard.dismiss();
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setTouched({ card: false, expiry: false, cvv: false });
    prevExpiryRef.current = '';
    onClose();
  }, [onClose]);

  // ─── Field error display ──────────────────────────────────────────────────

  const showCardError = touched.card && validation.cardNumberError;
  const showExpiryError = touched.expiry && validation.expiryError;
  const showCvvError = touched.cvv && validation.cvvError;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <Pressable style={styles.overlay} onPress={handleClose}>
          <View style={{ flex: 1 }} />
        </Pressable>
        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: colors.background, bottom: bottomOffset },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable
              onPress={handleClose}
              style={[styles.headerButton, { backgroundColor: colors.backgroundTertiary }]}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={12}
            >
              <Ionicons name="arrow-back" size={16} color={colors.text} />
            </Pressable>
            <Text variant="subtitle" weight="bold" color={colors.text} style={styles.headerTitle}>
              {title}
            </Text>
            <Pressable
              onPress={handleClose}
              style={[styles.headerButton, { backgroundColor: colors.backgroundTertiary }]}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={12}
            >
              <Ionicons name="close" size={16} color={colors.text} />
            </Pressable>
          </View>

          {/* Form */}
          <ScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.form}>
              {/* Card Number */}
              <View style={styles.fieldWrapper}>
                <View
                  style={[
                    styles.inputRow,
                    {
                      borderColor: showCardError ? colors.danger : colors.border,
                      backgroundColor: colors.background,
                    },
                  ]}
                >
                  {brandIcon ? (
                    <Text style={styles.brandIcon}>{brandIcon}</Text>
                  ) : null}
                  <TextInput
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    onBlur={() => setTouched((p) => ({ ...p, card: true }))}
                    placeholder={cardNumberPlaceholder}
                    placeholderTextColor={colors.mutedText}
                    style={[styles.input, { color: colors.text }]}
                    keyboardType="number-pad"
                    maxLength={19}
                    returnKeyType="next"
                    onSubmitEditing={() => expiryRef.current?.focus()}
                    accessibilityLabel={cardNumberPlaceholder}
                  />
                  {rawDigits.length >= 13 && validation.isCardNumberValid ? (
                    <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  ) : (
                    <Ionicons name="lock-closed-outline" size={20} color={colors.mutedText} />
                  )}
                </View>
                {showCardError ? (
                  <Text variant="caption" color={colors.danger} style={styles.errorText}>
                    {validation.cardNumberError}
                  </Text>
                ) : null}
              </View>

              {/* Expiry + CVV row */}
              <View style={styles.splitRow}>
                <View style={styles.splitField}>
                  <View
                    style={[
                      styles.inputRow,
                      {
                        borderColor: showExpiryError ? colors.danger : colors.border,
                        backgroundColor: colors.background,
                      },
                    ]}
                  >
                    <TextInput
                      ref={expiryRef}
                      value={expiry}
                      onChangeText={handleExpiryChange}
                      onBlur={() => setTouched((p) => ({ ...p, expiry: true }))}
                      placeholder={expiryPlaceholder}
                      placeholderTextColor={colors.mutedText}
                      style={[styles.input, { color: colors.text }]}
                      keyboardType="number-pad"
                      maxLength={7}
                      returnKeyType="next"
                      onSubmitEditing={() => cvvRef.current?.focus()}
                      accessibilityLabel={expiryPlaceholder}
                    />
                  </View>
                  {showExpiryError ? (
                    <Text variant="caption" color={colors.danger} style={styles.errorText}>
                      {validation.expiryError}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.splitField}>
                  <View
                    style={[
                      styles.inputRow,
                      {
                        borderColor: showCvvError ? colors.danger : colors.border,
                        backgroundColor: colors.background,
                      },
                    ]}
                  >
                    <TextInput
                      ref={cvvRef}
                      value={cvv}
                      onChangeText={handleCvvChange}
                      onBlur={() => setTouched((p) => ({ ...p, cvv: true }))}
                      placeholder={securityCodePlaceholder}
                      placeholderTextColor={colors.mutedText}
                      style={[styles.input, { color: colors.text }]}
                      keyboardType="number-pad"
                      maxLength={cvvLength}
                      secureTextEntry
                      returnKeyType="done"
                      accessibilityLabel={securityCodePlaceholder}
                    />
                    <Ionicons name="help-circle-outline" size={20} color={colors.mutedText} />
                  </View>
                  {showCvvError ? (
                    <Text variant="caption" color={colors.danger} style={styles.errorText}>
                      {validation.cvvError}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Button
              label={saveLabel}
              onPress={handleSave}
              disabled={!validation.isFormValid}
              style={styles.saveButton}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 9, 11, 0.3)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
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
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 8,
    elevation: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  form: {
    gap: 12,
    paddingHorizontal: 16,
  },
  fieldWrapper: {
    gap: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    height: 44,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  brandIcon: {
    fontSize: 16,
  },
  splitRow: {
    flexDirection: 'row',
    gap: 12,
  },
  splitField: {
    flex: 1,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 16,
    paddingLeft: 4,
  },
  footer: {
    borderTopWidth: 1,
    marginTop: 16,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  saveButton: {
    borderRadius: 6,
  },
});
