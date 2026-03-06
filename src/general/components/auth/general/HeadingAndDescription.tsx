import { StyleSheet, View } from "react-native";
import React from "react";
import Text from "../../Text";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../theme/theme";

interface HeadingAndDescriptionProps {
  heading: string;
  description: string;
}

const HeadingAndDescription: React.FC<HeadingAndDescriptionProps> = ({
  heading,
  description,
}) => {
  const { t } = useTranslation("general");
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        weight="extraBold"
        color={colors.text}
        style={styles.heading}
      >
        {t(heading)}
      </Text>
      <Text
        variant="caption"
        weight="medium"
        color={colors.mutedText}
        style={styles.description}
      >
        {t(description)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  heading: {
    textAlign: "center",
    fontSize: 18
  },
  description: {
    textAlign: "center",
    lineHeight: 18,
  },
});

export default HeadingAndDescription;