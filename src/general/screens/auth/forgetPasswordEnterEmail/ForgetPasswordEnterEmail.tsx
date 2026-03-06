import React from "react";
import { useTheme } from "../../../theme/theme";
import { useNavigation } from "@react-navigation/native";
import useStyles from "./styles";
import EmailInputComponent from "../../../components/auth/EmailInputComponent";

const ForgetPasswordEnterEmail = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = useStyles(colors);

  return (
    <EmailInputComponent
      heading="forget_password"
      description="forget_password_desc"
      onContinue={(email) => {
        console.log("Forgot password email:", email);
        navigation.navigate("forgetPasswordEnterOtp" as never);
      }}
      styles={styles}
    />
  );
};

export default ForgetPasswordEnterEmail;
