import { useCallback } from 'react';
import { findMatchingCartItem, getMatchingCartItemQuantity, hasCartStoreConflict } from '../cart/cartLineMatching';
import type { ConfiguredCartProductReference } from '../cart/cartProductTypes';
import { useCart, useCartCount } from './useCart';

export function useCartDomain() {
  const cartQuery = useCart();
  const cartCountQuery = useCartCount();
  const cartItems = cartQuery.data?.items ?? [];
  const cartStoreId = cartQuery.data?.storeId ?? null;

  const findItem = useCallback(
    (product: ConfiguredCartProductReference) =>
      findMatchingCartItem(cartItems, product),
    [cartItems],
  );

  const getQuantity = useCallback(
    (product: ConfiguredCartProductReference) =>
      getMatchingCartItemQuantity(cartItems, product),
    [cartItems],
  );

  const hasStoreMismatch = useCallback(
    (storeId: string | null) => hasCartStoreConflict(cartStoreId, storeId),
    [cartStoreId],
  );

  return {
    cartCountQuery,
    cartItems,
    cartQuery,
    cartStoreId,
    findItem,
    getQuantity,
    hasStoreMismatch,
  };
}
