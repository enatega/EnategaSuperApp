import apiClient from '../../../../general/api/apiClient';
import type {
  AppointmentOrderAgainItem,
  PaginatedAppointmentsResponse,
} from '../../api/types';

export type SingleVendorFavouriteServicesResponse =
  PaginatedAppointmentsResponse<AppointmentOrderAgainItem>;

export const singleVendorFavouriteServicesService = {
  list: (offset = 0, limit = 20) =>
    apiClient.get<SingleVendorFavouriteServicesResponse>(
      '/api/v1/apps/general-bookings/favorite-services',
      { offset, limit },
    ),
  toggle: (serviceId: string) =>
    apiClient.post<{ message: string; isFavorite: boolean }>(
      '/api/v1/apps/general-bookings/favorite-services/toggle',
      { serviceId },
    ),
};
