import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import Text from "../../Text";
import { useTheme } from "../../../theme/theme";

type Props = {
  onPress: () => void;
};

const TryAnotherWay = ({ onPress }: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={styles(colors).container} onPress={onPress}>
      <Text weight="medium">{t("try_another_way")}</Text>
    </TouchableOpacity>
  );
};

export default TryAnotherWay;

const styles = (colors) =>
  StyleSheet.create({
    container: {
      padding: 8,
      backgroundColor: colors.backgroundTertiary,
      borderRadius: 6,
      height: 40,
      width: 140,
      alignItems: "center",
      justifyContent: "center",
    },
  });
