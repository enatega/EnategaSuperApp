import React, { useMemo } from 'react';
import type { ImageProps as RNImageProps } from 'react-native';
import {
  Image as ExpoImage,
  type ImageContentFit,
  type ImageProps as ExpoImageProps,
} from 'expo-image';

// expo-image over RN's Image: it decodes off the main thread and keeps a
// memory + disk cache, so recycled FlashList cells reuse an already-decoded
// bitmap instead of re-decoding a multi-megabyte JPEG mid-scroll.
//
// The prop surface stays RN-shaped (`resizeMode`) because ~26 call sites use
// it; anything expo-image specific can still be passed straight through.
type Props = Omit<ExpoImageProps, 'contentFit'> & {
  resizeMode?: RNImageProps['resizeMode'];
  contentFit?: ImageContentFit;
};

const RESIZE_MODE_TO_CONTENT_FIT: Record<
  NonNullable<RNImageProps['resizeMode']>,
  ImageContentFit
> = {
  cover: 'cover',
  contain: 'contain',
  stretch: 'fill',
  center: 'none',
  none: 'none',
  // expo-image has no tiling mode; nothing in the app uses `repeat`, so fall
  // back to the default rather than inventing behaviour.
  repeat: 'cover',
};

// A remote URL is the natural recycling key: when a cell is reused for another
// store, the key changes and expo-image drops the previous bitmap instead of
// showing it until the new one arrives.
function readSourceUri(source: ExpoImageProps['source']): string | undefined {
  if (typeof source === 'string') {
    return source;
  }

  if (source && typeof source === 'object' && !Array.isArray(source)) {
    const uri = (source as { uri?: unknown }).uri;
    return typeof uri === 'string' && uri.length > 0 ? uri : undefined;
  }

  return undefined;
}

export default function Image({
  resizeMode,
  contentFit,
  cachePolicy = 'memory-disk',
  transition = 150,
  recyclingKey,
  source,
  ...props
}: Props) {
  const resolvedContentFit =
    contentFit ??
    (resizeMode ? RESIZE_MODE_TO_CONTENT_FIT[resizeMode] : undefined) ??
    'cover';

  const resolvedRecyclingKey = useMemo(
    () => recyclingKey ?? readSourceUri(source),
    [recyclingKey, source],
  );

  return (
    <ExpoImage
      {...props}
      cachePolicy={cachePolicy}
      contentFit={resolvedContentFit}
      recyclingKey={resolvedRecyclingKey}
      source={source}
      transition={transition}
    />
  );
}
