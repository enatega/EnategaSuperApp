export type Coupon = {
  offeredBy: Array<{
    storeId: string;
    storeImageUrl: string | null;
    storeName: string;

  }>;
  amountLabel: string;
  badgeLabel: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED' | 'FLAT' | string;
  discountValue: number;
  maxDiscountCap: number;
  minOrderValue: number;
  isExpired: boolean;
  isActive: boolean;
  id: string;
  minOrderLabel: string;
  status: string;
  subtitle: string;
  title: string;
  validUntil: string;
};
