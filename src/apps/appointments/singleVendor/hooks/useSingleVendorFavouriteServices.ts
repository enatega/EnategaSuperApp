import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../../../../general/api/apiClient';
import { singleVendorAppointmentKeys } from '../api/queryKeys';
import {
  singleVendorFavouriteServicesService,
  type SingleVendorFavouriteServicesResponse,
} from '../api/favouriteServicesService';

export function useSingleVendorFavouriteServices() {
  return useInfiniteQuery<SingleVendorFavouriteServicesResponse, ApiError>({
    queryKey: singleVendorAppointmentKeys.favouriteServices(),
    queryFn: ({ pageParam = 0 }) =>
      singleVendorFavouriteServicesService.list(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (page) => (page.isEnd ? undefined : page.nextOffset),
    staleTime: 2 * 60 * 1000,
  });
}

export function useToggleSingleVendorFavouriteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: singleVendorFavouriteServicesService.toggle,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: singleVendorAppointmentKeys.favouriteServices(),
        }),
        queryClient.invalidateQueries({
          queryKey: singleVendorAppointmentKeys.home(),
        }),
      ]);
    },
  });
}
