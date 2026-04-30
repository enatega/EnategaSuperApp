import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "../../../components/Icon";
import Text from "../../../components/Text";
import { useTheme } from "../../../theme/theme";

type Props = {
  title: string;
  description: string;
};

export default function SeeAllMapLoadingState({ title, description }: Props) {
  const { colors, typography } = useTheme();

  return (
    <LinearGradient
      colors={[colors.surface, "rgba(255,255,255,0.1)"]}
      locations={[0, 0.7]}
      style={styles.overlay}
      pointerEvents="none"
    >
      <View style={styles.content}>
        <View style={[styles.outerPulse, { backgroundColor: colors.blue100 }]} />
        <View
          style={[styles.middlePulse, { backgroundColor: colors.findingRideCenterHalo }]}
        />
        <View style={[styles.innerPulse, { backgroundColor: colors.primaryDark }]} />
        <View style={[styles.centerDot, { backgroundColor: colors.primary }]} />
      </View>

      <View style={styles.messageBlock}>
        <Icon
          type="MaterialCommunityIcons"
          name="silverware-fork-knife"
          size={40}
          color={colors.primary}
        />
        <Text
          weight="extraBold"
          style={{
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
            textAlign: "center",
          }}
        >
          {title}
        </Text>
        <Text
          color={colors.text}
          style={{
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
            textAlign: "center",
          }}
        >
          {description}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  centerDot: {
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    height: 18,
    width: 18,
  },
  content: {
    alignItems: "center",
    alignSelf: "center",
    height: 240,
    justifyContent: "center",
    marginTop: 220,
    width: 240,
  },
  innerPulse: {
    borderRadius: 52,
    height: 104,
    position: "absolute",
    width: 104,
  },
  messageBlock: {
    alignItems: "center",
    gap: 12,
    left: 16,
    position: "absolute",
    right: 16,
    top: 120,
  },
  middlePulse: {
    borderRadius: 84,
    height: 168,
    opacity: 0.7,
    position: "absolute",
    width: 168,
  },
  outerPulse: {
    borderRadius: 120,
    height: 240,
    opacity: 0.45,
    position: "absolute",
    width: 240,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
