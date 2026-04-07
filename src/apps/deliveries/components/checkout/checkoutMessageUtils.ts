export type CheckoutMessageTarget = 'restaurant' | 'courier';

export type CheckoutMessages = Record<CheckoutMessageTarget, string>;

export const CHECKOUT_MESSAGE_MAX_LENGTH = 250;

export function clampCheckoutMessageLength(value: string) {
  return value.slice(0, CHECKOUT_MESSAGE_MAX_LENGTH);
}

export function trimCheckoutMessage(value: string) {
  return value.trim();
}

export function buildCustomerNote(messages: CheckoutMessages) {
  const restaurantMessage = trimCheckoutMessage(messages.restaurant);
  const courierMessage = trimCheckoutMessage(messages.courier);
  const noteSections = [
    restaurantMessage ? `Restaurant:\n${restaurantMessage}` : null,
    courierMessage ? `Courier:\n${courierMessage}` : null,
  ].filter(Boolean);

  return noteSections.length > 0 ? noteSections.join('\n\n') : undefined;
}

export function getCheckoutMessagePreview(value: string, fallback: string) {
  const normalizedValue = trimCheckoutMessage(value).replace(/\s+/g, ' ');

  return normalizedValue.length > 0 ? normalizedValue : fallback;
}
