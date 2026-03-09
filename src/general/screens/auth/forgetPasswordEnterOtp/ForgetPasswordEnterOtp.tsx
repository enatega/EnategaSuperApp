import React, { useState } from "react";
import { useTheme } from "../../../theme/theme";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import OtpVerificationComponent from "../../../components/auth/OtpVerificationComponent";

const ForgetPasswordEnterOtp = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [hasError, sethasError] = useState<boolean>(false);

  return (
    <OtpVerificationComponent
      heading="verify_your_email"
      description={t("enter_otp_sent_to", { phoneNumber: "+01 123213123" })}
      showTryAnotherWay={false}
      onVerify={(otp) => {
        console.log("Forgot password OTP:", otp);
        navigation.navigate("createNewPassword" as never);
      }}
      onResend={() => {
        console.log("Resend forgot password OTP");
      }}
      hasError={hasError}
      setHasError={sethasError}
    />
  );
};

export default ForgetPasswordEnterOtp;
