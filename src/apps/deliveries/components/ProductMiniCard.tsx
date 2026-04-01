import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../general/theme/theme";
import Text from "../../../general/components/Text";
import Image from "../../../general/components/Image";
import { typography } from "../../../general/theme/typography";
import type { DeliveryProductActionBinding } from "../cart/productActionTypes";

export interface ProductMiniCardProps {
  title: string;
  imageUri?: string;
  onPress?: () => void;
  productAction?: DeliveryProductActionBinding;
}

const ProductMiniCard = ({
  title,
  imageUri,
  onPress,
  productAction,
}: ProductMiniCardProps) => {
  const { colors } = useTheme();

  const handlePress = React.useCallback(() => {
    if (productAction?.onOpenProduct) {
      productAction.onOpenProduct(productAction.target);
      return;
    }

    onPress?.();
  }, [onPress, productAction]);

  const ResolvedCardWrapper =
    productAction?.onOpenProduct || onPress ? TouchableOpacity : View;

  return (
    <ResolvedCardWrapper
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.shadowColor,
        },
      ]}
      onPress={handlePress}
      activeOpacity={productAction?.onOpenProduct || onPress ? 0.8 : 1}
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
    </ResolvedCardWrapper>
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
