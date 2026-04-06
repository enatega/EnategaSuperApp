import { useCallback } from 'react';
import { useCartMutationFeedback } from './useCartMutationFeedback';
import { useClearCartMutation } from './useCartMutations';

type Options = {
  onSuccess?: () => void;
  showSuccessToast?: boolean;
};

export function useClearCartAction(options?: Options) {
  const clearCartMutation = useClearCartMutation();
  const { showMutationError, showMutationSuccess } = useCartMutationFeedback();
  const onSuccess = options?.onSuccess;
  const showSuccessToast = options?.showSuccessToast ?? false;

  const clearCart = useCallback(async () => {
    try {
      await clearCartMutation.mutateAsync();
      if (showSuccessToast) {
        showMutationSuccess('clear');
      }
      onSuccess?.();
      return true;
    } catch (error) {
      showMutationError('clear', error);
      return false;
    }
  }, [clearCartMutation, onSuccess, showMutationError, showMutationSuccess, showSuccessToast]);

  return {
    clearCart,
    isClearing: clearCartMutation.isPending,
  };
}
