import React, { useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import ScreenHeader from "../ScreenHeader";
import SvgAndTextWrapper from "./general/SvgAndTextWrapper";
import Footer from "../Footer";
import Button from "../Button";
import TextInputField from "./TextInputField";
import { isValidEmail } from "../../utils/validation";

type Props = {
  heading: string;
  description: string;
  buttonLabel?: string;
  onContinue: (email: string) => void;
  styles: any;
};

export default function EmailInputComponent({
  heading,
  description,
  buttonLabel = "continue",
  onContinue,
  styles,
}: Props) {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [email, setEmail] = useState("john@gmail.com");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isFormValid = email.trim().length > 0 && isValidEmail(email);

  return (
    <View style={styles.container}>
      <ScreenHeader onBack={() => navigation.goBack()} />

      <View style={styles.centerContent}>
        <SvgAndTextWrapper
          svgName="login"
          heading={heading}
          description={description}
        />
        <TextInputField
          value={email}
          onChangeText={setEmail}
          placeholder="email"
          iconName="mail"
          keyboardType="email-address"
          autoCapitalize="none"
          isFocused={focusedField === "email"}
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
        />
      </View>

      <Footer>
        <Button
          variant={isFormValid ? "primary" : "secondary"}
          label={t(buttonLabel)}
          onPress={() => onContinue(email)}
          disabled={!isFormValid}
        />
      </Footer>
    </View>
  );
}
