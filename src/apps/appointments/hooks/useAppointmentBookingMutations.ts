import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../../../general/api/apiClient";
import { appointmentBookingService } from "../api/appointmentBookingService";
import { appointmentKeys } from "../api/queryKeys";
import type {
  AppointmentBookingAvailabilityRequest,
  AppointmentBookingAvailabilityResponse,
  AppointmentBookingCancelResponse,
  AppointmentBookingConfirmRequest,
  AppointmentBookingConfirmResponse,
  AppointmentBookingReviewRequest,
  AppointmentBookingReviewResponse,
  AppointmentBookingRescheduleRequest,
  AppointmentBookingRatingRequest,
  AppointmentBookingRatingResponse,
} from "../api/types";

export function useAppointmentAvailabilityMutation() {
  return useMutation<
    AppointmentBookingAvailabilityResponse,
    ApiError,
    AppointmentBookingAvailabilityRequest
  >({
    mutationFn: appointmentBookingService.getAvailability,
    retry: false,
  });
}

export function useAppointmentRescheduleMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    {
      orderId: string;
      scheduledAt: string;
      durationMinutes: number;
      status: string;
    },
    ApiError,
    AppointmentBookingRescheduleRequest
  >({
    mutationFn: appointmentBookingService.rescheduleAppointment,
    onSuccess: (result) => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: appointmentKeys.bookings() }),
        queryClient.invalidateQueries({
          queryKey: appointmentKeys.scheduledBookingDetail(result.orderId),
        }),
      ]);
    },
    retry: false,
  });
}

export function useAppointmentCancelMutation() {
  const queryClient = useQueryClient();

  return useMutation<AppointmentBookingCancelResponse, ApiError, string>({
    mutationFn: appointmentBookingService.cancelAppointment,
    onSuccess: (result) => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: appointmentKeys.bookings() }),
        queryClient.invalidateQueries({
          queryKey: appointmentKeys.scheduledBookingDetail(result.orderId),
        }),
      ]);
    },
    retry: false,
  });
}

export function useAppointmentRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    AppointmentBookingRatingResponse,
    ApiError,
    AppointmentBookingRatingRequest
  >({
    mutationFn: appointmentBookingService.rateAppointment,
    onSuccess: (result) => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: appointmentKeys.bookings() }),
        queryClient.invalidateQueries({
          queryKey: appointmentKeys.scheduledBookingDetail(result.orderId),
        }),
      ]);
    },
    retry: false,
  });
}

export function useAppointmentReviewMutation() {
  return useMutation<
    AppointmentBookingReviewResponse,
    ApiError,
    AppointmentBookingReviewRequest
  >({
    mutationFn: appointmentBookingService.review,
    retry: false,
  });
}

export function useAppointmentConfirmMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    AppointmentBookingConfirmResponse,
    ApiError,
    AppointmentBookingConfirmRequest
  >({
    mutationFn: appointmentBookingService.confirm,
    onSuccess: () => {
      void Promise.all([
        queryClient.invalidateQueries({
          queryKey: appointmentKeys.bookings(),
        }),
        queryClient.invalidateQueries({
          queryKey: appointmentKeys.cart(),
        }),
      ]);
    },
    retry: false,
  });
}
