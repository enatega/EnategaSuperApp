import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import OtpVerificationComponent from "../../../components/auth/OtpVerificationComponent";
import {
  useLoginSendOtp,
  useLoginVerifyOtp,
} from "../../../hooks/useAuthMutations";
import { getPendingAppRoute } from "../../../navigation/pendingAppRedirect";
import { useTooManyRequestsModal } from "../../../hooks/useTooManyRequestsModal";
import AppPopup from "../../../components/AppPopup";
import { showToast } from "../../../components/AppToast";
import { useAuthStore } from "../../../stores/useAuthStore";

const EnterPhoneOtpLogin = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phone } = route.params as { phone: string };
  const { t } = useTranslation();
  const { otpType, setOtpType } = useAuthStore();
  const rateLimitModal = useTooManyRequestsModal();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hasError, sethasError] = useState<boolean>(false);

  const sendOtpMutation = useLoginSendOtp({
    onSuccess: (data) => {
      showToast.success("Success!", data?.message);
    },
    onError: (error) => {
      if (error.status === 429) {
        rateLimitModal.show();
      } else {
        showToast.error("Error!", error?.message);
      }
    },
  });

  useEffect(() => {
    sendOtpMutation.mutate({
      phone: phone,
      otp_type: otpType,
    });
  }, []);

  const verifyOtpMutation = useLoginVerifyOtp({
    onSuccess: async () => {
      showToast.success("Success!", "Login successful.");
      const pendingRoute = await getPendingAppRoute();

      if (!pendingRoute) {
        navigation.navigate("login" as never);
      }

      setOtpType("sms")
    },
    onError: (error) => {
      sethasError(true);
      if (error.status === 429) {
        rateLimitModal.show();
      } else {
        setErrorMessage(error?.message);
        showToast.error("Error!", error?.message);
      }
    },
  });

  const handleVerifyOtp = (otp: string) => {
    verifyOtpMutation.mutate({
      phone,
      otp,
    });
  };

  const handleResendOtp = () => {
    sendOtpMutation.mutate({
      phone: phone,
      otp_type: otpType,
    });
  };

  const verificationOptions = [
    {
      id: "sms",
      icon: "message-square",
      title: t("sms_verification"),
      onSelect: () => setOtpType("sms"),
    },
    {
      id: "call",
      icon: "phone",
      title: t("call_verification"),
      onSelect: () => setOtpType("call"),
    },
  ];

  return (
    <>
      <OtpVerificationComponent
        heading="verify_your_phone_number"
        description={t("enter_otp_sent_to", { contact: phone })}
        showTryAnotherWay={true}
        verificationOptions={verificationOptions}
        onVerify={(otp) => {
          handleVerifyOtp(otp);
        }}
        onResend={handleResendOtp}
        errorMessage={errorMessage}
        hasError={hasError}
        setHasError={sethasError}
        isLoading={verifyOtpMutation.isPending}
      />
      <AppPopup
        visible={rateLimitModal.visible}
        title={t("too_many_attempts")}
        description={t("too_many_attempts_desc")}
        onRequestClose={rateLimitModal.hide}
        dismissOnOverlayPress={true}
        primaryAction={{
          label: t("ok"),
          onPress: rateLimitModal.hide,
          variant: "danger",
        }}
      />
    </>
  );
};
export default EnterPhoneOtpLogin;
