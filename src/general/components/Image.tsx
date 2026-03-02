import React from 'react';
import { Image as RNImage, ImageProps } from 'react-native';

export default function Image(props: ImageProps) {
  return <RNImage {...props} />;
}
