import type { CartItem } from '../api/cartServiceTypes';
import type { ProductInfoCustomizationsResponse } from '../api/productInfoServiceTypes';
import { hasCartStoreConflict } from './cartLineMatching';
import type { ConfiguredCartProductReference } from './cartProductTypes';
import {
  summarizeCartCustomizations,
  type CartCustomizationSummary,
} from './cartCustomizationRules';

export type CartActionDecisionReason =
  | 'matching_cart_item'
  | 'missing_customization_context'
  | 'ready_for_direct_add'
  | 'required_selection_missing'
  | 'store_conflict';

export type CartActionDecisionKind =
  | 'await_customization_context'
  | 'blocked_by_store_conflict'
  | 'direct_add'
  | 'increment_matching_item'
  | 'open_product_info';

export type CartActionDecision = {
  kind: CartActionDecisionKind;
  reason: CartActionDecisionReason;
  canOpenProductInfo: boolean;
  canUseInlineQuantity: boolean;
  canUsePrimaryAddAction: boolean;
};

type Params = {
  cartStoreId: string | null;
  customizations?: ProductInfoCustomizationsResponse | null;
  hasCustomizationContext?: boolean;
  matchingItem?: CartItem | null;
  product: ConfiguredCartProductReference;
};

export function getCartActionDecision({
  cartStoreId,
  customizations,
  hasCustomizationContext = false,
  matchingItem,
  product,
}: Params): CartActionDecision {
  if (hasCartStoreConflict(cartStoreId, product.storeId)) {
    return {
      kind: 'blocked_by_store_conflict',
      reason: 'store_conflict',
      canOpenProductInfo: false,
      canUseInlineQuantity: false,
      canUsePrimaryAddAction: false,
    };
  }

  if (matchingItem) {
    return {
      kind: 'increment_matching_item',
      reason: 'matching_cart_item',
      canOpenProductInfo: product.source !== 'productInfo',
      canUseInlineQuantity: true,
      canUsePrimaryAddAction: true,
    };
  }

  if (product.source === 'productInfo' && !hasCustomizationContext) {
    return {
      kind: 'await_customization_context',
      reason: 'missing_customization_context',
      canOpenProductInfo: false,
      canUseInlineQuantity: false,
      canUsePrimaryAddAction: false,
    };
  }

  const customizationSummary: CartCustomizationSummary | null =
    customizations != null
      ? summarizeCartCustomizations(customizations, product.selectedOptions)
      : null;

  if (product.source !== 'productInfo' && customizationSummary == null) {
    return {
      kind: 'open_product_info',
      reason: 'missing_customization_context',
      canOpenProductInfo: true,
      canUseInlineQuantity: false,
      canUsePrimaryAddAction: true,
    };
  }

  if (customizationSummary?.hasRequiredGroups && !customizationSummary.isSelectionComplete) {
    return {
      kind: 'open_product_info',
      reason: 'required_selection_missing',
      canOpenProductInfo: true,
      canUseInlineQuantity: false,
      canUsePrimaryAddAction: true,
    };
  }

  return {
    kind: 'direct_add',
    reason: 'ready_for_direct_add',
    canOpenProductInfo: product.source !== 'productInfo',
    canUseInlineQuantity: false,
    canUsePrimaryAddAction: true,
  };
}
