import React from "react";
import { useTheme } from "../../../theme/theme";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import useStyles from "./styles";
import OtpVerificationComponent from "../../../components/auth/OtpVerificationComponent";

const EnterPhoneOtp = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = useStyles(colors);
  const { t } = useTranslation();

  const verificationOptions = [
    {
      id: "sms",
      icon: "message-square",
      title: t("sms_verification"),
      onSelect: () => console.log("SMS selected"),
    },
    {
      id: "call",
      icon: "phone",
      title: t("call_verification"),
      onSelect: () => console.log("Call selected"),
    },
    {
      id: "email",
      icon: "mail",
      title: t("email_verification"),
      onSelect: () => navigation.navigate("enterEmailOtp" as never),
    },
  ];

  return (
    <OtpVerificationComponent
      heading="verify_your_phone_number"
      description={t("enter_otp_sent_to", { phoneNumber: "+01 123213123" })}
      showTryAnotherWay={true}
      verificationOptions={verificationOptions}
      onVerify={(otp) => {
        console.log("Phone OTP:", otp);
        navigation.navigate("login" as never);
      }}
      onResend={() => {
        console.log("Resend phone OTP");
      }}
      styles={styles}
    />
  );
};

export default EnterPhoneOtp;
