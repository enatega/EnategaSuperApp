export type TransactionType = 'topup' | 'ride' | 'women_ride' | 'premium_ride' | 'courier';

export type TransactionFilter = 'all' | 'money_in' | 'money_out';

export type Transaction = {
  id: string;
  type: TransactionType;
  title: string;
  date: string;
  amount: number;
  isCredit: boolean;
};

export type PaymentCardBrand = 'visa' | 'mastercard';

export type PaymentCard = {
  id: string;
  brand: PaymentCardBrand;
  lastFour: string;
  expiryDate: string;
};

export type WalletBalance = {
  amount: number;
  currency: string;
};
