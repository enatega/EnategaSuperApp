import React from 'react';
import { useCartDomain } from './useCartDomain';
import type { DeliveryProductActionBinding } from '../cart/productActionTypes';

type Params = {
  productAction?: DeliveryProductActionBinding;
};

export function useProductCardCartState({ productAction }: Params) {
  const { getProductQuantity, getQuantity } = useCartDomain();
  const target = productAction?.target;
  const exactQuantity = target ? getQuantity(target) : 0;
  const totalQuantity = target ? getProductQuantity(target.productId) : 0;
  const canUseInlineQuantity = Boolean(productAction?.onRequestCartAction && exactQuantity > 0);
  const isDisabled = !productAction?.onRequestCartAction && !productAction?.onOpenProduct;

  const handlePrimaryCartAction = React.useCallback(() => {
    if (!target) {
      return;
    }

    if (productAction?.onRequestCartAction) {
      productAction.onRequestCartAction(target);
      return;
    }

    productAction?.onOpenProduct?.(target);
  }, [productAction, target]);

  return {
    canUseInlineQuantity,
    controlCount: exactQuantity,
    controlMode: canUseInlineQuantity ? 'quantity' as const : 'add' as const,
    exactQuantity,
    handleAdd: handlePrimaryCartAction,
    handleDecrement: canUseInlineQuantity ? handlePrimaryCartAction : undefined,
    handleIncrement: canUseInlineQuantity ? handlePrimaryCartAction : undefined,
    isDisabled,
    shouldShowCountBadge: totalQuantity > 0 && !canUseInlineQuantity,
    totalQuantity,
  };
}
