import React from 'react';
import { StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

type Props = {
  uri: string;
  onReady?: () => void;
  onEnd?: () => void;
};

export default function PromotionalBannerVideo({ uri, onReady, onEnd }: Props) {
  const player = useVideoPlayer({ uri }, (videoPlayer) => {
    videoPlayer.loop = !onEnd;
    videoPlayer.muted = false;
    videoPlayer.volume = 1;
    videoPlayer.audioMixingMode = 'doNotMix';
    videoPlayer.play();
  });

  React.useEffect(() => {
    if (!onEnd) {
      return;
    }

    const subscription = player.addListener('playToEnd', () => {
      onEnd();
    });

    return () => {
      subscription.remove();
    };
  }, [onEnd, player]);

  return (
    <VideoView
      allowsFullscreen={false}
      allowsPictureInPicture={false}
      contentFit="cover"
      nativeControls={false}
      onFirstFrameRender={onReady}
      player={player}
      playsInline
      surfaceType="textureView"
      style={styles.video}
    />
  );
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  },
});
