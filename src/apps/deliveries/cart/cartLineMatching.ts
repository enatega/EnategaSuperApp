import type { CartItem, CartSelectionInput } from '../api/cartServiceTypes';
import type { ConfiguredCartProductReference } from './cartProductTypes';

function normalizeSelectionInputs(selectedOptions?: CartSelectionInput[]) {
  return [...(selectedOptions ?? [])]
    .filter((option) => option.groupId.length > 0 && option.optionId.length > 0)
    .sort((left, right) => {
      const leftKey = `${left.groupId}:${left.optionId}`;
      const rightKey = `${right.groupId}:${right.optionId}`;

      return leftKey.localeCompare(rightKey);
    });
}

function buildSelectionSignature(selectedOptions?: CartSelectionInput[]) {
  return normalizeSelectionInputs(selectedOptions)
    .map((option) => `${option.groupId}:${option.optionId}`)
    .join('|');
}

export function matchesCartItemSelection(
  item: CartItem,
  product: ConfiguredCartProductReference,
) {
  if (item.productId !== product.productId) {
    return false;
  }

  return (
    buildSelectionSignature(item.selectedOptions) ===
    buildSelectionSignature(product.selectedOptions)
  );
}

export function findMatchingCartItem(
  items: CartItem[],
  product: ConfiguredCartProductReference,
) {
  return items.find((item) => matchesCartItemSelection(item, product)) ?? null;
}

export function getMatchingCartItemQuantity(
  items: CartItem[],
  product: ConfiguredCartProductReference,
) {
  return findMatchingCartItem(items, product)?.quantity ?? 0;
}

export function getCartProductQuantity(items: CartItem[], productId: string) {
  return items.reduce((total, item) => (
    item.productId === productId ? total + item.quantity : total
  ), 0);
}

export function hasCartStoreConflict(cartStoreId: string | null, storeId: string | null) {
  if (!cartStoreId || !storeId) {
    return false;
  }

  return cartStoreId !== storeId;
}
