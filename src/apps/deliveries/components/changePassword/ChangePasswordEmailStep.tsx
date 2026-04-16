import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import SvgAndTextWrapper from '../../../../general/components/auth/general/SvgAndTextWrapper';
import TextInputField from '../../../../general/components/auth/TextInputField';

type Props = {
  email: string;
  onEmailChange: (value: string) => void;
  placeholderText: string;
};

export default function ChangePasswordEmailStep({ email, onEmailChange, placeholderText }: Props) {
  const { t } = useTranslation('deliveries');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <SvgAndTextWrapper
        svgName="login"
        heading={t('change_password_email_heading')}
        description={t('change_password_email_description')}
      />
      <TextInputField
        value={email}
        onChangeText={onEmailChange}
        placeholder={placeholderText}
        iconName="mail"
        iconType="Feather"
        isFocused={isFocused}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 24 },
});
