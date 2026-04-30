import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
  AppState,
  type AppStateStatus,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { homeVisitsKeys } from "../../api/queryKeys";
import { useAuthSessionQuery } from "../../../../general/hooks/useAuthQueries";
import { showToast } from "../../../../general/components/AppToast";
import { useTheme } from "../../../../general/theme/theme";
import {
  homeServicesSocketClient,
  subscribeHomeServicesEvent,
} from "../../socket/homeServicesSocket";
import type { JobStatusUpdatedEvent } from "../../socket/homeServicesSocket.types";
import BookingReviewsModal from "../components/Reviews/BookingReviewsModal";
import {
  DEFAULT_BOOKING_REVIEW_SUMMARY,
  getDefaultBookingReviews,
} from "../constants/reviewsMock";
import useSingleVendorBookingDetails from "../hooks/useSingleVendorBookingDetails";
import type {
  HomeVisitsSingleVendorBookingDetails,
  HomeVisitsSingleVendorBookingItem,
  HomeVisitsSingleVendorBookingServiceItem,
} from "../api/types";
import type { HomeVisitsSingleVendorNavigationParamList } from "../navigation/types";
import { resolveBookingStatusLabel } from "../utils/bookingStatusLabel";
import BookingDetailsActionsSection from "../components/BookingDetails/BookingDetailsActionsSection";
import BookingDetailsEventsFeed from "../components/BookingDetails/BookingDetailsEventsFeed";
import BookingDetailsHero from "../components/BookingDetails/BookingDetailsHero";
import BookingDetailsServicesSection from "../components/BookingDetails/BookingDetailsServicesSection";
import BookingDetailsSummarySection from "../components/BookingDetails/BookingDetailsSummarySection";
import BookingDetailsTextSection from "../components/BookingDetails/BookingDetailsTextSection";
import type { BookingDetailsLiveEvent } from "../components/BookingDetails/types";

type Props = NativeStackScreenProps<
  HomeVisitsSingleVendorNavigationParamList,
  "SingleVendorBookingDetails"
>;

const HERO_FALLBACK_IMAGE = "https://placehold.co/900x500/png";
const MAX_LIVE_EVENTS = 10;
const ACTIVE_BOOKING_QUERY_KEY = homeVisitsKeys.singleVendorBookings({
  limit: 1,
  tab: "ongoing",
});
const TERMINAL_BOOKING_STATUSES = new Set([
  "completed",
  "cancelled",
  "canceled",
  "failed",
  "rejected",
  "finished",
  "done",
]);

function isTerminalBookingStatus(value: string | null | undefined) {
  const normalized = `${value ?? ""}`.trim().toLowerCase();
  return TERMINAL_BOOKING_STATUSES.has(normalized);
}

export default function BookingDetailsScreen({ navigation, route }: Props) {
  const { t } = useTranslation("homeVisits");
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { orderId } = route.params;
  const sessionQuery = useAuthSessionQuery();
  const token = sessionQuery.data?.token ?? null;
  const userId = sessionQuery.data?.user?.id ?? null;
  const [isReviewsVisible, setIsReviewsVisible] = React.useState(false);
  const { data, isLoading } = useSingleVendorBookingDetails({ orderId });
  const appStateRef = React.useRef<AppStateStatus>(AppState.currentState);
  const currentOrderIdRef = React.useRef(orderId);
  const lastApiEventKeyRef = React.useRef<string | null>(null);
  const reviewSummary = DEFAULT_BOOKING_REVIEW_SUMMARY;
  const defaultReviews = React.useMemo(() => getDefaultBookingReviews(t), [t]);

  const isCancelled = `${data?.status ?? ""}`.toLowerCase() === "cancelled";
  const statusLabel = resolveBookingStatusLabel(
    data?.jobStatus,
    data?.statusLabel,
    t,
  );
  const scheduledLabel = formatScheduleDate(
    data?.scheduledAt ?? data?.orderedAt,
  );
  const durationLabel = resolveDurationLabel(
    data?.durationLabel,
    t("single_vendor_booking_default_duration"),
    t,
  );
  const services = data?.services ?? [];
  const totalAmount = formatAmount(
    data?.summary?.subtotal ?? data?.summary?.totalAmount,
  );
  const heroImage =
    data?.categoryImages?.[0]?.imageUrl ??
    data?.image ??
    services[0]?.image ??
    data?.store?.image ??
    HERO_FALLBACK_IMAGE;
  const cancellationPolicy =
    data?.cancellationPolicy ?? t("single_vendor_booking_cancellation_body");
  const scheduledAt = data?.scheduledAt ?? data?.orderedAt;
  const summaryStatusMessage = data?.statusMessage ?? durationLabel;
  const reviewLabel = t("single_vendor_reviews_summary_label", {
    count:
      reviewSummary.distribution.find((item) => item.rating === 5)?.count ?? 0,
    rating: reviewSummary.averageRating.toFixed(1),
  });

  const resolveDuration = React.useCallback(
    (label: string | null | undefined, fallback: string) =>
      resolveDurationLabel(label, fallback, t),
    [t],
  );

  React.useEffect(() => {
    currentOrderIdRef.current = orderId;
  }, [orderId]);

  React.useEffect(() => {
    void homeServicesSocketClient.updateSession({ token, userId });
  }, [token, userId]);

  React.useEffect(() => {
    if (!token) {
      return undefined;
    }

    homeServicesSocketClient.retain();
    void homeServicesSocketClient.connect();

    return () => {
      homeServicesSocketClient.release();
    };
  }, [token]);

  React.useEffect(() => {
    if (!token) {
      return undefined;
    }

    const subscription = AppState.addEventListener("change", (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;

      if (previousState === "active" && nextState !== "active") {
        homeServicesSocketClient.disconnectIfIdle();
        return;
      }

      if (
        nextState === "active" &&
        homeServicesSocketClient.hasActiveConsumers()
      ) {
        void homeServicesSocketClient.connect();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [token]);

  React.useEffect(() => {
    if (!token) {
      return undefined;
    }

    return subscribeHomeServicesEvent("job-status-updated", (payload) => {
      console.log(
        "[home-services][booking-details] event received: job-status-updated",
        payload,
      );

      if (!isJobStatusUpdatedEvent(payload)) {
        console.warn(
          "[home-services][booking-details] ignored invalid job-status-updated payload",
          payload,
        );
        return;
      }

      const activeOrderId = currentOrderIdRef.current;

      if (!activeOrderId || payload.jobId !== activeOrderId) {
        console.log(
          "[home-services][booking-details] ignored job-status-updated for different job",
          {
            activeOrderId,
            eventJobId: payload.jobId,
          },
        );
        return;
      }

      console.log(
        "[home-services][booking-details] applying job status update to UI/cache",
        {
          orderId: payload.jobId,
          previousJobStatus: payload.previousJobStatus,
          jobStatus: payload.jobStatus,
          workerId: payload.workerId,
          message: payload.message,
        },
      );

      queryClient.setQueryData<HomeVisitsSingleVendorBookingDetails>(
        homeVisitsKeys.singleVendorBookingDetail(activeOrderId),
        (cached) => {
          if (!cached) {
            console.log(
              "[home-services][booking-details] cache miss for booking detail",
              {
                orderId: activeOrderId,
              },
            );
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
          if (!cached || cached.orderId !== activeOrderId) {
            return cached;
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

      if (isTerminalBookingStatus(payload.jobStatus)) {
        queryClient.setQueryData<{ orderId: string } | null>(
          ACTIVE_BOOKING_QUERY_KEY,
          (cached) => {
            if (!cached || cached.orderId !== activeOrderId) {
              return cached;
            }

            return null;
          },
        );
      }
    });
  }, [queryClient, token]);

  React.useEffect(() => {
    if (!data) {
      return;
    }

    const apiEventKey = `${data.orderId}|${data.jobStatus ?? data.status ?? ""}`;

    if (lastApiEventKeyRef.current === apiEventKey) {
      return;
    }

    lastApiEventKeyRef.current = apiEventKey;

    if (isTerminalBookingStatus(data.jobStatus) || isTerminalBookingStatus(data.status)) {
      queryClient.setQueryData<{ orderId: string } | null>(
        ACTIVE_BOOKING_QUERY_KEY,
        (cached) => {
          if (!cached || cached.orderId !== data.orderId) {
            return cached;
          }

          return null;
        },
      );
      return;
    }

    queryClient.setQueryData<HomeVisitsSingleVendorBookingItem | null>(
      ACTIVE_BOOKING_QUERY_KEY,
      (cached) => {
        if (!cached || cached.orderId !== data.orderId) {
          return cached;
        }

        return {
          ...cached,
          jobStatus: data.jobStatus ?? cached.jobStatus,
          status: data.status ?? cached.status,
          statusLabel: resolveBookingStatusLabel(
            data.jobStatus ?? data.status,
            data.statusLabel ?? cached.statusLabel,
            t,
          ),
        };
      },
    );
  }, [data, queryClient, t]);

  const handleAddToCalendar = React.useCallback(async () => {
    try {
      const targetDate = scheduledAt ? new Date(scheduledAt) : new Date();
      const safeDate = Number.isNaN(targetDate.getTime())
        ? new Date()
        : targetDate;

      if (Platform.OS === "ios") {
        const secondsSinceAppleEpoch = Math.floor(
          safeDate.getTime() / 1000 - 978307200,
        );
        await Linking.openURL(`calshow:${secondsSinceAppleEpoch}`);
        return;
      }

      if (Platform.OS === "android") {
        await Linking.openURL(
          `content://com.android.calendar/time/${safeDate.getTime()}`,
        );
        return;
      }

      await Linking.openURL(
        `https://calendar.google.com/calendar/u/0/r/day/${safeDate.getFullYear()}/${safeDate.getMonth() + 1}/${safeDate.getDate()}`,
      );
    } catch {
      showToast.error(t("single_vendor_booking_calendar_open_error"));
    }
  }, [scheduledAt, t]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <BookingDetailsHero
          heroImage={heroImage}
          onBack={() => navigation.goBack()}
          onClose={() => navigation.goBack()}
          topInset={insets.top}
        />

        <View style={styles.content}>
          <BookingDetailsSummarySection
            isCancelled={isCancelled}
            onOpenReviews={() => setIsReviewsVisible(true)}
            reviewLabel={reviewLabel}
            scheduledLabel={scheduledLabel}
            statusLabel={statusLabel}
            statusMessage={summaryStatusMessage}
          />

          <BookingDetailsActionsSection
            onAddToCalendar={() => {
              void handleAddToCalendar();
            }}
            onManageAppointment={() => {
              navigation.navigate("SingleVendorManageAppointment", { orderId });
            }}
            onTrackWorker={() => {
              navigation.navigate("SingleVendorTrackWorker", {
                orderId,
                source: "booking_details",
              });
            }}
          />

          <BookingDetailsServicesSection
            formatAmount={formatAmount}
            isLoading={isLoading}
            resolveDurationLabel={resolveDuration}
            resolveServiceTotalPrice={resolveServiceTotalPrice}
            services={services}
            totalAmount={totalAmount}
          />

          {data?.customerNote ? (
            <BookingDetailsTextSection
              primaryText={data.customerNote}
              secondaryText={null}
              title={t("single_vendor_booking_customer_note_title")}
            />
          ) : null}

          {data?.addressLabel || data?.address ? (
            <BookingDetailsTextSection
              primaryText={
                data?.addressLabel ?? t("single_vendor_booking_address_title")
              }
              primaryWeight="semiBold"
              secondaryText={data?.address}
              title={t("single_vendor_booking_address_title")}
            />
          ) : null}

          <BookingDetailsTextSection
            primaryText={null}
            secondaryText={cancellationPolicy}
            title={t("single_vendor_booking_cancellation_title")}
          />
        </View>
      </ScrollView>

      <BookingReviewsModal
        onClose={() => setIsReviewsVisible(false)}
        reviews={defaultReviews}
        summary={reviewSummary}
        visible={isReviewsVisible}
      />
    </View>
  );
}

function isJobStatusUpdatedEvent(
  value: unknown,
): value is JobStatusUpdatedEvent {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const payload = value as JobStatusUpdatedEvent;

  return (
    typeof payload.jobId === "string" &&
    payload.jobId.trim().length > 0 &&
    typeof payload.jobStatus === "string" &&
    payload.jobStatus.trim().length > 0
  );
}

function resolveDurationLabel(
  label: string | null | undefined,
  fallback: string,
  t: (key: string) => string,
) {
  if (!label) {
    return fallback;
  }

  const normalized = label.trim().toLowerCase();

  if (normalized === "job") {
    return t("single_vendor_booking_duration_job");
  }

  if (normalized === "service") {
    return t("single_vendor_booking_duration_service");
  }

  return label;
}

function formatScheduleDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatEventTime(value?: string | null) {
  if (!value) {
    return "--:--";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function formatAmount(value?: number | string | null) {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseFloat(value)
        : Number.NaN;

  if (!Number.isFinite(numericValue)) {
    return "$-";
  }

  return `$${numericValue.toFixed(2)}`;
}

function resolveServiceTotalPrice(
  service: HomeVisitsSingleVendorBookingServiceItem,
) {
  const totalPrice =
    typeof service.totalPrice === "number"
      ? service.totalPrice
      : typeof service.totalPrice === "string"
        ? Number.parseFloat(service.totalPrice)
        : Number.NaN;

  if (Number.isFinite(totalPrice)) {
    return totalPrice;
  }

  const unitPrice =
    typeof service.unitPrice === "number"
      ? service.unitPrice
      : typeof service.unitPrice === "string"
        ? Number.parseFloat(service.unitPrice)
        : Number.NaN;
  const quantity = service.quantity ?? 1;

  if (Number.isFinite(unitPrice) && Number.isFinite(quantity)) {
    return unitPrice * quantity;
  }

  return null;
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  screen: {
    flex: 1,
  },
});
