import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
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

const CreateNewPassword = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = useStyles(colors);
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isFormValid = password.trim().length > 0;

  return (
    <View style={[styles.container]}>
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
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setHasError(false);
          }}
          placeholder="confirm_new_password"
          iconName="lock"
          isPassword
          autoCapitalize="none"
          isFocused={focusedField === "password"}
          onFocus={() => setFocusedField("password")}
          onBlur={() => setFocusedField(null)}
          hasError={hasError}
        />
        {hasError && (
          <View style={rowStyles.errorContainer}>
            <Icon type="Feather" name="info" size={15} color={colors.danger} />
            <Text style={[rowStyles.errorText, { color: colors.danger }]}>
              {t("enter_correct_password")}
            </Text>
          </View>
        )}
      </View>

      <Footer>
        <Button
          variant={isFormValid ? "primary" : "secondary"}
          label={t("set_new_password")}
          onPress={() => {
            // Todo : need to add login here
            // setHasError(true);
            navigation.navigate("login" as never)
          }}
          disabled={!isFormValid}
        />
      </Footer>
    </View>
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
