import { useCallback, useEffect, useRef, useState } from "react";

type UseRecentSearchActionsOptions = {
  useSaveRecentSearch: () => { mutate: (payload: { term: string }) => void };
  useDeleteRecentSearch: (options: { onSettled: () => void }) => {
    mutate: (id: string) => void;
    isPending: boolean;
  };
  useClearRecentSearches: (options: { onSettled: () => void }) => {
    mutate: () => void;
  };
};

export default function useRecentSearchActions(
  trimmedDebouncedQuery: string,
  {
    useSaveRecentSearch,
    useDeleteRecentSearch,
    useClearRecentSearches,
  }: UseRecentSearchActionsOptions,
) {
  const lastSavedTermRef = useRef("");
  const [deletingRecentSearchId, setDeletingRecentSearchId] = useState<
    string | null
  >(null);
  const [isClearingRecentSearches, setIsClearingRecentSearches] =
    useState(false);

  const { mutate: saveRecentSearch } = useSaveRecentSearch();
  const deleteRecentSearchMutation = useDeleteRecentSearch({
    onSettled: () => {
      setDeletingRecentSearchId(null);
    },
  });
  const clearRecentSearchesMutation = useClearRecentSearches({
    onSettled: () => {
      setIsClearingRecentSearches(false);
    },
  });

  useEffect(() => {
    if (!trimmedDebouncedQuery) {
      lastSavedTermRef.current = "";
      return;
    }

    const normalizedTerm = trimmedDebouncedQuery.toLowerCase();
    if (lastSavedTermRef.current === normalizedTerm) {
      return;
    }

    lastSavedTermRef.current = normalizedTerm;
    saveRecentSearch({ term: trimmedDebouncedQuery });
  }, [trimmedDebouncedQuery, saveRecentSearch]);

  const resetSavedTerm = useCallback(() => {
    lastSavedTermRef.current = "";
  }, []);

  const handleDeleteRecentSearch = useCallback(
    (id: string) => {
      if (isClearingRecentSearches || deleteRecentSearchMutation.isPending) {
        return;
      }

      setDeletingRecentSearchId(id);
      deleteRecentSearchMutation.mutate(id);
    },
    [deleteRecentSearchMutation, isClearingRecentSearches],
  );

  const handleClearRecentSearches = useCallback(() => {
    if (isClearingRecentSearches || deleteRecentSearchMutation.isPending) {
      return;
    }

    setIsClearingRecentSearches(true);
    clearRecentSearchesMutation.mutate();
  }, [
    clearRecentSearchesMutation,
    deleteRecentSearchMutation.isPending,
    isClearingRecentSearches,
  ]);

  return {
    deletingRecentSearchId,
    isDeletingRecentSearch: deleteRecentSearchMutation.isPending,
    isClearingRecentSearches,
    resetSavedTerm,
    handleDeleteRecentSearch,
    handleClearRecentSearches,
  };
}