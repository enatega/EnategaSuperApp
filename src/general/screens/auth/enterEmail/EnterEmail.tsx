import React from "react";
import { useTheme } from "../../../theme/theme";
import { useNavigation } from "@react-navigation/native";
import useStyles from "./styles";
import EmailInputComponent from "../../../components/auth/EmailInputComponent";

const EnterEmail = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = useStyles(colors);

  return (
    <EmailInputComponent
      heading="enter_your_email"
      description="login_desc"
      onContinue={(email) => {
        console.log("Login email:", email);
        navigation.navigate("enterPassword" as never);
      }}
      styles={styles}
    />
  );
};

export default EnterEmail;
