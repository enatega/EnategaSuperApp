import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useAuthSessionQuery } from "../../../general/hooks/useAuthQueries";
import { deliveryKeys } from "../api/queryKeys";
import type { OrderDetailsResponse } from "../api/ordersServiceTypes";
import { deliveriesSocketClient, subscribeDeliveriesEvent } from "../socket/deliveriesSocket";
import type { DeliveriesServerEventMap } from "../socket/deliveriesSocket.types";

type Options = {
  enabled?: boolean;
};

type OrderStatusUpdatedEventPayload = DeliveriesServerEventMap["order-status-updated"];

function isOrderStatusUpdatedEventPayload(
  value: unknown,
): value is OrderStatusUpdatedEventPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const payload = value as OrderStatusUpdatedEventPayload;

  return typeof payload.orderId === "string" && payload.orderId.trim().length > 0;
}

export function useOrderStatusSocketSync(orderId?: string, options?: Options) {
  const queryClient = useQueryClient();
  const authSessionQuery = useAuthSessionQuery();
  const token = authSessionQuery.data?.token ?? null;
  const userId = authSessionQuery.data?.user?.id ?? null;
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const currentOrderIdRef = useRef(orderId);
  const isEnabled = Boolean(orderId) && (options?.enabled ?? true);

  useEffect(() => {
    currentOrderIdRef.current = orderId;
  }, [orderId]);

  useEffect(() => {
    void deliveriesSocketClient.updateSession({ token, userId });
  }, [token, userId]);

  useEffect(() => {
    if (!isEnabled || !token) {
      return undefined;
    }

    deliveriesSocketClient.retain();
    void deliveriesSocketClient.connect();

    return () => {
      deliveriesSocketClient.release();
    };
  }, [isEnabled, token]);

  useEffect(() => {
    if (!isEnabled || !token) {
      return undefined;
    }

    const subscription = AppState.addEventListener("change", (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      if (
        previousState === "active"
        && nextState !== "active"
      ) {
        deliveriesSocketClient.disconnectIfIdle();
        return;
      }

      if (
        nextState === "active"
        && deliveriesSocketClient.hasActiveConsumers()
      ) {
        void deliveriesSocketClient.connect();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isEnabled, token]);

  useEffect(() => {
    if (!isEnabled || !token) {
      return undefined;
    }

    return subscribeDeliveriesEvent(
      "order-status-updated",
      (payload) => {
        console.log("[deliveries][socket] order-status-updated received", {
          activeOrderId: currentOrderIdRef.current,
          payload,
        });

        if (!isOrderStatusUpdatedEventPayload(payload)) {
          console.log("[deliveries][socket] ignored invalid order-status-updated payload");
          return;
        }

        const activeOrderId = currentOrderIdRef.current;

        if (!activeOrderId || payload.orderId !== activeOrderId) {
          console.log("[deliveries][socket] ignored order-status-updated for different order", {
            activeOrderId,
            eventOrderId: payload.orderId,
          });
          return;
        }

        console.log("[deliveries][socket] applying order-status-updated payload to order cache", {
          orderId: activeOrderId,
          status: payload.status,
          updatedAt: payload.updatedAt,
        });

        queryClient.setQueryData<OrderDetailsResponse>(
          deliveryKeys.orderDetail(activeOrderId),
          (current) => {
            if (!current) {
              return current;
            }

            const nextStatus = payload.status ?? current.status;
            const nextRider =
              payload.riderId
                ? {
                    ...(current.rider ?? {}),
                    id: payload.riderId,
                    userId: current.rider?.userId ?? payload.riderId,
                  }
                : current.rider;
            const nextOrderLogs =
              payload.status
                ? [
                    {
                      status: payload.status,
                      actor: null,
                      timestamp: payload.updatedAt ?? new Date().toISOString(),
                      message: null,
                    },
                    ...(current.orderLogs ?? []),
                  ]
                : current.orderLogs;

            return {
              ...current,
              status: nextStatus,
              rider: nextRider,
              orderLogs: nextOrderLogs,
            };
          },
        );
      },
    );
  }, [isEnabled, queryClient, token]);
}
