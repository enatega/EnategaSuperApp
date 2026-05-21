import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useTheme } from '../general/theme/theme';

type Props = {
  onFinish?: () => void;
};

const splashVideoSource = require('../../assets/mobileSplash.mp4');
const splashFallbackDurationMs = 3500;

export function SplashScreen({ onFinish }: Props) {
  const { colors } = useTheme();
  const hasFinishedRef = useRef(false);
  const player = useVideoPlayer(splashVideoSource, (videoPlayer) => {
    videoPlayer.loop = false;
    videoPlayer.muted = true;
    videoPlayer.play();
  });

  useEffect(() => {
    const finish = () => {
      if (hasFinishedRef.current) {
        return;
      }
      hasFinishedRef.current = true;
      onFinish?.();
    };

    const endSubscription = player.addListener('playToEnd', finish);
    const finishTimer = setTimeout(() => {
      finish();
    }, splashFallbackDurationMs);

    return () => {
      endSubscription.remove();
      clearTimeout(finishTimer);
    };
  }, [onFinish, player]);

  return (
    <View style={[styles.container, { backgroundColor: colors.shadowColor }]}>
      <VideoView
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        contentFit="cover"
        nativeControls={false}
        player={player}
        style={styles.video}
      />
    </View>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
});
