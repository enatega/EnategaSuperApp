const APP_URL_SCHEME = process.env.EXPO_PUBLIC_APP_URL_SCHEME ?? 'enategasuperapp';
const DELIVERY_STORE_PATH_PREFIX = 'deliveries/store';
const STORE_DETAILS_DEEP_LINK_REGEX =
  /^[a-z][a-z0-9+.-]*:\/\/\/?deliveries\/store\/([^/?#]+)/i;

export type StoreDetailsDeepLink = {
  storeId: string;
};

export function buildStoreDetailsDeepLink(storeId: string) {
  return `${APP_URL_SCHEME}://${DELIVERY_STORE_PATH_PREFIX}/${encodeURIComponent(storeId.trim())}`;
}

export function parseStoreDetailsDeepLink(url: string): StoreDetailsDeepLink | null {
  const match = url.match(STORE_DETAILS_DEEP_LINK_REGEX);

  if (!match?.[1]) {
    return null;
  }

  return {
    storeId: decodeURIComponent(match[1]),
  };
}
