import * as SecureStore from 'expo-secure-store';

const RECENT_SEARCHES_KEY = 'delivery_recent_address_searches';
const MAX_RECENT = 5;

export type RecentAddressSearch = {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText?: string;
  latitude: number;
  longitude: number;
};

async function readRecent(): Promise<RecentAddressSearch[]> {
  try {
    const raw = await SecureStore.getItemAsync(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentAddressSearch[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getRecentAddressSearches(): Promise<RecentAddressSearch[]> {
  return readRecent();
}

export async function saveRecentAddressSearch(item: RecentAddressSearch) {
  const existing = await readRecent();
  const next = [
    item,
    ...existing.filter((e) => e.placeId !== item.placeId),
  ].slice(0, MAX_RECENT);
  await SecureStore.setItemAsync(RECENT_SEARCHES_KEY, JSON.stringify(next));
}
