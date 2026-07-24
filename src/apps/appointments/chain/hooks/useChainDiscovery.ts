import { useQuery } from '@tanstack/react-query';
import { chainDiscoveryService } from '../api/discoveryService';
import { chainAppointmentKeys } from '../api/queryKeys';

const staleTime = 2 * 60 * 1000;

export const useChainBranches = (
  latitude?: number,
  longitude?: number,
) => {
  const hasCoordinates =
    Number.isFinite(latitude) && Number.isFinite(longitude);

  return useQuery({
    queryKey: chainAppointmentKeys.branches(latitude, longitude),
    queryFn: () => {
      if (!hasCoordinates) {
        return Promise.resolve([]);
      }

      return chainDiscoveryService.getBranches(
        Number(latitude),
        Number(longitude),
      );
    },
    enabled: hasCoordinates,
    staleTime,
  });
};

export const useChainBanners = () =>
  useQuery({
    queryKey: chainAppointmentKeys.banners(),
    queryFn: chainDiscoveryService.getBanners,
    staleTime,
  });

export const useChainTopServices = () =>
  useQuery({
    queryKey: chainAppointmentKeys.topServices(),
    queryFn: chainDiscoveryService.getTopServices,
    staleTime,
  });

export const useChainOrderAgain = () =>
  useQuery({
    queryKey: chainAppointmentKeys.orderAgain(),
    queryFn: chainDiscoveryService.getOrderAgain,
    staleTime,
  });
