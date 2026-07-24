import { useQuery } from '@tanstack/react-query';
import { singleVendorDiscoveryService } from '../api/discoveryService';
import { singleVendorAppointmentKeys } from '../api/queryKeys';

const staleTime = 2 * 60 * 1000;

export const useSingleVendorStore = () =>
  useQuery({
    queryKey: singleVendorAppointmentKeys.store(),
    queryFn: singleVendorDiscoveryService.getStore,
    staleTime,
  });

export const useSingleVendorServiceTypes = () =>
  useQuery({
    queryKey: singleVendorAppointmentKeys.serviceTypes(),
    queryFn: singleVendorDiscoveryService.getServiceTypes,
    staleTime,
  });

export const useSingleVendorBanners = () =>
  useQuery({
    queryKey: singleVendorAppointmentKeys.banners(),
    queryFn: singleVendorDiscoveryService.getBanners,
    staleTime,
  });

export const useSingleVendorCategories = () =>
  useQuery({
    queryKey: singleVendorAppointmentKeys.categories(),
    queryFn: singleVendorDiscoveryService.getCategories,
    staleTime,
  });

export const useSingleVendorCategoryServices = (categoryId: string) =>
  useQuery({
    queryKey: singleVendorAppointmentKeys.categoryServices(categoryId),
    queryFn: () =>
      singleVendorDiscoveryService.getCategoryServices(categoryId),
    staleTime,
    enabled: Boolean(categoryId),
  });

export const useSingleVendorTopServices = () =>
  useQuery({
    queryKey: singleVendorAppointmentKeys.topServices(),
    queryFn: singleVendorDiscoveryService.getTopServices,
    staleTime,
  });

export const useSingleVendorDeals = () => {
  const storeQuery = useSingleVendorStore();
  return useQuery({
    queryKey: singleVendorAppointmentKeys.deals(),
    queryFn: () => singleVendorDiscoveryService.getDeals(storeQuery.data!),
    staleTime,
    enabled: Boolean(storeQuery.data?.storeId),
  });
};

export const useSingleVendorOrderAgain = () =>
  useQuery({
    queryKey: singleVendorAppointmentKeys.orderAgain(),
    queryFn: singleVendorDiscoveryService.getOrderAgain,
    staleTime,
  });
