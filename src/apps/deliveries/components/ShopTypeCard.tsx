import React from 'react';
import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { StyleSheet, View } from 'react-native';
import Text from '../../../general/components/Text';
import Image from '../../../general/components/Image';
import { useTheme } from '../../../general/theme/theme';

type Props = {
  image: ImageSourcePropType;
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
  imageWrapStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

export default function ShopTypeCard({
  image,
  title,
  containerStyle,
  imageWrapStyle,
  imageStyle,
  titleStyle,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.imageWrap,
          { backgroundColor: colors.blue100 },
          imageWrapStyle,
        ]}
      >
        <Image source={image} style={[styles.image, imageStyle]} />
      </View>
      <Text
        weight="medium"
        numberOfLines={2}
        style={[
          {
            fontSize: typography.size.xs2,
            lineHeight: typography.lineHeight.sm,
            textAlign: 'center',
          },
          titleStyle,
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
    width: 72,
  },
  imageWrap: {
    alignItems: 'center',
    borderRadius: 8,
    height: 72,
    justifyContent: 'center',
    padding: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: 72,
  },
  image: {
    borderRadius: 4,
    height: 52,
    width: 52,
  },
});
