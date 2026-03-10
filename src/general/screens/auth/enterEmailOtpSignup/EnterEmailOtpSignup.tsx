import React, { useState, useEffect } from "react";
import { useTheme } from "../../../theme/theme";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import OtpVerificationComponent from "../../../components/auth/OtpVerificationComponent";
import { useAuthStore } from "../../../stores/useAuthStore";
import {
  useSignupVerifyOtp,
  useSignupSendOtp,
} from "../../../hooks/useAuthMutations";
import { useTooManyRequestsModal } from "../../../hooks/useTooManyRequestsModal";
import AppPopup from "../../../components/AppPopup";
import { showToast } from "../../../components/AppToast";

const EnterEmailOtpSignup = () => {
  const { colors } = useTheme();
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
      } else {
        showToast.error("Error!", error?.message);
      }
    },
  });

  useEffect(() => {
    sendOtpMutation.mutate({
      email: formData.email,
      otp_type: "email",
    });
  }, []);

  const verifyOtpMutation = useSignupVerifyOtp({
    onSuccess: () => {
      showToast.success("Success!", "Account created successfully.");
      navigation.navigate("login" as never);
      setOtpType("sms");
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

  const verificationOptions = [
    {
      id: "sms",
      icon: "message-square",
      title: t("sms_verification"),
      onSelect: () => {
        setOtpType("sms");
        navigation.navigate("enterPhoneOtpSignup" as never);
      },
    },
    {
      id: "call",
      icon: "phone",
      title: t("call_verification"),
      onSelect: () => {
        setOtpType("call");
        navigation.navigate("enterPhoneOtpSignup" as never);
      },
    },
    {
      id: "email",
      icon: "mail",
      title: t("email_verification"),
      onSelect: () => {
        setOtpType("email");
      },
    },
  ];

  const handleVerifyOtp = (otp: string) => {
    verifyOtpMutation.mutate({
      phone: formData.phone,
      otp,
      email: formData.email,
      otp_type: otpType,
      name: formData.name,
      password: formData.password,
    });
  };

  const handleResendOtp = () => {
    sendOtpMutation.mutate({
      email: formData.email,
      otp_type: "email",
    });
  };

  return (
    <>
      <OtpVerificationComponent
        heading="verify_your_email"
        description={t("enter_otp_sent_to", { contact: formData.email })}
        showTryAnotherWay={true}
        verificationOptions={verificationOptions}
        defaultSelectedMethod={otpType}
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

export default EnterEmailOtpSignup;
