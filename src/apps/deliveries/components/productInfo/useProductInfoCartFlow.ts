import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../general/components/AppToast';
import type { CartSelectionInput } from '../../api/cartServiceTypes';
import type {
  ProductInfoCustomizationsResponse,
  ProductInfoResponse,
} from '../../api/productInfoServiceTypes';
import {
  getCartActionBlockedFeedback,
} from '../../cart/cartFeedback';
import { mapProductInfoToProductActionTarget } from '../../cart/productActionMappers';
import { useCartActionEligibility } from '../../hooks/useCartActionEligibility';
import { useCartMutationFeedback } from '../../hooks/useCartMutationFeedback';
import { useAddCartItemMutation } from '../../hooks/useCartMutations';
import { useCartStoreConflictResolution } from '../../hooks/useCartStoreConflictResolution';

type Props = {
  customizations?: ProductInfoCustomizationsResponse;
  hasCustomizationContext: boolean;
  product: ProductInfoResponse;
  quantity: number;
  selectedOptions: CartSelectionInput[];
};

export default function useProductInfoCartFlow({
  customizations,
  hasCustomizationContext,
  product,
  quantity,
  selectedOptions,
}: Props) {
  const { t } = useTranslation('deliveries');
  const { showMutationError, showMutationSuccess } = useCartMutationFeedback();
  const addCartItemMutation = useAddCartItemMutation();
  const storeConflictResolution = useCartStoreConflictResolution();
  const productActionTarget = useMemo(
    () => mapProductInfoToProductActionTarget(product),
    [product],
  );
  const { decision } = useCartActionEligibility({
    customizations,
    hasCustomizationContext,
    product: productActionTarget,
    quantity,
    selectedOptions,
  });
  const isSubmitting =
    addCartItemMutation.isPending || storeConflictResolution.isResolving;
  const isAddDisabled =
    isSubmitting ||
    !product.inStock ||
    decision.kind === 'open_product_info' ||
    decision.kind === 'await_customization_context';

  const submitAddToCart = useCallback(async () => {
    await addCartItemMutation.mutateAsync({
      productId: product.productId,
      quantity,
      selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined,
    });

    showMutationSuccess('add', {
        product: product.name,
        quantity,
      });
  }, [
    addCartItemMutation,
    product.name,
    product.productId,
    quantity,
    selectedOptions,
    showMutationSuccess,
  ]);

  const handleAddToCart = useCallback(async () => {
    if (isAddDisabled) {
      const feedback = getCartActionBlockedFeedback(t, decision.kind);

      if (feedback) {
        showToast.info(feedback.title, feedback.message);
      }

      return;
    }

    if (decision.kind === 'blocked_by_store_conflict') {
      const shouldReplaceCart = await storeConflictResolution.requestResolution({
        incomingStoreName: productActionTarget.storeName,
        productName: product.name,
      });

      if (!shouldReplaceCart) {
        return;
      }
    }

    try {
      await submitAddToCart();
    } catch (error) {
      showMutationError('add', error);
    }
  }, [
    decision.kind,
    isAddDisabled,
    product.name,
    productActionTarget.storeName,
    showMutationError,
    storeConflictResolution,
    submitAddToCart,
    t,
  ]);

  return {
    conflictResolution: storeConflictResolution,
    handleAddToCart,
    isAddDisabled,
    isSubmitting,
  };
}
