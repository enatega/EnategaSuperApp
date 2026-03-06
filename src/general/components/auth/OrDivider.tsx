import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../theme/theme";

const OrDivider = () => {
  const { t } = useTranslation("general");
  const { colors } = useTheme();
  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).line} />
      <Text style={styles(colors).text}>{t("or")}</Text>
      <View style={styles(colors).line} />
    </View>
  );
};

export default OrDivider;

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 20,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors?.border,
    },
    text: {
      marginHorizontal: 10,
      fontSize: 16,
      color: colors?.text,
    },
  });
