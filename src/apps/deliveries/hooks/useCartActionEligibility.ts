import { useMemo } from 'react';
import type { CartSelectionInput } from '../api/cartServiceTypes';
import type { ProductInfoCustomizationsResponse } from '../api/productInfoServiceTypes';
import { getCartActionDecision } from '../cart/cartActionRules';
import type { CartProductReference } from '../cart/cartProductTypes';
import { useCartDomain } from './useCartDomain';

type Params = {
  customizations?: ProductInfoCustomizationsResponse | null;
  hasCustomizationContext?: boolean;
  product: CartProductReference;
  quantity?: number;
  selectedOptions?: CartSelectionInput[];
};

export function useCartActionEligibility({
  customizations,
  hasCustomizationContext = customizations !== undefined,
  product,
  quantity = 1,
  selectedOptions,
}: Params) {
  const { cartStoreId, findItem, getQuantity, hasStoreMismatch } = useCartDomain();

  const configuredProduct = useMemo(
    () => ({
      ...product,
      quantity,
      selectedOptions,
    }),
    [product, quantity, selectedOptions],
  );

  const matchingItem = findItem(configuredProduct);
  const quantityInCart = getQuantity(configuredProduct);
  const hasStoreConflict = hasStoreMismatch(product.storeId);
  const decision = getCartActionDecision({
    cartStoreId,
    customizations,
    hasCustomizationContext,
    matchingItem,
    product: configuredProduct,
  });

  return {
    decision,
    hasStoreConflict,
    matchingItem,
    quantityInCart,
  };
}
