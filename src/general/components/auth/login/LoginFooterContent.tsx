import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTheme } from "../../../theme/theme";
import Text from "../../Text";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";

interface LoginFooterContentProps {
  leftText?: string;
  rightText?: string;
}

const LoginFooterContent: React.FC<LoginFooterContentProps> = ({
  leftText = "dont_have_an_account",
  rightText = "signup",
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation("general");
  const navigation = useNavigation();

  const handleSignUpPress = () => {
    navigation.navigate("signup");
  };

  return (
    <View style={styles.container}>
      <Text variant="body" weight="regular" color={colors.mutedText}>
        {t(leftText)}
      </Text>
      <TouchableOpacity
        onPress={handleSignUpPress}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text variant="body" weight="bold" color={colors.primary}>
          {t(rightText)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
});

export default LoginFooterContent;
