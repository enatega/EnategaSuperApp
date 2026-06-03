const VIDEO_FILE_EXTENSIONS = ['.mp4', '.mov', '.m4v', '.webm', '.m3u8'];

function stripQueryAndHash(uri: string) {
  return uri.split('#')[0]?.split('?')[0] ?? uri;
}

export function normalizePromotionalBannerUri(value: string | null | undefined) {
  const normalizedValue = value?.trim() ?? '';
  return normalizedValue.length > 0 ? normalizedValue : null;
}

export function isPromotionalBannerVideo(uri: string) {
  const normalizedUri = stripQueryAndHash(uri).toLowerCase();
  return VIDEO_FILE_EXTENSIONS.some((extension) => normalizedUri.endsWith(extension));
}
