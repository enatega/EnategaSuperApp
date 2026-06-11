import { useQuery } from '@tanstack/react-query';
import { ApiError } from '../api/apiClient';
import {
  introBannerService,
  type AppIntroBanner,
  type IntroBannerAppPrefix,
} from '../api/introBannerService';
import { introBannerKeys } from '../api/introBannerQueryKeys';

type Options = {
  enabled?: boolean;
};

export function useIntroBannerQuery(
  appPrefix: IntroBannerAppPrefix,
  options: Options = {},
) {
  return useQuery<AppIntroBanner[], ApiError, AppIntroBanner | null>({
    queryKey: introBannerKeys.app(appPrefix),
    queryFn: () => introBannerService.getIntroBanners(appPrefix),
    select: (banners) =>
      banners.find((banner) => banner.isActive) ?? banners[0] ?? null,
    enabled: options.enabled,
    staleTime: 0,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  });
}
