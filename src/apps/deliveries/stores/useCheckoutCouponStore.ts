import { create } from 'zustand';

type CheckoutCoupon = {
  code: string;
  id: string;
  title: string;
  discountType?: 'PERCENTAGE' | 'FIXED' | 'FLAT' | string;
  discountValue?: number;
  maxDiscountCap?: number;
  minOrderValue?: number;
};

type CheckoutCouponState = {
  clearCoupon: () => void;
  selectedCoupon: CheckoutCoupon | null;
  setCoupon: (coupon: CheckoutCoupon) => void;
};

export const useCheckoutCouponStore = create<CheckoutCouponState>((set) => ({
  selectedCoupon: null,
  setCoupon: (coupon) => set({ selectedCoupon: coupon }),
  clearCoupon: () => set({ selectedCoupon: null }),
}));
