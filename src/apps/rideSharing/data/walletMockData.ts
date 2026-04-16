import type { Transaction, PaymentCard, WalletBalance } from '../types/wallet';
import { getRideSharingCurrencyLabel } from '../../../general/stores/useAppConfigStore';

export const MOCK_BALANCE: WalletBalance = {
  amount: 52.49,
  currency: getRideSharingCurrencyLabel(),
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'txn_1',
    type: 'topup',
    title: 'Wallet Top up',
    date: 'Oct 5. 4:12 PM',
    amount: 120.0,
    isCredit: true,
  },
  {
    id: 'txn_2',
    type: 'ride',
    title: 'Ride',
    date: 'Oct 5. 4:12 PM',
    amount: 48.75,
    isCredit: false,
  },
  {
    id: 'txn_3',
    type: 'women_ride',
    title: 'Women ride',
    date: 'Oct 1. 1:42 AM',
    amount: 62.4,
    isCredit: false,
  },
  {
    id: 'txn_4',
    type: 'ride',
    title: 'Ride',
    date: 'Sep 24. 8:19 PM',
    amount: 53.2,
    isCredit: false,
  },
  {
    id: 'txn_5',
    type: 'topup',
    title: 'Wallet Top up',
    date: 'Oct 5. 4:12 PM',
    amount: 120.0,
    isCredit: true,
  },
  {
    id: 'txn_6',
    type: 'premium_ride',
    title: 'Premium ride',
    date: 'Sep 13. 2:02 PM',
    amount: 59.99,
    isCredit: false,
  },
  {
    id: 'txn_7',
    type: 'courier',
    title: 'Courier',
    date: 'Sep 7. 11:43 PM',
    amount: 152.37,
    isCredit: false,
  },
];

export const MOCK_PAYMENT_CARDS: PaymentCard[] = [
  {
    id: 'card_1',
    brand: 'mastercard',
    lastFour: '1412',
    expiryDate: '12/26',
  },
  {
    id: 'card_2',
    brand: 'visa',
    lastFour: '9432',
    expiryDate: '08/27',
  },
];

export const QUICK_AMOUNTS = [10, 20, 40, 80];
