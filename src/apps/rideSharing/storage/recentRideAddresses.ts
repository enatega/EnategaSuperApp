import * as SecureStore from 'expo-secure-store';
import type { RideAddressSelection } from '../api/types';

const RECENT_FROM_KEY = 'ride_recent_from_addresses';
const RECENT_TO_KEY = 'ride_recent_to_addresses';
const MAX_RECENT_ADDRESSES = 5;

type StoredRecentRideAddress = {
  address: RideAddressSelection;
  lastUsedAt: number;
};

function isValidRideAddressSelection(value: unknown): value is RideAddressSelection {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<RideAddressSelection>;
  return typeof candidate.placeId === 'string'
    && typeof candidate.description === 'string'
    && typeof candidate.structuredFormatting?.mainText === 'string'
    && typeof candidate.coordinates?.latitude === 'number'
    && typeof candidate.coordinates?.longitude === 'number';
}

function normalizeStoredRecentAddresses(rawValue: string): StoredRecentRideAddress[] {
  const parsedValue = JSON.parse(rawValue) as unknown;
  if (!Array.isArray(parsedValue)) {
    return [];
  }

  return parsedValue.reduce<StoredRecentRideAddress[]>((items, item, index) => {
    if (isValidRideAddressSelection(item)) {
      items.push({
        address: item,
        // Preserve existing order for legacy stored values by assigning newer
        // timestamps to earlier items in the array.
        lastUsedAt: Date.now() - index,
      });
      return items;
    }

    if (!item || typeof item !== 'object') {
      return items;
    }

    const candidate = item as Partial<StoredRecentRideAddress>;
    if (!isValidRideAddressSelection(candidate.address)) {
      return items;
    }

    items.push({
      address: candidate.address,
      lastUsedAt: typeof candidate.lastUsedAt === 'number' ? candidate.lastUsedAt : Date.now() - index,
    });
    return items;
  }, []);
}

async function readRecentAddresses(key: string): Promise<StoredRecentRideAddress[]> {
  try {
    const rawValue = await SecureStore.getItemAsync(key);
    if (!rawValue) {
      return [];
    }

    return normalizeStoredRecentAddresses(rawValue);
  } catch (error) {
    console.warn('Unable to read recent ride addresses', error);
    return [];
  }
}

async function writeRecentAddresses(key: string, items: StoredRecentRideAddress[]) {
  await SecureStore.setItemAsync(key, JSON.stringify(items));
}

function buildNextRecentAddresses(
  existingAddresses: StoredRecentRideAddress[],
  address: RideAddressSelection,
) {
  const nextAddresses = [
    {
      address,
      lastUsedAt: Date.now(),
    },
    ...existingAddresses.filter((item) => item.address.placeId !== address.placeId),
  ];

  return nextAddresses.slice(0, MAX_RECENT_ADDRESSES);
}

export async function saveRecentFromAddress(address: RideAddressSelection) {
  const existingAddresses = await readRecentAddresses(RECENT_FROM_KEY);
  await writeRecentAddresses(
    RECENT_FROM_KEY,
    buildNextRecentAddresses(existingAddresses, address),
  );
}

export async function saveRecentToAddress(address: RideAddressSelection) {
  const existingAddresses = await readRecentAddresses(RECENT_TO_KEY);
  await writeRecentAddresses(
    RECENT_TO_KEY,
    buildNextRecentAddresses(existingAddresses, address),
  );
}

export async function getRecentRideAddresses(): Promise<RideAddressSelection[]> {
  const [recentFromAddresses, recentToAddresses] = await Promise.all([
    readRecentAddresses(RECENT_FROM_KEY),
    readRecentAddresses(RECENT_TO_KEY),
  ]);

  const latestAddressesByPlaceId = new Map<string, StoredRecentRideAddress>();

  [...recentFromAddresses, ...recentToAddresses].forEach((item) => {
    const existingItem = latestAddressesByPlaceId.get(item.address.placeId);

    if (!existingItem || item.lastUsedAt > existingItem.lastUsedAt) {
      latestAddressesByPlaceId.set(item.address.placeId, item);
    }
  });

  return [...latestAddressesByPlaceId.values()]
    .sort((left, right) => right.lastUsedAt - left.lastUsedAt)
    .map((item) => item.address)
    .slice(0, MAX_RECENT_ADDRESSES);
}
