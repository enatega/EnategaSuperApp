import { useEffect, useMemo } from "react";
import { formatDurationMinutes } from "../components/details/detailHelpers";
import { useAppointmentCartStore } from "../stores/useAppointmentCartStore";
import { useAppointmentCartQuery } from "./useAppointmentCartQueries";

export function useAppointmentCart() {
  const items = useAppointmentCartStore((state) => state.items);
  const hasLocalDraft = useAppointmentCartStore((state) => state.hasLocalDraft);
  const reviewDraft = useAppointmentCartStore((state) => state.reviewDraft);
  const selections = useAppointmentCartStore((state) => state.selections);
  const storeId = useAppointmentCartStore((state) => state.storeId);
  const storeTitle = useAppointmentCartStore((state) => state.storeTitle);
  const clearCart = useAppointmentCartStore((state) => state.clearCart);
  const clearReviewDraft = useAppointmentCartStore(
    (state) => state.clearReviewDraft,
  );
  const hydrateCart = useAppointmentCartStore((state) => state.hydrateCart);
  const hasService = useAppointmentCartStore((state) => state.hasService);
  const removeService = useAppointmentCartStore((state) => state.removeService);
  const replaceItems = useAppointmentCartStore((state) => state.replaceItems);
  const setReviewDraft = useAppointmentCartStore(
    (state) => state.setReviewDraft,
  );
  const setStoreContext = useAppointmentCartStore(
    (state) => state.setStoreContext,
  );
  const toggleService = useAppointmentCartStore((state) => state.toggleService);
  const cartQuery = useAppointmentCartQuery();

  useEffect(() => {
    const cart = cartQuery.data;

    if (!cart || hasLocalDraft) {
      return;
    }

    if (cart.isEmpty && storeId) {
      return;
    }

    if (storeId && cart.storeId && storeId !== cart.storeId) {
      return;
    }

    hydrateCart(cart);
  }, [cartQuery.data, hasLocalDraft, hydrateCart, storeId]);

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, service) =>
          sum + (typeof service.price === "number" ? service.price : 0),
        0,
      ),
    [items],
  );
  const originalTotalPrice = useMemo(
    () =>
      items.reduce(
        (sum, service) =>
          sum +
          (typeof service.originalPrice === "number"
            ? service.originalPrice
            : typeof service.price === "number"
              ? service.price
              : 0),
        0,
      ),
    [items],
  );

  const totalDurationMinutes = useMemo(
    () =>
      items.reduce(
        (sum, service) =>
          sum +
          (typeof service.estimatedDurationMinutes === "number"
            ? service.estimatedDurationMinutes
            : 0),
        0,
      ),
    [items],
  );

  const totalDurationLabel = useMemo(
    () => formatDurationMinutes(totalDurationMinutes),
    [totalDurationMinutes],
  );

  return {
    clearCart,
    clearReviewDraft,
    cart: cartQuery.data,
    cartError: cartQuery.error,
    hydrateCart,
    isCartLoading: cartQuery.isPending,
    hasSelection: items.length > 0,
    hasService,
    items,
    removeService,
    replaceItems,
    reviewDraft,
    refreshCart: cartQuery.refetch,
    selections,
    setReviewDraft,
    setStoreContext,
    storeId,
    storeTitle,
    toggleService,
    originalTotalPrice,
    totalDurationLabel,
    totalDurationMinutes,
    totalPrice,
  };
}
