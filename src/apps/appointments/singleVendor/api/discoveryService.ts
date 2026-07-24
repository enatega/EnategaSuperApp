import apiClient from '../../../../general/api/apiClient';
import type {
  AppointmentBanner,
  AppointmentCategory,
  AppointmentMostPopularItem,
  AppointmentOrderAgainItem,
  AppointmentProvider,
  AppointmentShopType,
  PaginatedAppointmentsResponse,
} from '../../api/types';
import type {
  SingleVendorDealCard,
  SingleVendorDealsResponse,
  SingleVendorServiceCardsResponse,
} from './types';

const listParams = (limit = 10) => ({ limit, offset: 0 });

export const singleVendorDiscoveryService = {
  getStore: () =>
    apiClient.get<AppointmentProvider>(
      '/api/v1/apps/general-bookings/discovery/single-vendor/store',
      listParams(1),
    ),
  getServiceTypes: async () => {
    const response = await apiClient.get<
      PaginatedAppointmentsResponse<AppointmentShopType>
    >(
      '/api/v1/apps/general-bookings/discovery/single-vendor/service-types',
      listParams(),
    );
    return response.items;
  },
  getBanners: async () => {
    const response = await apiClient.get<
      PaginatedAppointmentsResponse<AppointmentBanner>
    >(
      '/api/v1/general-bookings/banners/mobile/single-vendor',
      listParams(),
    );
    return response.items;
  },
  getCategories: async () => {
    const response = await apiClient.get<
      PaginatedAppointmentsResponse<AppointmentCategory>
    >(
      '/api/v1/apps/general-bookings/discovery/single-vendor/categories',
      listParams(),
    );
    return response.items;
  },
  getCategoryServices: async (categoryId: string) => {
    const response = await apiClient.get<SingleVendorServiceCardsResponse>(
      `/api/v1/apps/general-bookings/discovery/single-vendor/categories/${categoryId}/services`,
      listParams(8),
    );
    return response.items;
  },
  getTopServices: async () => {
    const response = await apiClient.get<
      PaginatedAppointmentsResponse<AppointmentMostPopularItem>
    >(
      '/api/v1/apps/general-bookings/discovery/single-vendor/top-services',
      listParams(8),
    );
    return response.items;
  },
  getDeals: async (
    store: Pick<AppointmentProvider, 'storeId' | 'name' | 'logo' | 'coverImage'>,
  ): Promise<AppointmentOrderAgainItem[]> => {
    const response = await apiClient.get<SingleVendorDealsResponse>(
      '/api/v1/apps/general-bookings/deals/single-vendor',
      listParams(8),
    );
    return response.items.map((deal: SingleVendorDealCard) => ({
      productId: deal.serviceId,
      storeId: store.storeId,
      productName: deal.serviceName,
      storeName: store.name,
      productImage: deal.imageUrl,
      storeLogo: store.logo,
      storeImage: store.coverImage,
      price: deal.discountedPrice,
      deal: deal.dealName,
      dealType: deal.discountType,
      dealAmount: deal.discountValue,
    }));
  },
  getOrderAgain: async () => {
    const response = await apiClient.get<SingleVendorServiceCardsResponse>(
      '/api/v1/apps/general-bookings/discovery/single-vendor/order-again',
      listParams(8),
    );
    return response.items;
  },
};
