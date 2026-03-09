import React from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import useStyles from "./styles";
import { useTheme } from "../../../theme/theme";
import SvgAndTextWrapper from "../../../components/auth/general/SvgAndTextWrapper";
import Footer from "../../../components/Footer";
import ScreenHeader from "../../../components/ScreenHeader";
import Button from "../../../components/Button";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import FieldsWrapper from "../../../components/auth/signup/FieldsWrapper";
import { useAuthStore } from "../../../stores/useAuthStore";
import { isValidEmail } from "../../../utils/validation";

const Signup = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const { formData, setOtpType } = useAuthStore();

  const isFormValid =
    formData.name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    isValidEmail(formData.email) &&
    formData.password.trim().length > 0 &&
    formData.phone.trim().length > 0;

  const handleContinue = () => {
    setOtpType("sms");
    navigation.navigate("enterPhoneOtpSignup" as never);
  };

  return (
    <View style={[styles.container]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container]}
      >
        <ScreenHeader />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.centerContent}
        >
          <SvgAndTextWrapper
            svgName="login"
            heading="login_to_continue"
            description="login_to_continue_desc"
          />
          <FieldsWrapper />
        </ScrollView>
      </KeyboardAvoidingView>
      <Footer>
        <Button
          variant={isFormValid ? "primary" : "secondary"}
          label={t("create_account")}
          onPress={handleContinue}
          disabled={!isFormValid}
        />
      </Footer>
    </View>
  );
};

export default Signup;
