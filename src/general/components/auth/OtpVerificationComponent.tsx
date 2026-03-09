import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import ScreenHeader from "../ScreenHeader";
import SvgAndTextWrapper from "./general/SvgAndTextWrapper";
import Footer from "../Footer";
import Button from "../Button";
import OtpCodeInput from "./OtpInput";
import TryAnotherWay from "./TryAnotherWay";
import VerificationMethodModal from "./VerificationMethodModal";
import TooManyRequestsModal from "./TooManyRequestsModal";
import { useTheme } from "../../theme/theme";

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
  onResend?: (otp: string) => void;
  defaultSelectedMethod?: string;
  errorMessage?: string;
  isLoading?: boolean;
  hasError: boolean;
  setHasError: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function OtpVerificationComponent({
  heading,
  description,
  buttonLabel = "verify_otp",
  showTryAnotherWay = false,
  verificationOptions = [],
  onVerify,
  onResend,
  defaultSelectedMethod = "sms",
  errorMessage,
  isLoading,
  hasError,
  setHasError,
}: Props) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const [otp, setOtp] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(defaultSelectedMethod);
  const [rateLimitingModal, setRateLimitingModal] = useState(false);

  return (
    <View style={useStyles(colors).container}>
      <ScreenHeader onBack={() => navigation.goBack()} />

      <View style={useStyles(colors).centerContent}>
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
            setOtp("");
            setHasError(false);
            onResend?.(otp);
          }}
          hasError={hasError}
          errorMessage={t(errorMessage || "something_went_wrong")}
        />
        {showTryAnotherWay && (
          <TryAnotherWay onPress={() => setModalVisible(true)} />
        )}
      </View>

      <Footer>
        <Button
          variant={otp.length === 4 ? "primary" : "secondary"}
          label={t(buttonLabel)}
          onPress={() => {
            onVerify(otp);
          }}
          disabled={otp.length !== 4 || isLoading}
          isLoading={isLoading}
        />
      </Footer>

      {showTryAnotherWay && (
        <VerificationMethodModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          options={verificationOptions}
          selectedOption={selectedMethod}
          onSelectOption={(id) => {
            const option = verificationOptions.find((opt) => opt.id === id);
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

const useStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    centerContent: {
      flex: 1,
      paddingHorizontal: 16,
      gap: 18,
      alignItems: "center",
    },
  });
