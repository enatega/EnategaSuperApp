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

const EnterPassword = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const styles = useStyles(colors);
  const { t } = useTranslation();
  const [password, setPassword] = useState("oinofihoehio");
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
          heading="enter_your_password"
          description="login_desc"
        />
        <TextInputField
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setHasError(false);
          }}
          placeholder="password"
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
        <View style={rowStyles.container}>
          <TouchableOpacity
            style={rowStyles.rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[rowStyles.checkbox, { borderColor: colors.border }]}>
              {rememberMe && (
                <Icon
                  type="Feather"
                  name="check"
                  size={16}
                  color={colors.primary}
                />
              )}
            </View>
            <Text variant="caption">{t("remember_me")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("forgetPasswordEnterEmail", {
                email: "test@gmail.com",
              })
            }
          >
            <Text variant="caption" color={colors.primary}>
              {t("forget_password")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Footer>
        <Button
          variant={isFormValid ? "primary" : "secondary"}
          label={t("continue")}
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

export default EnterPassword;

const rowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
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
