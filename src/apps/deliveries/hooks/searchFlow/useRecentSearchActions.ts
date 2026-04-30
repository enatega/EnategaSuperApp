import { useCallback, useEffect, useRef, useState } from "react";
import useRecentSearchActions from "../../../../general/hooks/searchFlow/useRecentSearchActions";
import {
  useClearRecentSearches,
  useDeleteRecentSearch,
  useSaveRecentSearch,
} from "../useSearchMutations";

export default function useDeliveriesRecentSearchActions(trimmedDebouncedQuery: string) {
  return useRecentSearchActions(trimmedDebouncedQuery, {
    useSaveRecentSearch,
    useDeleteRecentSearch,
    useClearRecentSearches,
  });
}
