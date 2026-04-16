import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import SvgAndTextWrapper from '../../../../general/components/auth/general/SvgAndTextWrapper';
import TextInputField from '../../../../general/components/auth/TextInputField';

type Props = {
  newPassword: string;
  confirmPassword: string;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  newPasswordPlaceholder: string;
  confirmPasswordPlaceholder: string;
};

export default function ChangePasswordNewPasswordStep({
  newPassword,
  confirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
  newPasswordPlaceholder,
  confirmPasswordPlaceholder,
}: Props) {
  const { t } = useTranslation('deliveries');
  const [focusedField, setFocusedField] = useState<'new' | 'confirm' | null>(null);

  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  return (
    <View style={styles.container}>
      <SvgAndTextWrapper
        svgName="otp"
        heading={t('change_password_new_heading')}
        description={t('change_password_new_description')}
      />
      <TextInputField
        value={newPassword}
        onChangeText={onNewPasswordChange}
        placeholder={newPasswordPlaceholder}
        iconName="lock"
        iconType="Feather"
        isPassword
        isFocused={focusedField === 'new'}
        onFocus={() => setFocusedField('new')}
        onBlur={() => setFocusedField(null)}
      />
      <TextInputField
        value={confirmPassword}
        onChangeText={onConfirmPasswordChange}
        placeholder={confirmPasswordPlaceholder}
        iconName="lock"
        iconType="Feather"
        isPassword
        isFocused={focusedField === 'confirm'}
        onFocus={() => setFocusedField('confirm')}
        onBlur={() => setFocusedField(null)}
        hasError={passwordsMismatch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16 },
});
