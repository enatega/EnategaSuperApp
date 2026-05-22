import type { QueryClient } from "@tanstack/react-query";
import { homeVisitsKeys } from "../../api/queryKeys";
import type {
  HomeVisitsSingleVendorBookingDetails,
  HomeVisitsSingleVendorBookingItem,
  HomeVisitsSingleVendorBookingsApiResponse,
} from "../api/types";
import { resolveBookingStatusLabel } from "../utils/bookingStatusLabel";
import type { JobStatusUpdatedEvent } from "../../socket/homeServicesSocket.types";

const TERMINAL_BOOKING_STATUSES = new Set([
  "completed",
  "cancelled",
  "canceled",
  "failed",
  "rejected",
  "finished",
  "done",
]);

const ACTIVE_BOOKING_QUERY_KEY = homeVisitsKeys.singleVendorBookings({
  limit: 1,
  tab: "ongoing",
});

type StatusLabelTranslator = (key: string) => string;

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isBookingsResponse(
  value: unknown,
): value is HomeVisitsSingleVendorBookingsApiResponse {
  return isRecord(value) && Array.isArray(value.items);
}

export function isJobStatusUpdatedEvent(
  payload: unknown,
): payload is JobStatusUpdatedEvent {
  if (!isRecord(payload)) {
    return false;
  }

  return (
    typeof payload.jobId === "string" &&
    payload.jobId.trim().length > 0 &&
    typeof payload.jobStatus === "string" &&
    payload.jobStatus.trim().length > 0
  );
}

export function isTerminalBookingStatus(value: string | null | undefined) {
  const normalized = `${value ?? ""}`.trim().toLowerCase();
  return TERMINAL_BOOKING_STATUSES.has(normalized);
}

export function applyJobStatusUpdatedEventToCaches({
  queryClient,
  payload,
  t,
}: {
  queryClient: QueryClient;
  payload: JobStatusUpdatedEvent;
  t: StatusLabelTranslator;
}) {
  queryClient.setQueryData<HomeVisitsSingleVendorBookingDetails>(
    homeVisitsKeys.singleVendorBookingDetail(payload.jobId),
    (cached) => {
      if (!cached) {
        return cached;
      }

      return {
        ...cached,
        jobStatus: payload.jobStatus,
        status: payload.jobStatus,
        assignedWorker: {
          ...(cached.assignedWorker ?? {}),
          id: payload.workerId ?? cached.assignedWorker?.id,
        },
      };
    },
  );

  queryClient.setQueryData<HomeVisitsSingleVendorBookingItem | null>(
    ACTIVE_BOOKING_QUERY_KEY,
    (cached) => {
      if (!cached || cached.orderId !== payload.jobId) {
        return cached;
      }

      if (isTerminalBookingStatus(payload.jobStatus)) {
        return null;
      }

      return {
        ...cached,
        jobStatus: payload.jobStatus,
        status: payload.jobStatus,
        statusLabel: resolveBookingStatusLabel(
          payload.jobStatus,
          cached.statusLabel,
          t,
        ),
      };
    },
  );

  queryClient.setQueriesData(
    { queryKey: homeVisitsKeys.singleVendorBookings() },
    (cached) => {
      if (isBookingsResponse(cached)) {
        return {
          ...cached,
          items: cached.items.map((item) => {
            if (item.orderId !== payload.jobId) {
              return item;
            }

            return {
              ...item,
              jobStatus: payload.jobStatus,
              status: payload.jobStatus,
              statusLabel: resolveBookingStatusLabel(
                payload.jobStatus,
                item.statusLabel,
                t,
              ),
            };
          }),
        };
      }

      return cached;
    },
  );
}

export function reconcileJobStatusUpdatedEventWithApi({
  queryClient,
  payload,
}: {
  queryClient: QueryClient;
  payload: JobStatusUpdatedEvent;
}) {
  void queryClient.invalidateQueries({
    queryKey: homeVisitsKeys.singleVendorBookingDetail(payload.jobId),
  });
  void queryClient.invalidateQueries({
    queryKey: homeVisitsKeys.singleVendorBookings(),
  });
}
