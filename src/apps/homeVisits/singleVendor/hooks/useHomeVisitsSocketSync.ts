import NetInfo from "@react-native-community/netinfo";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useTranslation } from "react-i18next";
import { useAuthSessionQuery } from "../../../../general/hooks/useAuthQueries";
import { homeVisitsKeys } from "../../api/queryKeys";
import {
  homeServicesSocketClient,
  subscribeHomeServicesEvent,
} from "../../socket/homeServicesSocket";
import type { WorkerLocationEvent, ContractUpdatedEvent } from "../../socket/homeServicesSocket.types";
import {
  applyJobStatusUpdatedEventToCaches,
  isJobStatusUpdatedEvent,
  reconcileJobStatusUpdatedEventWithApi,
} from "../realtime/jobStatusSync";
import type {
  HomeVisitsSingleVendorContractDetails,
  HomeVisitsSingleVendorBookingDetails,
  HomeVisitsSingleVendorContractsApiResponse,
} from "../api/types";
import { isWorkerLocationEvent } from "../utils/trackWorkerLocation";

export default function useHomeVisitsSocketSync() {
  const { t } = useTranslation("homeVisits");
  const queryClient = useQueryClient();
  const sessionQuery = useAuthSessionQuery();
  const token = sessionQuery.data?.token ?? null;
  const userId = sessionQuery.data?.user?.id ?? null;
  const isAuthenticated = Boolean(token && userId);

  React.useEffect(() => {
    void homeServicesSocketClient.updateSession({ token, userId });
  }, [token, userId]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      homeServicesSocketClient.disconnect();
      return undefined;
    }

    homeServicesSocketClient.retain();
    void homeServicesSocketClient.connect();

    return () => {
      homeServicesSocketClient.release();
    };
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const appStateRef = { current: AppState.currentState as AppStateStatus };
    const appStateSubscription = AppState.addEventListener("change", (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      if (previousState === "active" && nextState !== "active") {
        homeServicesSocketClient.disconnectIfIdle();
        return;
      }

      if (nextState === "active" && homeServicesSocketClient.hasActiveConsumers()) {
        void homeServicesSocketClient.connect();
      }
    });

    const netInfoSubscription = NetInfo.addEventListener((state) => {
      const isReachable = state.isConnected && state.isInternetReachable !== false;
      if (!isReachable || appStateRef.current !== "active") {
        return;
      }

      if (homeServicesSocketClient.hasActiveConsumers()) {
        void homeServicesSocketClient.connect();
      }
    });

    return () => {
      appStateSubscription.remove();
      netInfoSubscription();
    };
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    return subscribeHomeServicesEvent("job-status-updated", (payload) => {
      if (!isJobStatusUpdatedEvent(payload)) {
        return;
      }

      applyJobStatusUpdatedEventToCaches({
        queryClient,
        payload,
        t,
      });

      reconcileJobStatusUpdatedEventWithApi({
        queryClient,
        payload,
      });
    });
  }, [isAuthenticated, queryClient, t]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    return subscribeHomeServicesEvent("get-worker-location", (payload: WorkerLocationEvent) => {
      if (!isWorkerLocationEvent(payload) || !payload.orderId) {
        return;
      }

      queryClient.setQueryData<HomeVisitsSingleVendorBookingDetails>(
        homeVisitsKeys.singleVendorBookingDetail(payload.orderId),
        (cached) => {
          if (!cached) {
            return cached;
          }

          return {
            ...cached,
            workerLocation: {
              latitude: payload.latitude,
              longitude: payload.longitude,
            },
            currentLocation: {
              latitude: payload.latitude,
              longitude: payload.longitude,
            },
            routePath: payload.routePath ?? (cached.routePath as typeof payload.routePath),
            distanceKm:
              payload.distanceKm ?? (cached.distanceKm as number | null | undefined),
            estimatedMinutes:
              payload.estimatedMinutes
              ?? (cached.estimatedMinutes as number | null | undefined),
            destinationLatitude:
              payload.destinationLatitude
              ?? (cached.destinationLatitude as number | null | undefined),
            destinationLongitude:
              payload.destinationLongitude
              ?? (cached.destinationLongitude as number | null | undefined),
          };
        },
      );
    });
  }, [isAuthenticated, queryClient]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    return subscribeHomeServicesEvent("contract-updated", (payload: ContractUpdatedEvent) => {
      const contract = payload?.contract;
      if (!contract?.contractId) {
        return;
      }

      queryClient.setQueryData<HomeVisitsSingleVendorContractDetails>(
        homeVisitsKeys.singleVendorContractDetail(contract.contractId),
        contract,
      );

      queryClient.setQueriesData<HomeVisitsSingleVendorContractsApiResponse>(
        { queryKey: homeVisitsKeys.singleVendorContractsBase() },
        (cached) => {
          if (!cached) {
            return cached;
          }

          return {
            ...cached,
            items: cached.items.map((item) =>
              item.contractId === contract.contractId ? { ...item, ...contract } : item,
            ),
          };
        },
      );
    });
  }, [isAuthenticated, queryClient]);
}
