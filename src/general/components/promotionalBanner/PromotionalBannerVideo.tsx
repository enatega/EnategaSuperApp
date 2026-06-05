import React from 'react';
import { StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

type Props = {
  uri: string;
  onReady?: () => void;
};

export default function PromotionalBannerVideo({ uri, onReady }: Props) {
  const player = useVideoPlayer({ uri }, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = false;
    videoPlayer.volume = 1;
    videoPlayer.audioMixingMode = 'doNotMix';
    videoPlayer.play();
  });

  return (
    <VideoView
      allowsFullscreen={false}
      allowsPictureInPicture={false}
      contentFit="contain"
      nativeControls={false}
      onFirstFrameRender={onReady}
      player={player}
      playsInline
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
