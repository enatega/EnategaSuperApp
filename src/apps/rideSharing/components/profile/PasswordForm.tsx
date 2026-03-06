import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import ProfileInputField from './ProfileInputField';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  currentPassword: { value: string; onChange: (text: string) => void };
  newPassword: { value: string; onChange: (text: string) => void; error: string | null };
  confirmPassword: { value: string; onChange: (text: string) => void };
};

export default function PasswordForm({
  currentPassword,
  newPassword,
  confirmPassword,
}: Props) {
  const { t } = useTranslation('rideSharing');
  const { colors } = useTheme();

  return (
    <View style={styles.form}>
      <ProfileInputField
        label={t('settings_current_password_label')}
        value={currentPassword.value}
        onChangeText={currentPassword.onChange}
        placeholder={t('settings_current_password_placeholder')}
        autoCapitalize="none"
        secureTextEntry
        isPassword
      />
      <View>
        <ProfileInputField
          label={t('settings_new_password_label')}
          value={newPassword.value}
          onChangeText={newPassword.onChange}
          placeholder={t('settings_new_password_placeholder')}
          autoCapitalize="none"
          secureTextEntry
          isPassword
          style={{ marginBottom: newPassword.error ? 4 : 0 }}
        />
        {newPassword.value.length > 0 && newPassword.error && (
          <Text variant="caption" color={colors.danger} style={{ marginTop: 4 }}>
            {newPassword.error}
          </Text>
        )}
      </View>
      <ProfileInputField
        label={t('settings_confirm_password_label')}
        value={confirmPassword.value}
        onChangeText={confirmPassword.onChange}
        placeholder={t('settings_confirm_password_placeholder')}
        autoCapitalize="none"
        secureTextEntry
        isPassword
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 20,
  },
});
