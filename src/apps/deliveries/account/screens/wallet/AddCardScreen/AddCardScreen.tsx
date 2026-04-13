import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../../../general/components/ScreenHeader';
import Text from '../../../../../../general/components/Text';
import Button from '../../../../../../general/components/Button';
import { useTheme } from '../../../../../../general/theme/theme';

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.slice(i, i + 4));
  }
  return groups.join(' ');
}

function formatExpiry(raw: string, prev: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (raw.length < prev.length) {
    if (prev.endsWith('/') || prev.endsWith('/ ')) return digits.slice(0, 1);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  if (digits.length === 0) return '';
  if (digits.length === 1) {
    const n = parseInt(digits, 10);
    if (n > 1) return `0${digits}/`;
    return digits;
  }
  if (digits.length === 2) {
    const month = parseInt(digits, 10);
    if (month > 12) return `0${digits[0]}/${digits[1]}`;
    return `${digits}/`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function detectBrand(digits: string): 'visa' | 'mastercard' | null {
  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard';
  return null;
}

export default function AddCardScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  const [holderName, setHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const cardRef = useRef<TextInput>(null);
  const expiryRef = useRef<TextInput>(null);
  const cvvRef = useRef<TextInput>(null);
  const prevExpiryRef = useRef('');
  const footerBottom = useRef(new Animated.Value(0)).current;

  const rawDigits = cardNumber.replace(/\D/g, '');
  const brand = detectBrand(rawDigits);
  const isValid = holderName.trim().length > 0 && rawDigits.length >= 13 && expiry.replace(/\D/g, '').length === 4 && cvv.length === 3;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const onShow = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(footerBottom, {
        toValue: e.endCoordinates.height,
        duration: Platform.OS === 'ios' ? e.duration : 250,
        useNativeDriver: false,
      }).start();
    });
    const onHide = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(footerBottom, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? (e?.duration ?? 250) : 250,
        useNativeDriver: false,
      }).start();
    });
    return () => { onShow.remove(); onHide.remove(); };
  }, [footerBottom]);

  const handleCardNumberChange = useCallback((text: string) => {
    const formatted = formatCardNumber(text);
    setCardNumber(formatted);
    if (formatted.replace(/\D/g, '').length === 16) expiryRef.current?.focus();
  }, []);

  const handleExpiryChange = useCallback((text: string) => {
    const formatted = formatExpiry(text, prevExpiryRef.current);
    prevExpiryRef.current = formatted;
    setExpiry(formatted);
    if (formatted.length === 5) cvvRef.current?.focus();
  }, []);

  const handleCvvChange = useCallback((text: string) => {
    setCvv(text.replace(/\D/g, '').slice(0, 3));
  }, []);

  const handleSave = useCallback(() => {
    Keyboard.dismiss();
    // API integration placeholder
    console.log('Save card:', { holderName, cardNumber: rawDigits, expiry, cvv });
  }, [holderName, rawDigits, expiry, cvv]);

  const brandLabel = useMemo(() => {
    if (brand === 'visa') return 'VISA';
    if (brand === 'mastercard') return 'MC';
    return null;
  }, [brand]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={t('wallet_add_card_title')}
        variant="close"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Name on card */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text weight="medium" color={colors.text} style={styles.label}>
              {t('wallet_name_on_card')}
            </Text>
            <Text weight="medium" color={colors.danger} style={styles.required}>*</Text>
          </View>
          <View style={[styles.inputRow, { borderColor: colors.border }]}>
            <TextInput
              value={holderName}
              onChangeText={setHolderName}
              placeholder={t('wallet_name_placeholder')}
              placeholderTextColor={colors.mutedText}
              style={[styles.input, { color: colors.text }]}
              returnKeyType="next"
              onSubmitEditing={() => cardRef.current?.focus()}
              accessibilityLabel={t('wallet_name_on_card')}
            />
          </View>
        </View>

        {/* Card number */}
        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Text weight="medium" color={colors.text} style={styles.label}>
              {t('wallet_card_number_label')}
            </Text>
            <Text weight="medium" color={colors.danger} style={styles.required}>*</Text>
          </View>
          <View style={[styles.inputRow, { borderColor: colors.border }]}>
            <TextInput
              ref={cardRef}
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              placeholder={t('wallet_card_number_placeholder')}
              placeholderTextColor={colors.mutedText}
              style={[styles.input, { color: colors.text }]}
              keyboardType="number-pad"
              maxLength={19}
              returnKeyType="next"
              onSubmitEditing={() => expiryRef.current?.focus()}
              accessibilityLabel={t('wallet_card_number_label')}
            />
            {brandLabel ? (
              <View style={[styles.brandBadge, { borderColor: colors.border }]}>
                <Text weight="bold" color={colors.primary} style={styles.brandText}>{brandLabel}</Text>
              </View>
            ) : (
              <Ionicons name="card-outline" size={20} color={colors.mutedText} />
            )}
          </View>
        </View>

        {/* Expiry + CVV */}
        <View style={styles.splitRow}>
          <View style={styles.splitField}>
            <View style={styles.labelRow}>
              <Text weight="medium" color={colors.text} style={styles.label}>
                {t('wallet_expiry_label')}
              </Text>
              <Text weight="medium" color={colors.danger} style={styles.required}>*</Text>
            </View>
            <View style={[styles.inputRow, { borderColor: colors.border }]}>
              <TextInput
                ref={expiryRef}
                value={expiry}
                onChangeText={handleExpiryChange}
                placeholder="MM/YY"
                placeholderTextColor={colors.mutedText}
                style={[styles.input, { color: colors.text }]}
                keyboardType="number-pad"
                maxLength={5}
                returnKeyType="next"
                onSubmitEditing={() => cvvRef.current?.focus()}
                accessibilityLabel={t('wallet_expiry_label')}
              />
            </View>
          </View>
          <View style={styles.splitField}>
            <View style={styles.labelRow}>
              <Text weight="medium" color={colors.text} style={styles.label}>
                {t('wallet_security_code_label')}
              </Text>
              <Text weight="medium" color={colors.danger} style={styles.required}>*</Text>
            </View>
            <View style={[styles.inputRow, { borderColor: colors.border }]}>
              <TextInput
                ref={cvvRef}
                value={cvv}
                onChangeText={handleCvvChange}
                placeholder="123"
                placeholderTextColor={colors.mutedText}
                style={[styles.input, { color: colors.text }]}
                keyboardType="number-pad"
                maxLength={3}
                secureTextEntry
                returnKeyType="done"
                accessibilityLabel={t('wallet_security_code_label')}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Pay securely row + Save button */}
      <Animated.View style={[styles.footer, { backgroundColor: colors.background, bottom: footerBottom }]}>
        <View style={styles.secureRow}>
          <Text color={colors.mutedText} style={styles.secureText}>
            {t('wallet_pay_securely')}
          </Text>
          <View style={styles.brandIcons}>
            {/* <View style={[styles.payBadge, { backgroundColor: '#EB001B' }]}>
              <Text weight="bold" color="#FFFFFF" style={styles.payBadgeText}>MC</Text>
            </View> */}
            <View style={[styles.payBadge, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]}>
              <Text weight="bold" color={colors.text} style={styles.payBadgeText}>GPay</Text>
            </View>
            <View style={[styles.payBadge, { backgroundColor: '#000000' }]}>
              <Text weight="bold" color="#FFFFFF" style={styles.payBadgeText}>Pay</Text>
            </View>
            <View style={[styles.payBadge, { backgroundColor: '#1A1F71' }]}>
              <Text weight="bold" color="#FFFFFF" style={styles.payBadgeText}>VISA</Text>
            </View>
            {/* <View style={[styles.payBadge, { backgroundColor: '#003087' }]}>
              <Text weight="bold" color="#FFFFFF" style={styles.payBadgeText}>PP</Text>
            </View> */}
          </View>
        </View>
        <Button
          label={t('wallet_save_card')}
          onPress={handleSave}
          disabled={!isValid}
          style={styles.saveButton}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 20, paddingBottom: 140 },
  fieldGroup: { gap: 6 },
  labelRow: { flexDirection: 'row', gap: 2 },
  label: { fontSize: 14, lineHeight: 22 },
  required: { fontSize: 14, lineHeight: 22 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 14,
    gap: 8,
  },
  input: { flex: 1, fontSize: 16, lineHeight: 24 },
  brandBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  brandText: { fontSize: 10, lineHeight: 14 },
  splitRow: { flexDirection: 'row', gap: 12 },
  splitField: { flex: 1, gap: 6 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 34,
    gap: 12,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secureText: { fontSize: 13, lineHeight: 18 },
  brandIcons: { flexDirection: 'row', gap: 6 },
  payBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBadgeText: { fontSize: 10, lineHeight: 14 },
  saveButton: { borderRadius: 8 },
});
