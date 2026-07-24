import { useCallback, useState } from "react";
import { ApiError } from "../../../general/api/apiClient";
import { appointmentBookingService } from "../api/appointmentBookingService";
import type { AppointmentStoreService } from "../api/types";
import { buildAppointmentSelectionFromDetail } from "../utils/appointmentBooking";
import { useAppointmentCart } from "./useAppointmentCart";
import { useSyncAppointmentCartMutation } from "./useAppointmentCartQueries";

export const APPOINTMENT_CART_STORE_CONFLICT_CODE =
  "GENERAL_BOOKINGS_CART_STORE_CONFLICT";

type Params = {
  selectedServices: AppointmentStoreService[];
  storeId: string;
};

export function isAppointmentCartStoreConflict(error: unknown) {
  return (
    error instanceof ApiError &&
    error.status === 409 &&
    error.code === APPOINTMENT_CART_STORE_CONFLICT_CODE
  );
}

export function useAppointmentCartCommit({
  selectedServices,
  storeId,
}: Params) {
  const { cart, hydrateCart, refreshCart, selections: currentSelections } =
    useAppointmentCart();
  const syncMutation = useSyncAppointmentCartMutation();
  const [isPreparingCart, setIsPreparingCart] = useState(false);

  const commitCart = useCallback(
    async (replaceExistingStore = false) => {
      setIsPreparingCart(true);
      try {
        const details = await appointmentBookingService.getServiceDetails(
          selectedServices.map((service) => service.id),
        );
        const selections = details.map((detail) =>
          buildAppointmentSelectionFromDetail(
            detail,
            currentSelections.find(
              (selection) => selection.serviceId === detail.serviceId,
            ),
          ),
        );
        const cart = await syncMutation.mutateAsync({
          storeId,
          selections,
          replaceExistingStore,
        });

        hydrateCart(cart);
        return { cart, selections };
      } finally {
        setIsPreparingCart(false);
      }
    },
    [currentSelections, hydrateCart, selectedServices, storeId, syncMutation],
  );

  return {
    commitCart,
    isCommittingCart: isPreparingCart || syncMutation.isPending,
    restorePersistedCart: async () => {
      const persistedCart = cart ?? (await refreshCart()).data;

      if (persistedCart) {
        hydrateCart(persistedCart);
      }

      return persistedCart;
    },
  };
}
