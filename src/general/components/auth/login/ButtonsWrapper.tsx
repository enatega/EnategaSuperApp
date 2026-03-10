import { StyleSheet, View } from "react-native";
import React from "react";
import Button from "../../Button";
import Icon from "../../Icon";
import OrDivider from "../OrDivider";
import { useTheme } from "../../../theme/theme";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../../../stores/useAuthStore";
import GoogleLogin from "../GoogleLogin";

const ButtonsWrapper = () => {
  const { colors } = useTheme();
  const { t } = useTranslation("general");
  const navigation = useNavigation();
  const { setFlowType } = useAuthStore();
  return (
    <View>
      <View style={{ gap: 12 }}>
        <GoogleLogin />
        <Button
          variant="secondary"
          icon={
            <Icon
              type="Feather"
              name="mail"
              size={20}
              color={colors.iconColor}
            />
          }
          label={t("continue_with_email")}
          style={{ backgroundColor: colors.backgroundTertiary }}
          onPress={() => {
            setFlowType("login");
            navigation.navigate("enterEmail");
          }}
        />
      </View>

      <OrDivider />

      <Button
        variant="primary"
        label={t("continue_with_phone")}
        onPress={() => {
          setFlowType("login");
          navigation.navigate("enterPhoneNumber");
        }}
      />
    </View>
  );
};

export default ButtonsWrapper;
