import React from 'react';
import { StyleSheet } from 'react-native';
import Image from '../../../../general/components/Image';
import { homePatterns } from '../../../../general/assets/images';
import type { DeliveryBanner } from '../../api/types';

type Props = {
  banner: DeliveryBanner;
};

export default function SpecialOffersBannerMedia({ banner }: Props) {
  const imageUri =
    banner.bannerImageLink?.trim() ??
    banner.store?.coverImage?.trim() ??
    banner.store?.storeImage?.trim() ??
    '';

  if (imageUri) {
    return <Image resizeMode='stretch' source={{ uri: imageUri }} style={styles.media} />;
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
  media: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },
  fallbackMedia: {
    opacity: 0.55,
  },
});
