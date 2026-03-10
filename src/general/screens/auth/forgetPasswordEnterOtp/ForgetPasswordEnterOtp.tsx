import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import OtpVerificationComponent from "../../../components/auth/OtpVerificationComponent";
import {
  useForgotPasswordSendOtp,
  useForgotPasswordVerifyOtp,
} from "../../../hooks/useAuthMutations";
import { showToast } from "../../../components/AppToast";
import { useTooManyRequestsModal } from "../../../hooks/useTooManyRequestsModal";
import { useAuthStore } from "../../../stores/useAuthStore";
import TooManyRequestsModal from "../../../components/auth/TooManyRequestsModal";
import { useNavigation } from "@react-navigation/native";

const ForgetPasswordEnterOtp = ({ route }) => {
  const { emailId } = route.params;
  const { t } = useTranslation();
  const { setOtpSent, setOtpType } = useAuthStore();
  const rateLimitModal = useTooManyRequestsModal();
  const [hasError, sethasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigation = useNavigation();

  const sendOtpMutation = useForgotPasswordSendOtp({
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
      email: emailId,
      otp_type: "email",
    });
  }, []);

  const verifyOtpMutation = useForgotPasswordVerifyOtp({
    onSuccess: (data) => {
      showToast.success("Success!", data?.message);
      navigation.navigate("createNewPassword", {
        userId: data.userId,
      } as never);
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
      email: emailId,
      otp: otp,
      otp_type: "email",
    });
  };

  const handleResendOtp = () => {
    sendOtpMutation.mutate({
      email: emailId,
      otp_type: "email",
    });
  };

  return (
    <>
      <OtpVerificationComponent
        heading="verify_your_email"
        description={t("enter_otp_sent_to", { phoneNumber: emailId })}
        showTryAnotherWay={false}
        onVerify={(otp) => {
          handleVerifyOtp(otp);
        }}
        onResend={() => {
          handleResendOtp();
        }}
        hasError={hasError}
        setHasError={sethasError}
        errorMessage={errorMessage}
        isLoading={verifyOtpMutation.isPending}
      />
      <TooManyRequestsModal
        visible={rateLimitModal.visible}
        onClose={rateLimitModal.hide}
        onPrimaryAction={rateLimitModal.hide}
        title="too_many_attempts"
        description="too_many_attempts_desc"
        primaryButtonText="ok"
      />
    </>
  );
};

export default ForgetPasswordEnterOtp;
