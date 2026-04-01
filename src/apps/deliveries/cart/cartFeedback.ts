import type { TFunction } from 'i18next';
import type { ApiError } from '../../../general/api/apiClient';
import type { CartActionDecisionKind } from './cartActionRules';

export type CartMutationFeedbackKind = 'add' | 'update' | 'remove' | 'clear';

export type CartFeedback = {
  message: string;
  title: string;
};

function normalizeMessage(message?: string | null) {
  return message?.trim().toLowerCase() ?? '';
}

export function getCartActionBlockedFeedback(
  t: TFunction<'deliveries'>,
  kind: CartActionDecisionKind,
): CartFeedback | null {
  if (kind === 'await_customization_context') {
    return {
      title: t('cart_action_loading_options_title'),
      message: t('cart_action_loading_options_message'),
    };
  }

  if (kind === 'open_product_info') {
    return {
      title: t('cart_action_customization_required_title'),
      message: t('cart_action_customization_required_message'),
    };
  }

  return null;
}

export function getCartMutationErrorFeedback(
  t: TFunction<'deliveries'>,
  kind: CartMutationFeedbackKind,
  error: unknown,
): CartFeedback {
  const message =
    error instanceof Error && error.message.trim().length > 0
      ? error.message
      : '';
  const normalizedMessage = normalizeMessage(message);
  const apiError = error as ApiError | undefined;

  if (
    normalizedMessage.includes('out of stock') ||
    normalizedMessage.includes('stock is not available')
  ) {
    return {
      title: t('cart_action_out_of_stock_title'),
      message: t('cart_action_out_of_stock_message'),
    };
  }

  if (
    normalizedMessage.includes('required') ||
    normalizedMessage.includes('customization') ||
    normalizedMessage.includes('option')
  ) {
    return {
      title: t('cart_action_customization_required_title'),
      message: t('cart_action_customization_required_message'),
    };
  }

  if (
    apiError?.code === 'NETWORK_ERROR' ||
    normalizedMessage.includes('network error')
  ) {
    return {
      title: t('cart_network_error_title'),
      message: t('cart_network_error_message'),
    };
  }

  if (kind === 'update') {
    return {
      title: t('cart_update_error_title'),
      message: message || t('cart_update_error_message'),
    };
  }

  if (kind === 'remove') {
    return {
      title: t('cart_remove_error_title'),
      message: message || t('cart_remove_error_message'),
    };
  }

  if (kind === 'clear') {
    return {
      title: t('cart_clear_error_title'),
      message: message || t('cart_clear_error_message'),
    };
  }

  return {
    title: t('cart_add_error_title'),
    message: message || t('cart_add_error_message'),
  };
}

export function getCartMutationSuccessFeedback(
  t: TFunction<'deliveries'>,
  kind: CartMutationFeedbackKind,
  params?: Record<string, string | number>,
): CartFeedback | null {
  if (kind === 'add') {
    return {
      title: t('cart_add_success_title'),
      message: t('cart_add_success_message', params),
    };
  }

  if (kind === 'remove') {
    return {
      title: t('cart_remove_success_title'),
      message: t('cart_remove_success_message'),
    };
  }

  return null;
}
