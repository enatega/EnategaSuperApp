import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Animated,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ImageStyle,
  type ViewStyle,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../../../general/theme/theme";

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  imageUri: string;
  imageStyle?: StyleProp<ImageStyle>;
  showCloseButton?: boolean;
};

export const getProductInfoHeaderMaxHeight = (width: number) =>
  Math.min(Math.max(width * 0.82, 300), 420);

export const getProductInfoHeaderMinHeight = (width: number) =>
  Math.min(Math.max(width * 0.34, 112), 144);

export default function ImageHeader({
  containerStyle,
  imageUri,
  imageStyle,
  showCloseButton = true,
}: Props) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const headerHeight = getProductInfoHeaderMaxHeight(width);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, height: headerHeight },
        containerStyle,
      ]}
    >
      <View style={styles.imageWrapper}>
        <Animated.Image
          source={{ uri: imageUri }}
          resizeMode="cover"
          style={[styles.image, imageStyle]}
        />
      </View>
      {showCloseButton ? (
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
                {
                  backgroundColor: colors.backgroundTertiary,
                  shadowColor: colors.shadowColor,
                },
              ]}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </View>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  closeButton: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: 40,
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
