import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import ScreenHeader from "../ScreenHeader";
import SvgAndTextWrapper from "./general/SvgAndTextWrapper";
import Footer from "../Footer";
import Button from "../Button";
import OtpCodeInput from "./OtpInput";
import Text from "../Text";
import TryAnotherWay from "./enterPhoneOtp/TryAnotherWay";
import VerificationMethodModal from "./enterPhoneOtp/VerificationMethodModal";
import TooManyRequestsModal from "./enterPhoneOtp/TooManyRequestsModal";

type VerificationOption = {
  id: string;
  icon: string;
  title: string;
  onSelect?: () => void;
};

type Props = {
  heading: string;
  description: string;
  buttonLabel?: string;
  showTryAnotherWay?: boolean;
  verificationOptions?: VerificationOption[];
  onVerify: (otp: string) => void;
  onResend?: () => void;
  styles: any;
};

export default function OtpVerificationComponent({
  heading,
  description,
  buttonLabel = "verify_otp",
  showTryAnotherWay = false,
  verificationOptions = [],
  onVerify,
  onResend,
  styles,
}: Props) {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [otp, setOtp] = useState("");
  const [hasError, setHasError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("sms");
  const [rateLimitingModal, setRateLimitingModal] = useState(false);

  return (
    <View style={styles.container}>
      <ScreenHeader onBack={() => navigation.goBack()} />

      <View style={styles.centerContent}>
        <SvgAndTextWrapper
          svgName="otp"
          heading={heading}
          description={description}
        />
        <OtpCodeInput
          onCodeFilled={(code) => {
            setOtp(code);
            setHasError(false);
          }}
          onResend={() => {
            setHasError(false);
            onResend?.();
          }}
          hasError={hasError}
          errorMessage={t("incorrect_code")}
        />
        {showTryAnotherWay && (
          <TryAnotherWay onPress={() => setModalVisible(true)} />
        )}
        {/* Todo show too many request modal using it. */}
        {/* <TouchableOpacity onPress={() => setRateLimitingModal(true)}>
          <Text>too many requests model</Text>
        </TouchableOpacity> */}
      </View>

      <Footer>
        <Button
          variant={otp.length === 6 ? "primary" : "secondary"}
          label={t(buttonLabel)}
          onPress={() => {
            setHasError(true);
            onVerify(otp);
          }}
          disabled={otp.length !== 6}
        />
      </Footer>

      {showTryAnotherWay && (
        <VerificationMethodModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          options={verificationOptions}
          selectedOption={selectedMethod}
          onSelectOption={(id) => {
            const option = verificationOptions.find(opt => opt.id === id);
            option?.onSelect?.();
            setSelectedMethod(id);
            setModalVisible(false);
          }}
          title={t("try_another_way")}
        />
      )}
      
      <TooManyRequestsModal
        visible={rateLimitingModal}
        onClose={() => setRateLimitingModal(false)}
        onPrimaryAction={() => setRateLimitingModal(false)}
        title="too_many_attempts"
        description="too_many_attempts_desc"
        primaryButtonText="ok"
      />
    </View>
  );
}