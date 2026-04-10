import { useEffect, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useAuthSessionQuery } from "../../../general/hooks/useAuthQueries";
import { deliveriesSocketClient, subscribeDeliveriesEvent } from "../socket/deliveriesSocket";
import type { DeliveriesServerEventMap } from "../socket/deliveriesSocket.types";

type Options = {
  enabled?: boolean;
};

type RiderLocation = {
  latitude: number;
  longitude: number;
};

type RiderLocationEventPayload = DeliveriesServerEventMap["get-rider-location"];

function asRiderLocation(value: unknown): RiderLocation | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const payload = value as RiderLocationEventPayload;

  if (
    typeof payload.latitude !== "number"
    || typeof payload.longitude !== "number"
  ) {
    return null;
  }

  return {
    latitude: payload.latitude,
    longitude: payload.longitude,
  };
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

export function useOrderRiderLocationSync(
  riderUserId?: string | null,
  initialLocation?: RiderLocation | null,
  options?: Options,
) {
  const authSessionQuery = useAuthSessionQuery();
  const token = authSessionQuery.data?.token ?? null;
  const customerUserId = authSessionQuery.data?.user?.id ?? null;
  const isEnabled = Boolean(riderUserId) && (options?.enabled ?? true);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const riderUserIdRef = useRef(riderUserId ?? null);
  const customerUserIdRef = useRef(customerUserId);
  const [riderLocation, setRiderLocation] = useState<RiderLocation | null>(
    initialLocation ?? null,
  );

  useEffect(() => {
    riderUserIdRef.current = riderUserId ?? null;
  }, [riderUserId]);

  useEffect(() => {
    customerUserIdRef.current = customerUserId;
  }, [customerUserId]);

  useEffect(() => {
    setRiderLocation(initialLocation ?? null);
  }, [initialLocation?.latitude, initialLocation?.longitude]);

  useEffect(() => {
    void deliveriesSocketClient.updateSession({ token, userId: customerUserId });
  }, [customerUserId, token]);

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

      if (previousState === "active" && nextState !== "active") {
        deliveriesSocketClient.disconnect();
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
      "get-rider-location",
      (payload) => {
        const nextLocation = asRiderLocation(payload);

        if (!nextLocation) {
          return;
        }

        const payloadRecord = payload as RiderLocationEventPayload;
        const eventRiderUserId = readString(payloadRecord.riderUserId);
        const eventCustomerUserId = readString(payloadRecord.customerUserId);
        const activeRiderUserId = riderUserIdRef.current;
        const activeCustomerUserId = customerUserIdRef.current;

        if (activeRiderUserId && eventRiderUserId && activeRiderUserId !== eventRiderUserId) {
          return;
        }

        if (
          activeCustomerUserId
          && eventCustomerUserId
          && activeCustomerUserId !== eventCustomerUserId
        ) {
          return;
        }

        setRiderLocation(nextLocation);
      },
    );
  }, [isEnabled, token]);

  return riderLocation;
}
