import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { useTheme } from "../../theme/theme";
import Text from "../Text";
import Icon from "../Icon";
import { useTranslation } from "react-i18next";

type Props = {
  onCodeFilled: (code: string) => void;
  onResend: () => void;
  hasError?: boolean;
  errorMessage?: string;
  timerDuration?: number;
};

export default function OtpCodeInput({
  onCodeFilled,
  onResend,
  hasError = false,
  errorMessage,
  timerDuration = 30,
}: Props) {
  const { colors } = useTheme();
  const [timer, setTimer] = useState(timerDuration);
  const [canResend, setCanResend] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResend = () => {
    setTimer(timerDuration);
    setCanResend(false);
    onResend();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <OtpInput
        numberOfDigits={6}
        onFilled={onCodeFilled}
        theme={{
          containerStyle: styles.otpContainer,
          pinCodeContainerStyle: [
            styles.pinCodeContainer,
            { borderColor: hasError ? colors.danger : colors.border },
          ],
          focusedPinCodeContainerStyle: {
            borderColor: hasError ? colors.danger : colors.primary,
          },
          pinCodeTextStyle: [styles.pinCodeText, { color: colors.text }],
          focusStickStyle: {
            backgroundColor: hasError ? colors.danger : colors.primary,
          },
        }}
      />

      {hasError && errorMessage && (
        <View style={styles.errorContainer}>
          <Icon type="Feather" name="info" size={15} color={colors.danger} />
          <Text style={[styles.errorText, { color: colors.danger }]}>
            {errorMessage}
          </Text>
        </View>
      )}

      <View style={styles.resendContainer}>
        <Text style={{ color: colors.mutedText }}>
          {t("didnt_receive_the_code")}{" "}
        </Text>
        {canResend ? (
          <TouchableOpacity onPress={handleResend}>
            <Text style={{ color: colors.primary }} weight="semiBold">
              {t("resend")}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ color: colors.primary }} weight="semiBold">
            {t("resend_in")} {formatTime(timer)}
          </Text>
        )}
      </View>
      <View>{}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 8,
    alignItems: "center",
  },
  otpContainer: {
    width: "100%",
  },
  pinCodeContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
  },
  pinCodeText: {
    fontSize: 20,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  errorText: {
    fontSize: 14,
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
