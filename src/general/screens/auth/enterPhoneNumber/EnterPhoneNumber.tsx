import React, { useState } from "react";
import { View, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useTheme } from "../../../theme/theme";
import ScreenHeader from "../../../components/ScreenHeader";
import { useNavigation } from "@react-navigation/native";
import SvgAndTextWrapper from "../../../components/auth/general/SvgAndTextWrapper";
import useStyles from "./styles";
import Footer from "../../../components/Footer";
import Button from "../../../components/Button";
import { useTranslation } from "react-i18next";
import PhoneNumberInput from "../../../components/auth/PhoneInput";

const EnterPhoneNumber = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = useStyles(colors);
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValidPhone, setIsValidPhone] = useState(false);
  const hasPhoneInput = phoneNumber.length > 0;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
      <ScreenHeader onBack={() => navigation.goBack()} />

      {/* Center content container */}
      <View style={styles.centerContent}>
        <SvgAndTextWrapper
          svgName="login"
          heading="enter_your_phone"
          description="login_desc"
        />
        <PhoneNumberInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          onChangeFormattedText={(formatted) => {
            setPhoneNumber(formatted);
            setIsValidPhone(formatted.length >= 10);
          }}
          isActive={hasPhoneInput}
        />
      </View>

      <Footer>
        <Button
          variant={isValidPhone ? "primary" : "secondary"}
          label={t("continue")}
          onPress={() =>
            navigation.navigate("enterPhoneOtpLogin", { phone: phoneNumber })
          }
          disabled={!hasPhoneInput}
        />
      </Footer>
    </View>
    </TouchableWithoutFeedback>
  );
};

export default EnterPhoneNumber;
