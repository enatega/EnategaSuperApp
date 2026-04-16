import { getDeliveriesCurrencyLabel } from '../../../../general/stores/useAppConfigStore';

export type WalletTransaction = {
  id: string;
  iconType: 'cashback' | 'booking' | 'refund';
  title: string;
  subtitle: string;
  time: string;
};

export type SavedCard = {
  id: string;
  brand: 'visa' | 'mastercard';
  holderName: string;
  lastFour: string;
  expiryDate: string;
};

export const MOCK_WALLET_BALANCE = 0;

export const MOCK_SAVED_CARDS: SavedCard[] = [];

export const MOCK_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'txn_1',
    iconType: 'cashback',
    title: `+${getDeliveriesCurrencyLabel()} 30 cashback for your booking`,
    subtitle: 'Refund processed for transaction #4531',
    time: '9:15 AM',
  },
  {
    id: 'txn_2',
    iconType: 'booking',
    title: `Booked Fast food service for ${getDeliveriesCurrencyLabel()} 120`,
    subtitle: 'Earned from service booking #4530',
    time: 'Yesterday',
  },
  {
    id: 'txn_3',
    iconType: 'refund',
    title: `-${getDeliveriesCurrencyLabel()} 15.00 refunded for your order`,
    subtitle: 'Refund processed for transaction #4529',
    time: '2 days ago',
  },
  {
    id: 'txn_4',
    iconType: 'booking',
    title: `Booked Fast food service for ${getDeliveriesCurrencyLabel()} 120`,
    subtitle: 'Earned from service booking #4530',
    time: '1 day ago',
  },
];
