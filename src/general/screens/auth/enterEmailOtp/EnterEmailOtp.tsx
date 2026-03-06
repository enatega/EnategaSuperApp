import React from "react";
import { useTheme } from "../../../theme/theme";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import useStyles from "./styles";
import OtpVerificationComponent from "../../../components/auth/OtpVerificationComponent";

const EnterEmailOtp = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = useStyles(colors);
  const { t } = useTranslation();

  const verificationOptions = [
    {
      id: "sms",
      icon: "message-square",
      title: t("sms_verification"),
      onSelect: () => navigation.navigate("enterPhoneOtp" as never),
    },
    {
      id: "call",
      icon: "phone",
      title: t("call_verification"),
      onSelect: () => navigation.navigate("enterPhoneOtp" as never),
    },
    {
      id: "email",
      icon: "mail",
      title: t("email_verification"),
      onSelect: () => console.log("Email selected"),
    },
  ];

  return (
    <OtpVerificationComponent
      heading="verify_your_email"
      description={t("enter_otp_sent_to", { phoneNumber: "+01 123213123" })}
      showTryAnotherWay={true}
      verificationOptions={verificationOptions}
      onVerify={(otp) => {
        console.log("Email OTP:", otp);
        navigation.navigate("login" as never);
      }}
      onResend={() => {
        console.log("Resend email OTP");
      }}
      styles={styles}
    />
  );
};

export default EnterEmailOtp;
