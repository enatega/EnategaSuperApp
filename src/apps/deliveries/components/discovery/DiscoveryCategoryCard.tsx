import React from 'react';
import type {
  ImageStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  imageUrl?: string | null;
  title: string;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  imageWrapStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

export default function DiscoveryCategoryCard({
  imageUrl,
  title,
  onPress,
  containerStyle,
  imageWrapStyle,
  imageStyle,
  titleStyle,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityLabel={title}
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.container, containerStyle]}
    >
      <View
        style={[
          styles.imageWrap,
          { backgroundColor: colors.blue100 },
          imageWrapStyle,
        ]}
      >
        <Image source={{ uri: imageUrl ?? '' }} style={[styles.image, imageStyle]} />
      </View>
      <Text
        weight="medium"
        numberOfLines={2}
        style={[
          styles.title,
          {
            fontSize: typography.size.xs2,
            lineHeight: typography.lineHeight.sm,
          },
          titleStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
    width: 72,
  },
  image: {
    borderRadius: 4,
    height: 52,
    width: 52,
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
  title: {
    textAlign: 'center',
  },
});
