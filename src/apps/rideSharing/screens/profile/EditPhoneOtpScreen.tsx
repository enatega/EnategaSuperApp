import React, { useState } from 'react';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import OtpVerificationComponent from '../../../../general/components/auth/OtpVerificationComponent';
import { showToast } from '../../../../general/components/AppToast';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';
import {
  useResendRiderPhoneUpdateOtp,
  useVerifyRiderPhoneUpdateOtp,
} from '../../hooks/useUserMutations';

type PhoneOtpRouteProp = RouteProp<RideSharingStackParamList, 'EditPhoneOtp'>;

export default function EditPhoneOtpScreen() {
  const { t } = useTranslation('rideSharing');
  const navigation = useNavigation<NativeStackNavigationProp<RideSharingStackParamList>>();
  const route = useRoute<PhoneOtpRouteProp>();
  const [hasError, setHasError] = useState(false);
  const verifyPhoneOtpMutation = useVerifyRiderPhoneUpdateOtp();
  const resendPhoneOtpMutation = useResendRiderPhoneUpdateOtp();
  const phone = route.params.phone;

  const handleVerify = (otp: string) => {
    verifyPhoneOtpMutation.mutate(
      { phone, otp },
      {
        onSuccess: () => {
          showToast.success(t('success'), t('phone_update_success'));
          navigation.goBack();
          navigation.goBack();
        },
        onError: (error) => {
          setHasError(true);
          showToast.error(t('error'), error.message || t('phone_update_verify_error'));
        },
      },
    );
  };

  const handleResend = () => {
    resendPhoneOtpMutation.mutate(
      { phone },
      {
        onSuccess: () => {
          showToast.success(t('success'), t('phone_update_resend_success'));
        },
        onError: (error) => {
          showToast.error(t('error'), error.message || t('phone_update_resend_error'));
        },
      },
    );
  };

  return (
    <OtpVerificationComponent
      heading={t('phone_update_otp_title')}
      description={t('phone_update_otp_description', { contact: phone })}
      onVerify={handleVerify}
      onResend={handleResend}
      hasError={hasError}
      setHasError={setHasError}
      isLoading={verifyPhoneOtpMutation.isPending}
      errorMessage="phone_update_verify_error"
    />
  );
}
