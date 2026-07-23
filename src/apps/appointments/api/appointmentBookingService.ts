import apiClient from "../../../general/api/apiClient";
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
  AppointmentMobileServiceDetail,
} from "./types";

export const appointmentBookingService = {
  getServiceDetail: async (
    serviceId: string,
  ): Promise<AppointmentMobileServiceDetail> =>
    apiClient.get<AppointmentMobileServiceDetail>(
      `/api/v1/apps/general-bookings/services/mobile/${serviceId}`,
    ),

  getServiceDetails: async (
    serviceIds: string[],
  ): Promise<AppointmentMobileServiceDetail[]> =>
    apiClient.post<AppointmentMobileServiceDetail[]>(
      "/api/v1/apps/general-bookings/services/mobile/details",
      { serviceIds },
    ),

  getAvailability: async (
    payload: AppointmentBookingAvailabilityRequest,
  ): Promise<AppointmentBookingAvailabilityResponse> =>
    apiClient.post<AppointmentBookingAvailabilityResponse>(
      "/api/v1/apps/general-bookings/appointments/availability",
      payload,
    ),

  review: async (
    payload: AppointmentBookingReviewRequest,
  ): Promise<AppointmentBookingReviewResponse> =>
    apiClient.post<AppointmentBookingReviewResponse>(
      "/api/v1/apps/general-bookings/appointments/review",
      payload,
    ),

  confirm: async (
    payload: AppointmentBookingConfirmRequest,
  ): Promise<AppointmentBookingConfirmResponse> =>
    apiClient.post<AppointmentBookingConfirmResponse>(
      "/api/v1/apps/general-bookings/appointments/confirm",
      payload,
    ),

  rescheduleAppointment: async ({
    orderId,
    scheduledAt,
  }: AppointmentBookingRescheduleRequest): Promise<{
    orderId: string;
    scheduledAt: string;
    durationMinutes: number;
    status: string;
  }> =>
    apiClient.patch(
      `/api/v1/apps/general-bookings/appointments/${orderId}/reschedule`,
      { scheduledAt },
    ),

  cancelAppointment: async (
    orderId: string,
  ): Promise<AppointmentBookingCancelResponse> =>
    apiClient.patch<AppointmentBookingCancelResponse>(
      `/api/v1/apps/general-bookings/appointments/${orderId}/cancel`,
    ),

  rateAppointment: async ({
    orderId,
    ...payload
  }: AppointmentBookingRatingRequest): Promise<AppointmentBookingRatingResponse> =>
    apiClient.post<AppointmentBookingRatingResponse>(
      `/api/v1/apps/general-bookings/appointments/${orderId}/rating`,
      payload,
    ),

  releaseHold: async (holdToken: string): Promise<{ released: boolean }> =>
    apiClient.delete<{ released: boolean }>(
      `/api/v1/apps/general-bookings/appointments/holds/${holdToken}`,
    ),
};
