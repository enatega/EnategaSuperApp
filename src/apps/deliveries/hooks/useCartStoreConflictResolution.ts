import { useCallback, useEffect, useRef, useState } from 'react';
import type { CartStoreConflictPrompt } from '../cart/cartStoreConflictTypes';
import { useClearCartAction } from './useClearCartAction';

export function useCartStoreConflictResolution() {
  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const [prompt, setPrompt] = useState<CartStoreConflictPrompt | null>(null);
  const { clearCart, isClearing } = useClearCartAction();

  const resetPrompt = useCallback(() => {
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
      setPrompt(nextPrompt);
    });
  }, []);

  const cancelResolution = useCallback(() => {
    if (isClearing) {
      return;
    }

    settle(false);
  }, [isClearing, settle]);

  const confirmResolution = useCallback(async () => {
    const didClearCart = await clearCart();

    if (didClearCart) {
      settle(true);
    }
  }, [clearCart, settle]);

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
    isResolving: isClearing,
    isVisible: prompt != null,
    prompt,
    requestResolution,
  };
}
