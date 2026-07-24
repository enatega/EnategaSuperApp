import apiClient from '../../../../general/api/apiClient';
import type {
  AppointmentBanner,
  AppointmentMostPopularItem,
  AppointmentOrderAgainItem,
  AppointmentProvider,
  PaginatedAppointmentsResponse,
} from '../../api/types';

const listParams = (limit = 8) => ({ limit, offset: 0 });

export const chainDiscoveryService = {
  getBranches: async (latitude: number, longitude: number) => {
    const response = await apiClient.get<
      PaginatedAppointmentsResponse<AppointmentProvider>
    >('/api/v1/apps/general-bookings/discovery/store-chain/branches', {
      ...listParams(),
      latitude,
      longitude,
    });

    return response.items;
  },
  getBanners: async () => {
    const response = await apiClient.get<
      PaginatedAppointmentsResponse<AppointmentBanner>
    >(
      '/api/v1/general-bookings/banners/mobile/store-chain',
      listParams(10),
    );

    return response.items;
  },
  getTopServices: async () => {
    const response = await apiClient.get<
      PaginatedAppointmentsResponse<AppointmentMostPopularItem>
    >(
      '/api/v1/apps/general-bookings/discovery/store-chain/top-services',
      listParams(),
    );

    return response.items;
  },
  getOrderAgain: async () => {
    const response = await apiClient.get<
      PaginatedAppointmentsResponse<AppointmentOrderAgainItem>
    >(
      '/api/v1/apps/general-bookings/discovery/store-chain/order-again',
      listParams(),
    );

    return response.items;
  },
};
