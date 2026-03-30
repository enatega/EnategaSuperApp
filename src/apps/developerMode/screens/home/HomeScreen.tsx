import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../../general/components/Header';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';
import {
  useLoginSendOtp,
  useLoginVerifyOtp,
  useLogout,
  useSignupSendOtp,
  useSignupVerifyOtp,
} from '../../../../general/hooks/useAuthMutations';
import { useAuthSessionQuery } from '../../../../general/hooks/useAuthQueries';

type DeveloperModeStackParamList = {
  DeveloperModeHome: undefined;
  DriverProfile: undefined;
  Auth: undefined;
  RateOrder: {
    orderId: string;
    storeName: string;
  };
  RiderChat: {
    estimatedMinutes: number;
    orderCode: string;
    receiverId: string;
    riderName: string;
  };
};

type NavigationProp = NativeStackNavigationProp<DeveloperModeStackParamList, 'DeveloperModeHome'>;

type AuthMode = 'signup' | 'login';

export default function DeveloperModeHomeScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('general');
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<AuthMode>('signup');
  const [phone, setPhone] = useState('+923001234567');
  const [otp, setOtp] = useState('123456');
  const [name, setName] = useState('John Doe');
  const [password, setPassword] = useState('password123');
  const [devicePushToken, setDevicePushToken] = useState('fcm-token-here');
  const [referralCode, setReferralCode] = useState('REF123');

  const sessionQuery = useAuthSessionQuery();
  const sendOtpMutation = useSignupSendOtp();
  const verifyOtpMutation = useSignupVerifyOtp();
  const loginSendOtpMutation = useLoginSendOtp();
  const loginVerifyOtpMutation = useLoginVerifyOtp();
  const logoutMutation = useLogout();

  const isSignup = mode === 'signup';

  const handleSendOtp = useCallback(() => {

    if (isSignup) {
      sendOtpMutation.mutate({ phone, otp_type: 'sms' });
    } else {
      loginSendOtpMutation.mutate({
        phone,
        otp_type: 'sms',
        device_push_token: devicePushToken || undefined,
      });
    }
  }, [devicePushToken, isSignup, loginSendOtpMutation, phone, sendOtpMutation]);

  const handleVerifyOtp = useCallback(() => {
    if (isSignup) {
      verifyOtpMutation.mutate({
        phone,
        otp,
        name,
        password,
        otp_type: 'sms',
        device_push_token: devicePushToken || undefined,
        referral_code: referralCode || undefined,
      });
    } else {
      loginVerifyOtpMutation.mutate({
        phone,
        otp,
        device_push_token: devicePushToken || undefined,
      });
    }
  }, [
    devicePushToken,
    isSignup,
    loginVerifyOtpMutation,
    name,
    otp,
    password,
    phone,
    referralCode,
    verifyOtpMutation,
  ]);

  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const isBusy =
    sendOtpMutation.isPending ||
    verifyOtpMutation.isPending ||
    loginSendOtpMutation.isPending ||
    loginVerifyOtpMutation.isPending ||
    logoutMutation.isPending;

  const statusText = useMemo(() => {
    if (isBusy) {
      return t('dev_auth_status_working');
    }

    if (sendOtpMutation.isSuccess || loginSendOtpMutation.isSuccess) {
      return t('dev_auth_status_otp_sent');
    }

    if (verifyOtpMutation.isSuccess || loginVerifyOtpMutation.isSuccess) {
      return t('dev_auth_status_verified');
    }

    if (
      sendOtpMutation.isError ||
      verifyOtpMutation.isError ||
      loginSendOtpMutation.isError ||
      loginVerifyOtpMutation.isError ||
      logoutMutation.isError
    ) {
      return t('dev_auth_status_failed');
    }

    return sessionQuery.data?.token ? t('dev_auth_status_signed_in') : t('dev_auth_status_signed_out');
  }, [
    isBusy,
    loginSendOtpMutation.isError,
    loginSendOtpMutation.isSuccess,
    loginVerifyOtpMutation.isError,
    loginVerifyOtpMutation.isSuccess,
    logoutMutation.isError,
    sendOtpMutation.isError,
    sendOtpMutation.isSuccess,
    sessionQuery.data?.token,
    t,
    verifyOtpMutation.isError,
    verifyOtpMutation.isSuccess,
  ]);

  const isAuthenticated = Boolean(sessionQuery.data?.token);

  const errorMessage =
    sendOtpMutation.error?.message ||
    verifyOtpMutation.error?.message ||
    loginSendOtpMutation.error?.message ||
    loginVerifyOtpMutation.error?.message ||
    logoutMutation.error?.message ||
    '';

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 100 }}
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: Math.max(insets.top + 8, 20) },
      ]}
    >
      <Header title={t('developer_mode')} subtitle={t('developer_mode_subtitle')} />
      <Text variant="body" color={colors.mutedText}>
        {t('developer_mode_welcome')}
      </Text>

      <View
        style={[
          styles.statusCard,
          {
            backgroundColor: isAuthenticated ? colors.cardMint : colors.cardBlue,
            borderColor: colors.border,
          },
        ]}
      >
        <Text weight="semiBold" style={{ color: colors.text }}>
          {t('dev_auth_status_label')}
        </Text>
        <Text color={colors.mutedText}>{statusText}</Text>
        {isAuthenticated ? (
          <Text color={colors.mutedText}>
            {t('dev_auth_status_user', { name: sessionQuery.data?.user?.name ?? '-' })}
          </Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text weight="semiBold" style={{ fontSize: typography.size.sm2 }}>
          {t('dev_auth_title')}
        </Text>
        <Text color={colors.mutedText}>{t('dev_auth_description')}</Text>

        <View style={styles.modeRow}>
          <Button
            label={t('dev_auth_mode_signup')}
            onPress={() => setMode('signup')}
            style={styles.modeButton}
            variant={mode === 'signup' ? 'primary' : 'secondary'}
          />
          <Button
            label={t('dev_auth_mode_login')}
            onPress={() => setMode('login')}
            style={styles.modeButton}
            variant={mode === 'login' ? 'primary' : 'secondary'}
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>{t('dev_auth_phone_label')}</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder={t('dev_auth_phone_placeholder')}
            placeholderTextColor={colors.mutedText}
          />
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>{t('dev_auth_otp_label')}</Text>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder={t('dev_auth_otp_placeholder')}
            placeholderTextColor={colors.mutedText}
          />
        </View>

        {isSignup ? (
          <>
            <View style={styles.formRow}>
              <Text style={styles.label}>{t('dev_auth_name_label')}</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder={t('dev_auth_name_placeholder')}
                placeholderTextColor={colors.mutedText}
              />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.label}>{t('dev_auth_password_label')}</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder={t('dev_auth_password_placeholder')}
                placeholderTextColor={colors.mutedText}
                secureTextEntry
              />
            </View>
          </>
        ) : null}

        <View style={styles.formRow}>
          <Text style={styles.label}>{t('dev_auth_push_token_label')}</Text>
          <TextInput
            value={devicePushToken}
            onChangeText={setDevicePushToken}
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholder={t('dev_auth_push_token_placeholder')}
            placeholderTextColor={colors.mutedText}
          />
        </View>

        {isSignup ? (
          <View style={styles.formRow}>
            <Text style={styles.label}>{t('dev_auth_referral_label')}</Text>
            <TextInput
              value={referralCode}
              onChangeText={setReferralCode}
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder={t('dev_auth_referral_placeholder')}
              placeholderTextColor={colors.mutedText}
            />
          </View>
        ) : null}

        <View style={styles.buttonRow}>
          <Button
            label={isSignup ? t('dev_auth_send_otp_button') : t('dev_auth_send_login_otp_button')}
            onPress={handleSendOtp}
            style={styles.button}
            isLoading={sendOtpMutation.isPending || loginSendOtpMutation.isPending}
            disabled={isBusy}
          />
          <Button
            label={isSignup ? t('dev_auth_verify_button') : t('dev_auth_login_button')}
            onPress={handleVerifyOtp}
            style={styles.button}
            isLoading={verifyOtpMutation.isPending || loginVerifyOtpMutation.isPending}
            disabled={isBusy}
          />
          <Button
            label={t('dev_auth_logout_button')}
            onPress={handleLogout}
            style={styles.button}
            variant="secondary"
            isLoading={logoutMutation.isPending}
            disabled={isBusy}
          />
        </View>

        <Text style={{ color: colors.mutedText }}>{statusText}</Text>
        {errorMessage ? (
          <Text style={{ color: colors.danger }}>{errorMessage}</Text>
        ) : null}
      </View>

      <Button
        label={t('driver_profile_button')}
        onPress={() => navigation.navigate('DriverProfile')}
        style={styles.button}
      />
      <Button
        label={t('auth_flow_button')}
        onPress={() => navigation.navigate('Auth')}
        style={styles.button}
      />

      <Button
        label="Rate Order Screen"
        onPress={() =>
          navigation.navigate('RateOrder', {
            orderId: 'order-hardcoded-001',
            storeName: 'Subway @ Old Town, New Mexico',
          })
        }
        style={styles.button}
      />
      <Button
        label={t('rider_chat_button')}
        onPress={() =>
          navigation.navigate('RiderChat', {
            estimatedMinutes: 8,
            orderCode: '#D-2048',
            receiverId: 'b0e84890-0d23-4aac-93d9-99b80620d84c',
            riderName: 'Alex',
          })
        }
        style={styles.button}
      />
      <Button
        label="Courier Details"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onPress={() => (navigation as any).navigate('CourierDetails')}
        style={styles.button}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,

    gap: 16,

  },
  statusCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  section: {
    gap: 12,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modeButton: {
    flex: 1,
  },
  formRow: {
    gap: 6,
  },
  label: {
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  buttonRow: {
    gap: 8,
  },
  button: {
    marginTop: 8,
  },
});
