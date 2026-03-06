import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useUpdatePassword } from '../../hooks/useUserMutations';
import { ProfileUpdateButton, PasswordForm } from '../../components/profile';
import { usePasswordValidation } from '../../utils/passwordValidation';

export default function UpdatePasswordScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { mutate: updatePassword, isPending } = useUpdatePassword();
  const { validatePassword } = usePasswordValidation();

  const passwordError = newPassword ? validatePassword(newPassword) : null;

  const handleUpdate = () => {
    const trimmedCurrent = currentPassword.trim();
    const trimmedNew = newPassword.trim();

    if (!trimmedCurrent || !trimmedNew) return;
    
    const error = validatePassword(trimmedNew);
    if (error) {
      Alert.alert(t('invalid_password', 'Invalid Password'), error);
      return;
    }

    updatePassword(
      { previous_password: trimmedCurrent, new_password: trimmedNew },
      {
        onSuccess: (data) => {
          console.log('Password updated successfully:', data);
          Alert.alert(
            t('success'),
            t('settings_password_update_success'),
            [{ text: t('ok'), onPress: () => navigation.goBack() }],
          );
        },
        onError: (error) => {
          Alert.alert(
            t('error'),
            error.message ?? t('settings_password_update_error'),
          );
        },
      },
    );
  };

  const isFormValid =
    currentPassword.length > 0 &&
    !passwordError &&
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

        <PasswordForm
          currentPassword={{
            value: currentPassword,
            onChange: setCurrentPassword,
          }}
          newPassword={{
            value: newPassword,
            onChange: setNewPassword,
            error: passwordError,
          }}
          confirmPassword={{
            value: confirmPassword,
            onChange: setConfirmPassword,
          }}
        />
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
});
