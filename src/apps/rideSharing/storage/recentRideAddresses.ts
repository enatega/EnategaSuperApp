import * as SecureStore from 'expo-secure-store';
import type { RideAddressSelection } from '../api/types';

const RECENT_FROM_KEY = 'ride_recent_from_addresses';
const RECENT_TO_KEY = 'ride_recent_to_addresses';
const MAX_RECENT_ADDRESSES = 5;

async function readRecentAddresses(key: string): Promise<RideAddressSelection[]> {
  try {
    const rawValue = await SecureStore.getItemAsync(key);
    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue) as RideAddressSelection[];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.warn('Unable to read recent ride addresses', error);
    return [];
  }
}

async function writeRecentAddresses(key: string, items: RideAddressSelection[]) {
  await SecureStore.setItemAsync(key, JSON.stringify(items));
}

export async function saveRecentFromAddress(address: RideAddressSelection) {
  const existingAddresses = await readRecentAddresses(RECENT_FROM_KEY);
  const nextAddresses = [
    address,
    ...existingAddresses.filter((item) => item.placeId !== address.placeId),
  ].slice(0, MAX_RECENT_ADDRESSES);

  await writeRecentAddresses(RECENT_FROM_KEY, nextAddresses);
}

export async function saveRecentToAddress(address: RideAddressSelection) {
  const existingAddresses = await readRecentAddresses(RECENT_TO_KEY);
  const nextAddresses = [
    address,
    ...existingAddresses.filter((item) => item.placeId !== address.placeId),
  ].slice(0, MAX_RECENT_ADDRESSES);

  await writeRecentAddresses(RECENT_TO_KEY, nextAddresses);
}

export async function getRecentRideAddresses(): Promise<RideAddressSelection[]> {
  const [recentFromAddresses, recentToAddresses] = await Promise.all([
    readRecentAddresses(RECENT_FROM_KEY),
    readRecentAddresses(RECENT_TO_KEY),
  ]);

  const seenPlaceIds = new Set<string>();
  return [...recentFromAddresses, ...recentToAddresses]
    .filter((item) => {
      if (seenPlaceIds.has(item.placeId)) {
        return false;
      }

      seenPlaceIds.add(item.placeId);
      return true;
    })
    .slice(0, MAX_RECENT_ADDRESSES);
}
