import type {
  RideAddressSelection,
  RidePlaceCoordinates,
  RidePlacePrediction,
} from '../api/types';
import type { CachedAddress } from '../components/rideOptions/types';

function compactAddressPart(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function normalizeAddressToken(token: string) {
  return token.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function mergeComparableAddressTokens(tokens: string[]) {
  const mergedTokens: Array<{ normalized: string; endIndex: number }> = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const currentToken = normalizeAddressToken(tokens[index]);
    const nextToken = normalizeAddressToken(tokens[index + 1] ?? '');
    const shouldMergeWithNext = /^[a-z]$/.test(currentToken) && /^\d+[a-z]?\d*$/.test(nextToken);

    if (shouldMergeWithNext) {
      mergedTokens.push({
        normalized: `${currentToken}${nextToken}`,
        endIndex: index + 1,
      });
      index += 1;
      continue;
    }

    mergedTokens.push({
      normalized: currentToken,
      endIndex: index,
    });
  }

  return mergedTokens;
}

function cleanRepeatedAddressPhrase(value: string) {
  const originalTokens = compactAddressPart(value).split(' ').filter(Boolean);

  if (originalTokens.length < 2) {
    return compactAddressPart(value);
  }

  const comparableTokens = mergeComparableAddressTokens(originalTokens);
  const normalizedTokens = comparableTokens.map((token) => token.normalized);

  for (let chunkSize = 1; chunkSize <= Math.floor(normalizedTokens.length / 2); chunkSize += 1) {
    const firstChunk = normalizedTokens.slice(0, chunkSize);
    let cursor = chunkSize;
    let repeatCount = 1;

    while (cursor + chunkSize <= normalizedTokens.length) {
      const nextChunk = normalizedTokens.slice(cursor, cursor + chunkSize);
      const isSameChunk = nextChunk.every((token, index) => token === firstChunk[index]);

      if (!isSameChunk) {
        break;
      }

      repeatCount += 1;
      cursor += chunkSize;
    }

    if (repeatCount > 1) {
      const originalEndIndex = comparableTokens[chunkSize - 1]?.endIndex ?? (chunkSize - 1);
      return originalTokens.slice(0, originalEndIndex + 1).join(' ');
    }
  }

  return originalTokens.join(' ');
}

function normalizeAddressSegment(segment: string) {
  return cleanRepeatedAddressPhrase(compactAddressPart(segment));
}

function normalizeAddressPart(value: string) {
  return value
    .toLowerCase()
    .replace(/[-/,#.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeAddressDescription(description: string) {
  const segments = description
    .split(',')
    .map(normalizeAddressSegment)
    .filter(Boolean);

  const dedupedSegments = segments.reduce<string[]>((parts, segment) => {
    const normalizedSegment = normalizeAddressPart(segment);

    if (!normalizedSegment) {
      return parts;
    }

    const isDuplicate = parts.some((existingPart) => {
      const normalizedExistingPart = normalizeAddressPart(existingPart);

      return normalizedExistingPart === normalizedSegment
        || normalizedExistingPart.includes(normalizedSegment)
        || normalizedSegment.includes(normalizedExistingPart);
    });

    if (!isDuplicate) {
      parts.push(segment);
    }

    return parts;
  }, []);

  return dedupedSegments.join(', ');
}

export function splitAddressDescription(description: string) {
  const normalizedDescription = normalizeAddressDescription(description);
  const [mainText, ...secondaryParts] = normalizedDescription.split(',');

  return {
    mainText: mainText?.trim() ?? normalizedDescription,
    secondaryText: secondaryParts.join(',').trim() || undefined,
  };
}

export function toRideAddressSelection(
  prediction: RidePlacePrediction,
  coordinates: RidePlaceCoordinates,
): RideAddressSelection {
  const description = normalizeAddressDescription(prediction.description);
  const structuredFormatting = splitAddressDescription(description);

  return {
    placeId: prediction.place_id,
    description,
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
