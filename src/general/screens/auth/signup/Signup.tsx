import React, { useState } from "react";
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

const Signup = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isDetailsFilled, setIsDetailsFilled] = useState(false);

  const handleFieldsChange = (isValid: boolean) => {
    setIsDetailsFilled(isValid);
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
          <FieldsWrapper onFieldsChange={handleFieldsChange} />
        </ScrollView>
      </KeyboardAvoidingView>
      <Footer>
        <Button
          variant={isDetailsFilled ? "primary" : "secondary"}
          label={t("create_account")}
          onPress={() => navigation.navigate("enterPhoneOtp", {source : 'phone'})}
          disabled={!isDetailsFilled}
        />
      </Footer>
    </View>
  );
};

export default Signup;
