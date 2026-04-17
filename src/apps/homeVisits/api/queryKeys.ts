export const homeVisitsKeys = {
  all: ['homeVisits'] as const,
  discovery: () => [...homeVisitsKeys.all, 'discovery'] as const,
  singleVendorBanners: (filters?: { limit?: number }) =>
    [...homeVisitsKeys.discovery(), 'single-vendor-banners', filters] as const,
  singleVendorNearbyServices: (filters?: {
    limit?: number;
    latitude?: number;
    longitude?: number;
  }) =>
    [...homeVisitsKeys.discovery(), 'single-vendor-nearby-services', filters] as const,
  singleVendorMostPopularServices: (filters?: { limit?: number }) =>
    [
      ...homeVisitsKeys.discovery(),
      'single-vendor-most-popular-services',
      filters,
    ] as const,
  singleVendorCategories: (filters?: { limit?: number }) =>
    [...homeVisitsKeys.discovery(), 'single-vendor-categories', filters] as const,
  singleVendorCategoryServices: (
    categoryId: string,
    offset = 0,
    limit = 10,
  ) =>
    [
      ...homeVisitsKeys.discovery(),
      'single-vendor-category-services',
      categoryId,
      offset,
      limit,
    ] as const,
  singleVendorDeals: (filters?: { limit?: number; tab?: string }) =>
    [...homeVisitsKeys.discovery(), 'single-vendor-deals', filters] as const,
  singleVendorServiceBookingScreen: (serviceId: string) =>
    [...homeVisitsKeys.discovery(), 'single-vendor-service-booking-screen', serviceId] as const,
};
