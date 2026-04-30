import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../../../theme/theme";
import ScreenHeader from "../../../components/ScreenHeader";
import { useNavigation } from "@react-navigation/native";
import SvgAndTextWrapper from "../../../components/auth/general/SvgAndTextWrapper";
import useStyles from "./styles";
import Footer from "../../../components/Footer";
import Button from "../../../components/Button";
import { useTranslation } from "react-i18next";
import TextInputField from "../../../components/auth/TextInputField";
import Text from "../../../components/Text";
import Icon from "../../../components/Icon";
import { useResetPassword } from "../../../hooks/useAuthMutations";
import { showToast } from "../../../components/AppToast";
import { useAuthStore } from "../../../stores/useAuthStore";
import KeyboardDismissWrapper from "../../../components/KeyboardDismissWrapper";

const CreateNewPassword = ({ route }) => {
  const { userId, emailId } = route.params;
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = useStyles(colors);
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMeessage, seterrorMeessage] = useState<string>("");
  const { setFlowType } = useAuthStore();

  const resetPasswordMutation = useResetPassword({
    onSuccess: (data) => {
      showToast.success("Success!", data.message);
      setFlowType("login");
      navigation.reset({
        index: 1,
        routes: [
          { name: "login" as never },
          { name: "enterEmail" as never, params: { emailId } as never },
        ],
      });
    },
    onError: (error) => {
      setHasError(true);
      seterrorMeessage(error?.message);
      showToast.error("Error!", error?.message);
    },
  });

  const isFormValid =
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    password === confirmPassword;

  return (
    <KeyboardDismissWrapper style={styles.container}>
      <ScreenHeader onBack={() => navigation.goBack()} />

      {/* Center content container */}
      <View style={styles.centerContent}>
        <SvgAndTextWrapper
          svgName="login"
          heading="create_new_password"
          description="create_password_desc"
        />
        <TextInputField
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setHasError(false);
          }}
          placeholder="enter_new_password"
          iconName="lock"
          isPassword
          autoCapitalize="none"
          isFocused={focusedField === "password"}
          onFocus={() => setFocusedField("password")}
          onBlur={() => setFocusedField(null)}
          hasError={hasError}
        />
        <TextInputField
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setHasError(false);
          }}
          placeholder="confirm_new_password"
          iconName="lock"
          isPassword
          autoCapitalize="none"
          isFocused={focusedField === "confirmPassword"}
          onFocus={() => setFocusedField("confirmPassword")}
          onBlur={() => setFocusedField(null)}
          hasError={hasError}
        />
        {hasError && (
          <View style={rowStyles.errorContainer}>
            <Icon type="Feather" name="info" size={15} color={colors.danger} />
            <Text style={[rowStyles.errorText, { color: colors.danger }]}>
              {t(errorMeessage)}
            </Text>
          </View>
        )}
      </View>

      <Footer>
        <Button
          variant={isFormValid ? "primary" : "secondary"}
          label={t("set_new_password")}
          onPress={() => {
            resetPasswordMutation.mutate({
              userId,
              password,
            });
          }}
          disabled={!isFormValid || resetPasswordMutation.isPending}
          isLoading={resetPasswordMutation.isPending}
        />
      </Footer>
    </KeyboardDismissWrapper>
  );
};

export default CreateNewPassword;

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  errorText: {
    fontSize: 14,
  },
});
