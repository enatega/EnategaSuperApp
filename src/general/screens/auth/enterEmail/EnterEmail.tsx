import React from "react";
import { useTheme } from "../../../theme/theme";
import { useNavigation } from "@react-navigation/native";
import useStyles from "./styles";
import EmailInputComponent from "../../../components/auth/EmailInputComponent";
import { rememberedCredentials } from "../../../auth/rememberedCredentials";

const EnterEmail = ({ route }) => {
  const emailId = route?.params?.emailId ?? "";
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = useStyles(colors);
  return (
    <EmailInputComponent
      heading="enter_your_email"
      description="login_desc"
      emailId={emailId}
      onContinue={async (email) => {
        let rememberedPassword: string | null = null;
        try {
          rememberedPassword = await rememberedCredentials.getPassword(email);
        } catch {
          rememberedPassword = null;
        }

        navigation.navigate(
          "enterPassword",
          {
            emailId: email,
            prefilledPassword: rememberedPassword ?? "",
            rememberedFromStore: Boolean(rememberedPassword),
          } as never,
        );
      }}
      styles={styles}
    />
  );
};

export default EnterEmail;
