import NetInfo from "@react-native-community/netinfo";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useTranslation } from "react-i18next";
import { useAuthSessionQuery } from "../../../../general/hooks/useAuthQueries";
import {
  homeServicesSocketClient,
  subscribeHomeServicesEvent,
} from "../../socket/homeServicesSocket";
import {
  applyJobStatusUpdatedEventToCaches,
  isJobStatusUpdatedEvent,
  reconcileJobStatusUpdatedEventWithApi,
} from "../realtime/jobStatusSync";

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
}
