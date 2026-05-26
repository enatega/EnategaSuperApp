import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Image from '../../../../general/components/Image';
import { homePatterns } from '../../../../general/assets/images';
import type { DeliveryBanner } from '../../api/types';

type Props = {
  banner: DeliveryBanner;
};

export default function SpecialOffersBannerMedia({ banner }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imageUri =
    banner.bannerImageLink?.trim() ??
    banner.store?.coverImage?.trim() ??
    banner.store?.storeImage?.trim() ??
    '';

  if (imageUri) {
    return (
      <View style={styles.container}>
        <Image
          resizeMode="stretch"
          source={homePatterns.banner}
          style={[styles.media, styles.fallbackMedia]}
        />
        <Image
          fadeDuration={0}
          onError={() => setIsLoaded(false)}
          onLoad={() => setIsLoaded(true)}
          resizeMode="cover"
          source={{ uri: imageUri }}
          style={[styles.media, { opacity: isLoaded ? 1 : 0 }]}
        />
      </View>
    );
  }

  return (
    <Image
      resizeMode="stretch"
      source={homePatterns.banner}
      style={[styles.media, styles.fallbackMedia]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  media: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },
  fallbackMedia: {
    opacity: 0.55,
  },
});
