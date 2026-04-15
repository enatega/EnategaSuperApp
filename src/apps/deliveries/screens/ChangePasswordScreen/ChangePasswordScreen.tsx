import React, { useEffect, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  useNavigation,
  type NavigationProp,
} from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Button from '../../../../general/components/Button';
import { useTheme } from '../../../../general/theme/theme';
import { showToast } from '../../../../general/components/AppToast';
import SvgAndTextWrapper from '../../../../general/components/auth/general/SvgAndTextWrapper';
import OtpCodeInput from '../../../../general/components/auth/OtpInput';
import ChangePasswordEmailStep from '../../components/changePassword/ChangePasswordEmailStep';
import ChangePasswordNewPasswordStep from '../../components/changePassword/ChangePasswordNewPasswordStep';
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useUpdatePasswordMutation,
} from '../../hooks/useChangePasswordMutations';
import type { DeliveriesStackParamList } from '../../navigation/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Step = 1 | 2 | 3;

export default function ChangePasswordScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavigationProp<DeliveriesStackParamList>>();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [verifiedOtp, setVerifiedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpHasError, setOtpHasError] = useState(false);
  const [otpErrorMessage, setOtpErrorMessage] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardOffset(e.endCoordinates.height - insets.bottom + 16);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [insets.bottom]);

  const sendOtpMutation = useSendOtpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();
  const updatePasswordMutation = useUpdatePasswordMutation();

  const handleSendOtp = async () => {
    try {
      await sendOtpMutation.mutateAsync(email);
      showToast.success(t('change_password_otp_resent_title'), t('change_password_otp_resent_message'));
      setStep(2);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('change_password_send_otp_error');
      showToast.error(t('change_password_error_title'), message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtpMutation.mutateAsync({ email, otp });
      setVerifiedOtp(otp);
      setOtpHasError(false);
      setStep(3);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('change_password_verify_otp_error');
      setOtpErrorMessage(message);
      setOtpHasError(true);
    }
  };

  const handleResendOtp = async () => {
    try {
      setOtp('');
      await sendOtpMutation.mutateAsync(email);
      showToast.success(t('change_password_otp_resent_title'), t('change_password_otp_resent_message'));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('change_password_send_otp_error');
      showToast.error(t('change_password_error_title'), message);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast.error(t('change_password_error_title'), t('change_password_mismatch'));
      return;
    }
    try {
      await updatePasswordMutation.mutateAsync({ email, otp: verifiedOtp, newPassword });
      showToast.success(t('change_password_success_title'), t('change_password_success_message'));
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : t('change_password_update_error');
      showToast.error(t('change_password_error_title'), message);
    }
  };

  const getTitle = () => {
    if (step === 1) return t('change_password_title');
    if (step === 2) return t('change_password_verify_heading');
    return t('change_password_new_title');
  };

  const getFooterLabel = () => {
    if (step === 1) return t('change_password_continue');
    if (step === 2) return t('change_password_verify_button');
    return t('change_password_set_new');
  };

  const getFooterDisabled = () => {
    if (step === 1) return !EMAIL_REGEX.test(email.trim()) || sendOtpMutation.isPending;
    if (step === 2) return otp.length !== 4 || verifyOtpMutation.isPending;
    return !newPassword || !confirmPassword || updatePasswordMutation.isPending;
  };

  const getFooterLoading = () => {
    if (step === 1) return sendOtpMutation.isPending;
    if (step === 2) return verifyOtpMutation.isPending;
    return updatePasswordMutation.isPending;
  };

  const getFooterOnPress = () => {
    if (step === 1) return handleSendOtp;
    if (step === 2) return handleVerifyOtp;
    return handleUpdatePassword;
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={getTitle()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && (
          <ChangePasswordEmailStep
            email={email}
            onEmailChange={setEmail}
            placeholderText={t('change_password_email_placeholder')}
          />
        )}
        {step === 2 && (
          <View style={styles.otpContent}>
            <SvgAndTextWrapper
              svgName="otp"
              heading={t('change_password_verify_heading')}
              description={t('change_password_verify_description', { email })}
            />
            <OtpCodeInput
              onCodeFilled={(code) => {
                setOtp(code);
                setOtpHasError(false);
              }}
              onResend={handleResendOtp}
              hasError={otpHasError}
              errorMessage={otpErrorMessage}
            />
          </View>
        )}
        {step === 3 && (
          <ChangePasswordNewPasswordStep
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            onNewPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
            newPasswordPlaceholder={t('change_password_new_placeholder')}
            confirmPasswordPlaceholder={t('change_password_confirm_placeholder')}
          />
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            borderTopColor: colors.border,
            backgroundColor: colors.background,
            bottom: keyboardOffset,
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        <Button
          label={getFooterLabel()}
          onPress={getFooterOnPress()}
          disabled={getFooterDisabled()}
          isLoading={getFooterLoading()}
          variant={step === 2 && otp.length === 4 ? 'primary' : step === 2 ? 'secondary' : 'primary'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    left: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    position: 'absolute',
    right: 0,
  },
  otpContent: {
    alignItems: 'center',
    gap: 24,
  },
  screen: { flex: 1 },
  scrollContent: { paddingBottom: 100, paddingHorizontal: 16, paddingTop: 24 },
  scrollView: { flex: 1 },
});
