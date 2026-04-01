import type { CartItem, CartSelectedOption } from '../../api/cartServiceTypes';

export const CART_MINIMUM_SPEND = 10;
export const CART_SMALL_ORDER_FEE = 2;

export function formatCartPrice(value?: number | null) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '$0.00';
  }

  return `$ ${value.toFixed(2)}`;
}

export function getCartSelectedOptionsLabel(selectedOptions: CartSelectedOption[]) {
  if (selectedOptions.length === 0) {
    return '';
  }

  return selectedOptions.map((option) => option.optionName).join(', ');
}

export function getCartItemSubtitle(item: CartItem) {
  const selectedOptionsLabel = getCartSelectedOptionsLabel(item.selectedOptions);

  if (selectedOptionsLabel) {
    return selectedOptionsLabel;
  }

  return item.description?.trim() ?? '';
}
