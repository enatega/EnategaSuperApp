import useRecentSearchActions from "../../../../general/hooks/searchFlow/useRecentSearchActions";
import {
  useClearRecentSearches,
  useDeleteRecentSearch,
  useSaveRecentSearch,
} from "../useSearchMutations";

export default function useHomeVisitsRecentSearchActions(trimmedDebouncedQuery: string) {
  return useRecentSearchActions(trimmedDebouncedQuery, {
    useSaveRecentSearch,
    useDeleteRecentSearch,
    useClearRecentSearches,
  });
}