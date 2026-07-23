import { create } from "zustand";

export type SelectedAppointmentCoupon = {
  code: string;
  id: string;
  name: string;
};

type AppointmentCouponState = {
  clearCoupon: () => void;
  selectedCoupon: SelectedAppointmentCoupon | null;
  setCoupon: (coupon: SelectedAppointmentCoupon) => void;
};

export const useAppointmentCouponStore = create<AppointmentCouponState>(
  (set) => ({
    clearCoupon: () => set({ selectedCoupon: null }),
    selectedCoupon: null,
    setCoupon: (coupon) => set({ selectedCoupon: coupon }),
  }),
);
