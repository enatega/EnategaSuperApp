import React from 'react';
import { StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

type Props = {
  videoUri: string;
};

export default function SpecialOffersBannerVideo({ videoUri }: Props) {
  const player = useVideoPlayer({ uri: videoUri }, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
    videoPlayer.play();
  });

  return (
    <VideoView
      allowsFullscreen={false}
      allowsPictureInPicture={false}
      contentFit="cover"
      nativeControls={false}
      player={player}
      style={styles.video}
    />
  );
}

const styles = StyleSheet.create({
  video: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
  },
});
