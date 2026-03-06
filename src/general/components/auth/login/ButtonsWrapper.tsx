import { StyleSheet, View } from "react-native";
import React from "react";
import Button from "../../Button";
import Svg from "../../Svg";
import Icon from "../../Icon";
import OrDivider from "../OrDivider";
import { useTheme } from "../../../theme/theme";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

const ButtonsWrapper = () => {
  const { colors } = useTheme();
  const { t } = useTranslation("general");
  const navigation = useNavigation();
  return (
    <View>
      <View style={{ gap: 12 }}>
        <Button
          variant="secondary"
          icon={<Svg name="google" height={20} width={20} />}
          label={t("continue_with_google")}
          style={{ backgroundColor: colors.backgroundTertiary }}
        />
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
          onPress={() => navigation.navigate("enterEmail")}
        />
      </View>

      <OrDivider />

      <Button
        variant="primary"
        label={t("continue_with_phone")}
        onPress={() => navigation.navigate("enterPhoneNumber")}
      />
    </View>
  );
};

export default ButtonsWrapper;
