import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import OtpVerificationComponent from "../../../components/auth/OtpVerificationComponent";
import {
  useSignupVerifyOtp,
  useSignupSendOtp,
} from "../../../hooks/useAuthMutations";
import { getPendingAppRoute } from "../../../navigation/pendingAppRedirect";
import { useTooManyRequestsModal } from "../../../hooks/useTooManyRequestsModal";
import AppPopup from "../../../components/AppPopup";
import { showToast } from "../../../components/AppToast";
import { useAuthStore } from "../../../stores/useAuthStore";
import KeyboardDismissWrapper from "../../../components/KeyboardDismissWrapper";

const EnterPhoneOtpSignup = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const { formData, setOtpType, otpType, setOtpSent } = useAuthStore();
  const rateLimitModal = useTooManyRequestsModal();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [hasError, sethasError] = useState<boolean>(false);

  const sendOtpMutation = useSignupSendOtp({
    onSuccess: (data) => {
      setOtpSent(true);
      showToast.success("Success!", data?.message);
    },
    onError: (error) => {
      if (error.status === 429) {
        rateLimitModal.show();
      } else if (error.status === 409) {
        showToast.error("Error!", error?.message);
        navigation.navigate("signup" as never);
      } else {
        showToast.error("Error!", error?.message);
        setErrorMessage(error?.message);
      }
    },
  });

  useEffect(() => {
    sendOtpMutation.mutate({
      phone: formData.phone,
      otp_type: otpType,
    });
  }, []);

  const verifyOtpMutation = useSignupVerifyOtp({
    onSuccess: async () => {
      showToast.success("Success!", "Account created successfully.");
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
      phone: formData.phone,
      email: formData.email,
      otp,
      otp_type: otpType,
      name: formData.name,
      password: formData.password,
    });
  };

  const handleResendOtp = () => {
    sendOtpMutation.mutate({
      phone: formData.phone,
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
    {
      id: "email",
      icon: "mail",
      title: t("email_verification"),
      onSelect: () => {
        setOtpType("email");
        navigation.navigate("enterEmailOtpSignup" as never);
      },
    },
  ];

  return (
    <KeyboardDismissWrapper>
      <OtpVerificationComponent
        heading="verify_your_phone_number"
        description={t("enter_otp_sent_to", { contact: formData.phone })}
        showTryAnotherWay={true}
        verificationOptions={verificationOptions}
        defaultSelectedMethod={otpType}
        onVerify={(otp) => {
          handleVerifyOtp(otp);
        }}
        onResend={handleResendOtp}
        errorMessage={errorMessage}
        isLoading={verifyOtpMutation.isPending}
        hasError={hasError}
        setHasError={sethasError}
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
    </KeyboardDismissWrapper>
  );
};

export default EnterPhoneOtpSignup;
