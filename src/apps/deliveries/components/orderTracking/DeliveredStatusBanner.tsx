import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import Text from "../../../../general/components/Text";
import { useTheme } from "../../../../general/theme/theme";

type Props = {
  title: string;
  messageLineOne: string;
  messageLineTwo: string;
};

export default function DeliveredStatusBanner({
  title,
  messageLineOne,
  messageLineTwo,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconOuter, { backgroundColor: colors.blue100 }]}>
        <View style={[styles.iconInner, { backgroundColor: colors.blue800 }]}>
          <Ionicons color={colors.white} name="checkmark" size={44} />
        </View>
      </View>

      <Text
        color={colors.text}
        style={[
          styles.title,
          {
            fontFamily: typography.fontFamily.bold,
            fontSize: typography.size.lg2,
            lineHeight: typography.lineHeight.xl2,
          },
        ]}
        weight="bold"
      >
        {title}
      </Text>

      <View style={styles.messageWrap}>
        <Text color={colors.mutedText} style={styles.message} weight="medium">
          {messageLineOne}
        </Text>
        <Text color={colors.mutedText} style={styles.message} weight="medium">
          {messageLineTwo}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iconOuter: {
    alignItems: "center",
    borderRadius: 44,
    height: 88,
    justifyContent: "center",
    width: 88,
  },
  iconInner: {
    alignItems: "center",
    borderRadius: 36,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  message: {
    textAlign: "center",
  },
  messageWrap: {
    marginTop: 6,
  },
  title: {
    marginTop: 10,
    letterSpacing: -0.48,
  },
});
