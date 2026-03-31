import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../../../general/theme/theme";

type Props = {
  imageUri: string;
};

export default function ImageHeader({ imageUri }: Props) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const headerHeight = Math.min(Math.max(width * 0.9, 300), 460);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, height: headerHeight },
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUri }}
          resizeMode="cover"
          style={styles.image}
        />
      </View>
      <View style={[styles.closeButtonContainer, { top: insets.top + 8 }]}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <View
            style={[
              styles.closeButton,
              { backgroundColor: colors.backgroundTertiary },
            ]}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  closeButton: {
    alignItems: "center",
    borderRadius: 22,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  closeButtonContainer: {
    position: "absolute",
    left: 16,
    zIndex: 2,
  },
  imageWrapper: {
    height: "100%",
    overflow: "hidden",
    width: "100%",
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
