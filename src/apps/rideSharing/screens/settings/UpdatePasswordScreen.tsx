import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { ProfileInputField, ProfileUpdateButton } from '../../components/profile';

export default function UpdatePasswordScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPending, setIsPending] = useState(false);

  // Note: Only the UI layout is fleshed out right now (per user request).
  const handleUpdate = () => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      // navigation.goBack();
    }, 1000);
  };

  const isFormValid =
    currentPassword.length > 0 &&
    newPassword.length >= 6 &&
    newPassword === confirmPassword;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader />
      <ScrollView
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text variant="title" weight="bold" color={colors.text}>
            {t('settings_update_password')}
          </Text>
        </View>

        <View style={styles.form}>
          <ProfileInputField
            label={t('settings_current_password_label')}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder={t('settings_current_password_placeholder')}
            autoCapitalize="none"
            secureTextEntry
          />
          <ProfileInputField
            label={t('settings_new_password_label')}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder={t('settings_new_password_placeholder')}
            autoCapitalize="none"
            secureTextEntry
          />
          <ProfileInputField
            label={t('settings_confirm_password_label')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t('settings_confirm_password_placeholder')}
            autoCapitalize="none"
            secureTextEntry
          />
        </View>
      </ScrollView>

      <ProfileUpdateButton
        label={t('update_button')}
        onPress={handleUpdate}
        disabled={!isFormValid || isPending}
        isLoading={isPending}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 32,
    gap: 4,
  },
  form: {
    gap: 20,
  },
});
