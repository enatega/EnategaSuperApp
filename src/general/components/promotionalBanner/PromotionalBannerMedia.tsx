import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Image from '../Image';
import { isPromotionalBannerVideo } from '../../utils/promotionalBanner';
import { useTheme } from '../../theme/theme';
import PromotionalBannerVideo from './PromotionalBannerVideo';

type Props = {
  uri: string;
  onVideoEnd?: () => void;
};

export default function PromotionalBannerMedia({ uri, onVideoEnd }: Props) {
  const { colors } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const isVideo = isPromotionalBannerVideo(uri);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isVideo ? colors.shadowColor : colors.border },
      ]}
    >
      {!isReady ? (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : null}

      {isVideo ? (
        <PromotionalBannerVideo
          uri={uri}
          onReady={() => setIsReady(true)}
          onEnd={onVideoEnd}
        />
      ) : (
        <Image
          fadeDuration={0}
          onError={() => setIsReady(true)}
          onLoad={() => setIsReady(true)}
          resizeMode="cover"
          source={{ uri }}
          style={[styles.media, { opacity: isReady ? 1 : 0 }]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  media: {
    width: '100%',
    height: '100%',
  },
});
