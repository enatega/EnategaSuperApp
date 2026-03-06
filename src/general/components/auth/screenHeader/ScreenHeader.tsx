import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "../../Icon";

interface ScreenHeaderProps {
  colors: {
    iconColor: string;
    background?: string;
  };
  onBack: () => void;
}

const ScreenHeader: React.FC<ScreenHeaderProps> = ({ colors, onBack }) => {
  const insets = useSafeAreaInsets();

  const getTopMargin = () => {
    if (Platform.OS === "ios") {
      // For iOS, use the safe area insets naturally
      return 0;
    } else {
      // For Android
      if (insets.top === 0) {
        // Devices without status bar padding (most Android devices)
        return 20;
      } else {
        // Devices with custom insets (some Android devices with notches)
        return insets.top;
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={onBack}
      style={[styles(colors).backButton, { marginTop: getTopMargin() }]}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={styles(colors).backButtonCircle}>
        <Icon
          type="AntDesign"
          name="arrow-left"
          size={20}
          color={colors.iconColor}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = (colors:any) =>
  StyleSheet.create({
    backButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "flex-start",
      marginBottom: 16,
      marginLeft: 16, // Add left margin for consistent positioning
    },
    backButtonCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors?.backgroundTertiary || "#F4F4F5",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  });

export default ScreenHeader;
