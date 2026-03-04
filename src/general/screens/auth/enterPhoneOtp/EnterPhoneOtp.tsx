import React, { useState } from "react";
import { View } from "react-native";
import { useTheme } from "../../../theme/theme";
import ScreenHeader from "../../../components/ScreenHeader";
import { useNavigation } from "@react-navigation/native";
import SvgAndTextWrapper from "../../../components/auth/general/SvgAndTextWrapper";
import useStyles from "./styles";
import Footer from "../../../components/Footer";
import Button from "../../../components/Button";
import { useTranslation } from "react-i18next";
import OtpCodeInput from "../../../components/auth/OtpInput";

const EnterPhoneOtp = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = useStyles(colors);
  const { t } = useTranslation();
  const [phoneNumber] = useState("+01 123213123");
  const [otp, setOtp] = useState("");
  const [hasError, setHasError] = useState(false);

  return (
    <View style={[styles.container]}>
      <ScreenHeader onBack={() => navigation.goBack()} />

      {/* Center content container */}
      <View style={styles.centerContent}>
        <SvgAndTextWrapper
          svgName="otp"
          heading="verify_your_phone_number"
          description={t('enter_otp_sent_to', { phoneNumber })}
        />
        <OtpCodeInput
          onCodeFilled={(code) => {
            setOtp(code);
            setHasError(false);
          }}
          onResend={() => {
            setHasError(false);
            // Add resend OTP logic here
          }}
          hasError={hasError}
          errorMessage={t("incorrect_code")}
        />
      </View>

      <Footer>
        <Button
          variant={otp.length === 6 ? "primary" : "secondary"}
          label={t("verify_otp")}
          onPress={() => {
            // Todo: Add OTP verification logic
            // For demo, simulate error
            setHasError(true);
          }}
          disabled={otp.length !== 6}
        />
      </Footer>
    </View>
  );
};

export default EnterPhoneOtp;
