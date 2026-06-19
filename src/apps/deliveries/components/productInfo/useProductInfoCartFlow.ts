import { useCallback, useEffect, useMemo } from 'react';
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
import { summarizeCartCustomizations } from '../../cart/cartCustomizationRules';
import { useCartActionEligibility } from '../../hooks/useCartActionEligibility';
import { useCartMutationFeedback } from '../../hooks/useCartMutationFeedback';
import { useAddCartItemMutation } from '../../hooks/useCartMutations';
import { useCartStoreConflictResolution } from '../../hooks/useCartStoreConflictResolution';

const ENABLE_PRODUCT_INFO_CART_DEBUG = true;

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
  const customizationSummary = useMemo(
    () => summarizeCartCustomizations(customizations, selectedOptions),
    [customizations, selectedOptions],
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

  useEffect(() => {
    if (!ENABLE_PRODUCT_INFO_CART_DEBUG) {
      return;
    }

    console.log('[Deliveries][ProductInfo][CartValidation]', {
      customizationSummary,
      decision,
      hasCustomizationContext,
      isAddDisabled,
      productId: product.productId,
      selectedOptions,
    });
  }, [
    customizationSummary,
    decision,
    hasCustomizationContext,
    isAddDisabled,
    product.productId,
    selectedOptions,
  ]);

  const submitAddToCart = useCallback(async () => {
    const payload = {
      productId: product.productId,
      quantity,
      selectedOptions: selectedOptions.length > 0 ? selectedOptions : undefined,
    };

    if (ENABLE_PRODUCT_INFO_CART_DEBUG) {
      console.log('[Deliveries][ProductInfo][AddToCartPayload]', payload);
    }

    await addCartItemMutation.mutateAsync(payload);

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
      if (ENABLE_PRODUCT_INFO_CART_DEBUG) {
        console.log('[Deliveries][ProductInfo][AddToCartBlocked]', {
          customizationSummary,
          decision,
          isAddDisabled,
          productId: product.productId,
          selectedOptions,
        });
      }

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
      if (ENABLE_PRODUCT_INFO_CART_DEBUG) {
        console.log('[Deliveries][ProductInfo][AddToCartError]', {
          decision,
          error,
          productId: product.productId,
          selectedOptions,
        });
      }

      showMutationError('add', error);
    }
  }, [
    customizationSummary,
    decision.kind,
    decision,
    isAddDisabled,
    product.name,
    product.productId,
    productActionTarget.storeName,
    selectedOptions,
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
