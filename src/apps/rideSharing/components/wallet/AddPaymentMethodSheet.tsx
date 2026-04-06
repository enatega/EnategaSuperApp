import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../general/components/Text';
import Button from '../../../../general/components/Button';
import { useTheme } from '../../../../general/theme/theme';

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
  const [securityCode, setSecurityCode] = useState('');

  const isValid = cardNumber.length > 0 && expiry.length > 0 && securityCode.length > 0;

  const handleSave = () => {
    if (isValid) {
      onSave(cardNumber, expiry, securityCode);
      setCardNumber('');
      setExpiry('');
      setSecurityCode('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={{ flex: 1 }} />
      </Pressable>
      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Pressable
            onPress={onClose}
            style={[styles.headerButton, { backgroundColor: colors.backgroundTertiary }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={16} color={colors.text} />
          </Pressable>
          <Text variant="subtitle" weight="bold" color={colors.text} style={styles.headerTitle}>
            {title}
          </Text>
          <Pressable
            onPress={onClose}
            style={[styles.headerButton, { backgroundColor: colors.backgroundTertiary }]}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={16} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.form}>
          <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <TextInput
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholder={cardNumberPlaceholder}
              placeholderTextColor={colors.mutedText}
              style={[styles.input, { color: colors.text }]}
              keyboardType="number-pad"
              maxLength={19}
              accessibilityLabel={cardNumberPlaceholder}
            />
            <Ionicons name="lock-closed-outline" size={20} color={colors.mutedText} />
          </View>

          <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <TextInput
              value={expiry}
              onChangeText={setExpiry}
              placeholder={expiryPlaceholder}
              placeholderTextColor={colors.mutedText}
              style={[styles.input, { color: colors.text }]}
              keyboardType="number-pad"
              maxLength={7}
              accessibilityLabel={expiryPlaceholder}
            />
          </View>

          <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <TextInput
              value={securityCode}
              onChangeText={setSecurityCode}
              placeholder={securityCodePlaceholder}
              placeholderTextColor={colors.mutedText}
              style={[styles.input, { color: colors.text }]}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              accessibilityLabel={securityCodePlaceholder}
            />
            <Ionicons name="help-circle-outline" size={20} color={colors.mutedText} />
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Button
            label={saveLabel}
            onPress={handleSave}
            disabled={!isValid}
            style={styles.saveButton}
          />
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
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  form: {
    gap: 12,
    paddingHorizontal: 16,
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
