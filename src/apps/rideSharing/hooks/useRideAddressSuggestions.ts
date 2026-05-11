import { useMemo } from 'react';
import type { CachedAddress } from '../components/rideOptions/types';
import useDebouncedValue from '../../../general/hooks/useDebouncedValue';
import useRecentRideAddresses from './useRecentRideAddresses';
import useRideAddressPredictions from './useRideAddressPredictions';
import { normalizeAddressDescription, toCachedAddress } from '../utils/rideAddress';

type Params = {
  inputValue: string;
  isInteractionActive?: boolean;
  hasConfirmedSelection?: boolean;
  debounceMs?: number;
};

export default function useRideAddressSuggestions({
  inputValue,
  isInteractionActive = true,
  hasConfirmedSelection = false,
  debounceMs = 500,
}: Params) {
  const {
    recentAddresses,
    isLoadingRecentAddresses,
    refreshRecentAddresses,
  } = useRecentRideAddresses();

  const normalizedInputValue = inputValue.trim();
  const debouncedQuery = useDebouncedValue(normalizedInputValue, debounceMs);
  const isSearchMode = isInteractionActive
    && normalizedInputValue.length > 0
    && !hasConfirmedSelection;
  const shouldSearchSuggestions = debouncedQuery.length > 0 && isSearchMode;

  const predictionsQuery = useRideAddressPredictions(
    debouncedQuery,
    shouldSearchSuggestions,
  );

  const isWaitingForDebounce = isSearchMode && normalizedInputValue !== debouncedQuery;
  const shouldShowSuggestionSkeleton = isSearchMode
    && (isWaitingForDebounce || predictionsQuery.isFetching || predictionsQuery.isPending);
  const shouldShowRecentSkeleton = isInteractionActive
    && normalizedInputValue.length === 0
    && isLoadingRecentAddresses
    && recentAddresses.length === 0;

  const suggestionAddresses = useMemo<CachedAddress[]>(() => {
    if (isSearchMode) {
      return (predictionsQuery.data ?? []).map((prediction) => {
        const description = normalizeAddressDescription(prediction.description);
        const [mainText, ...secondaryParts] = description.split(',');

        return {
          placeId: prediction.place_id,
          description,
          structuredFormatting: {
            mainText: mainText?.trim() ?? description,
            secondaryText: secondaryParts.join(',').trim() || undefined,
          },
        };
      });
    }

    return recentAddresses.map(toCachedAddress);
  }, [isSearchMode, predictionsQuery.data, recentAddresses]);

  return {
    recentAddresses,
    isLoadingRecentAddresses,
    refreshRecentAddresses,
    suggestionAddresses,
    isSearchMode,
    shouldSearchSuggestions,
    shouldShowSuggestionSkeleton,
    shouldShowRecentSkeleton,
  };
}
