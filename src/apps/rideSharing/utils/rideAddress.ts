import type {
  RideAddressSelection,
  RidePlaceCoordinates,
  RidePlacePrediction,
} from '../api/types';
import type { CachedAddress } from '../components/rideOptions/types';

export function splitAddressDescription(description: string) {
  const [mainText, ...secondaryParts] = description.split(',');

  return {
    mainText: mainText?.trim() ?? description,
    secondaryText: secondaryParts.join(',').trim() || undefined,
  };
}

export function toRideAddressSelection(
  prediction: RidePlacePrediction,
  coordinates: RidePlaceCoordinates,
): RideAddressSelection {
  const structuredFormatting = splitAddressDescription(prediction.description);

  return {
    placeId: prediction.place_id,
    description: prediction.description,
    structuredFormatting,
    coordinates: {
      latitude: Number(coordinates.lat),
      longitude: Number(coordinates.lng),
    },
  };
}

export function toCachedAddress(address: RideAddressSelection): CachedAddress {
  return {
    placeId: address.placeId,
    description: address.description,
    structuredFormatting: address.structuredFormatting,
    coordinates: address.coordinates,
  };
}
