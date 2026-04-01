import { useCallback, useEffect, useRef, useState } from 'react';
import type { CartStoreConflictPrompt } from '../cart/cartStoreConflictTypes';
import { useCartMutationFeedback } from './useCartMutationFeedback';
import { useClearCartMutation } from './useCartMutations';

export function useCartStoreConflictResolution() {
  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<CartStoreConflictPrompt | null>(null);
  const clearCartMutation = useClearCartMutation();
  const { showMutationError } = useCartMutationFeedback();

  const resetPrompt = useCallback(() => {
    setErrorMessage(null);
    setPrompt(null);
  }, []);

  const settle = useCallback(
    (value: boolean) => {
      resolveRef.current?.(value);
      resolveRef.current = null;
      resetPrompt();
    },
    [resetPrompt],
  );

  const requestResolution = useCallback((nextPrompt: CartStoreConflictPrompt) => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current?.(false);
      resolveRef.current = resolve;
      setErrorMessage(null);
      setPrompt(nextPrompt);
    });
  }, []);

  const cancelResolution = useCallback(() => {
    if (clearCartMutation.isPending) {
      return;
    }

    settle(false);
  }, [clearCartMutation.isPending, settle]);

  const confirmResolution = useCallback(async () => {
    try {
      await clearCartMutation.mutateAsync();
      settle(true);
    } catch (error) {
      showMutationError('clear', error);
      setErrorMessage(
        error instanceof Error && error.message.trim().length > 0
          ? error.message
          : null,
      );
    }
  }, [clearCartMutation, settle, showMutationError]);

  useEffect(() => {
    return () => {
      if (resolveRef.current) {
        resolveRef.current(false);
        resolveRef.current = null;
      }
    };
  }, []);

  return {
    cancelResolution,
    confirmResolution,
    errorMessage,
    isResolving: clearCartMutation.isPending,
    isVisible: prompt != null,
    prompt,
    requestResolution,
  };
}
