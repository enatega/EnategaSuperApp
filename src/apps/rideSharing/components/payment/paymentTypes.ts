export type PaymentMethodId = 'wallet' | 'cash' | 'visa';

export type PaymentMethodOption = {
  id: PaymentMethodId;
  label: string;
  value?: string;
};

export const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  { id: 'wallet', label: 'Wallet', value: 'Wallet' },
  { id: 'cash', label: 'Cash' },
  // { id: 'visa', label: 'Visa', value: '**** 9432' },
];

export function getPaymentMethodOption(paymentMethodId: PaymentMethodId) {
  return PAYMENT_METHOD_OPTIONS.find((item) => item.id === paymentMethodId) ?? PAYMENT_METHOD_OPTIONS[1];
}
