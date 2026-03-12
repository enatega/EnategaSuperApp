import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../general/theme/theme";
import Text from "../../../general/components/Text";
import Image from "../../../general/components/Image";
import { typography } from "../../../general/theme/typography";

interface ProductMiniCardProps {
  title: string;
  imageUri?: string;
  onPress?: () => void;
}

const ProductMiniCard = ({
  title,
  imageUri,
  onPress,
}: ProductMiniCardProps) => {
  const { colors } = useTheme();

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.shadowColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={styles.imageContainer}>
        <Image
          source={imageUri ? { uri: imageUri } : undefined}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <Text
        weight="semiBold"
        style={{
          color: colors.text,
          fontSize: typography.size.xxs,
          lineHeight: 12,
        }}
        numberOfLines={2}
      >
        {title}
      </Text>
    </CardWrapper>
  );
};

export default ProductMiniCard;

const styles = StyleSheet.create({
  container: {
    width: 100,
    borderRadius: 8,
    padding: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 6
  },
  imageContainer: {
    width: 84, // 100 - (8*2) padding
    height: 84,
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 6,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
