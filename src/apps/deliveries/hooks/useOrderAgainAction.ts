import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import type { NavigationProp } from "@react-navigation/native";
import { showToast } from "../../../general/components/AppToast";
import type { ApiError } from "../../../general/api/apiClient";
import type { DeliveriesStackParamList } from "../navigation/types";
import type { OrderDetailsResponse } from "../api/ordersServiceTypes";
import { useCart } from "./useCart";
import { useAddCartItemMutation } from "./useCartMutations";
import { useCartStoreConflictResolution } from "./useCartStoreConflictResolution";
import { buildOrderAgainCartInputs } from "../utils/orderDetails/orderAgainUtils";
import { useTranslation } from "react-i18next";

function getApiErrorMessage(error: unknown) {
  const apiError = error as ApiError | undefined;

  return apiError?.message || undefined;
}

export function useOrderAgainAction(order?: OrderDetailsResponse | null) {
  const navigation = useNavigation<NavigationProp<DeliveriesStackParamList>>();
  const queryClient = useQueryClient();
  const { t } = useTranslation("deliveries");
  const cartQuery = useCart();
  const addCartItemMutation = useAddCartItemMutation();
  const conflictResolution = useCartStoreConflictResolution();
  const [isResolvingOrderAgain, setIsResolvingOrderAgain] = useState(false);

  const isSubmitting = useMemo(
    () => isResolvingOrderAgain || addCartItemMutation.isPending || conflictResolution.isResolving,
    [addCartItemMutation.isPending, conflictResolution.isResolving, isResolvingOrderAgain],
  );

  const handleOrderAgain = useCallback(async () => {
    if (isSubmitting || !order) {
      return;
    }

    setIsResolvingOrderAgain(true);

    try {
      const currentCartStoreId = cartQuery.data?.storeId ?? null;

      if (currentCartStoreId && currentCartStoreId !== order.store.id) {
        const shouldReplaceCart = await conflictResolution.requestResolution({
          incomingStoreName: order.store.name,
        });

        if (!shouldReplaceCart) {
          return;
        }
      }

      const cartInputs = await buildOrderAgainCartInputs(queryClient, order);
      let hasAddedAtLeastOneItem = false;
      const warningMessages: string[] = [];

      for (const cartInput of cartInputs) {
        const response = await addCartItemMutation.mutateAsync(cartInput);
        hasAddedAtLeastOneItem = hasAddedAtLeastOneItem || !response.isEmpty;
        warningMessages.push(...(response.message ?? []));
      }

      if (!hasAddedAtLeastOneItem) {
        showToast.error(
          t("order_again_error_title"),
          t("order_again_error_message"),
        );
        return;
      }

      if (warningMessages.length > 0) {
        showToast.info(
          t("order_again_partial_title"),
          warningMessages[0],
        );
      }

      navigation.navigate("Cart");
    } catch (error) {
      showToast.error(
        t("order_again_error_title"),
        getApiErrorMessage(error) ?? t("order_again_error_message"),
      );
    } finally {
      setIsResolvingOrderAgain(false);
    }
  }, [
    addCartItemMutation,
    cartQuery.data?.storeId,
    conflictResolution,
    isSubmitting,
    navigation,
    order,
    queryClient,
    t,
  ]);

  return {
    conflictResolution,
    handleOrderAgain,
    isSubmitting,
  };
}
