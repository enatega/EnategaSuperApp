import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../general/components/AppToast';
import {
  getCartMutationErrorFeedback,
  getCartMutationSuccessFeedback,
  type CartMutationFeedbackKind,
} from '../cart/cartFeedback';

export function useCartMutationFeedback() {
  const { t } = useTranslation('deliveries');

  const showMutationError = useCallback(
    (kind: CartMutationFeedbackKind, error: unknown) => {
      const feedback = getCartMutationErrorFeedback(t, kind, error);
      showToast.error(feedback.title, feedback.message);
    },
    [t],
  );

  const showMutationSuccess = useCallback(
    (
      kind: CartMutationFeedbackKind,
      params?: Record<string, string | number>,
    ) => {
      const feedback = getCartMutationSuccessFeedback(t, kind, params);

      if (!feedback) {
        return;
      }

      showToast.success(feedback.title, feedback.message);
    },
    [t],
  );

  return {
    showMutationError,
    showMutationSuccess,
  };
}
