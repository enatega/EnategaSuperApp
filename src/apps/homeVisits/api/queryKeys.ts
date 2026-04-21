export const homeVisitsKeys = {
  all: ['homeVisits'] as const,
  discovery: () => [...homeVisitsKeys.all, 'discovery'] as const,
  singleVendorBanners: (filters?: { limit?: number }) =>
    [...homeVisitsKeys.discovery(), 'single-vendor-banners', filters] as const,
  singleVendorNearbyServices: (filters?: {
    limit?: number;
    latitude?: number;
    longitude?: number;
    search?: string;
    stock?: string;
    category_ids?: string;
    subcategory_id?: string;
    price_tiers?: string;
    sort_by?: string;
  }) =>
    [...homeVisitsKeys.discovery(), 'single-vendor-nearby-services', filters] as const,
  singleVendorMostPopularServices: (filters?: {
    limit?: number;
    search?: string;
    latitude?: number;
    longitude?: number;
    stock?: string;
    category_ids?: string;
    subcategory_id?: string;
    price_tiers?: string;
    sort_by?: string;
  }) =>
    [
      ...homeVisitsKeys.discovery(),
      'single-vendor-most-popular-services',
      filters,
    ] as const,
  singleVendorCategories: (filters?: {
    limit?: number;
    search?: string;
  }) =>
    [...homeVisitsKeys.discovery(), 'single-vendor-categories', filters] as const,
  singleVendorCategoryServices: (
    categoryId: string,
    filters?: {
      offset?: number;
      limit?: number;
      search?: string;
      latitude?: number;
      longitude?: number;
      stock?: string;
      category_ids?: string;
      subcategory_id?: string;
      price_tiers?: string;
      sort_by?: string;
    },
  ) =>
    [
      ...homeVisitsKeys.discovery(),
      'single-vendor-category-services',
      categoryId,
      filters,
    ] as const,
  singleVendorDeals: (filters?: {
    limit?: number;
    tab?: string;
    search?: string;
    category_ids?: string;
    subcategory_id?: string;
    price_tiers?: string;
    latitude?: number;
    longitude?: number;
    sort_by?: string;
  }) =>
    [...homeVisitsKeys.discovery(), 'single-vendor-deals', filters] as const,
  singleVendorFavoriteServices: (filters?: {
    offset?: number;
    limit?: number;
  }) =>
    [...homeVisitsKeys.discovery(), 'single-vendor-favorite-services', filters] as const,
  singleVendorServiceBookingScreen: (serviceId: string) =>
    [...homeVisitsKeys.discovery(), 'single-vendor-service-booking-screen', serviceId] as const,
  singleVendorBookings: (filters?: { limit?: number; tab?: string }) =>
    [...homeVisitsKeys.all, 'single-vendor-bookings', filters] as const,
  singleVendorBookingDetail: (orderId: string) =>
    [...homeVisitsKeys.all, 'single-vendor-booking-detail', orderId] as const,

  // Search
  search: () => [...homeVisitsKeys.all, 'search'] as const,
  recommendations: () => [...homeVisitsKeys.search(), 'recommendations'] as const,
  recentSearches: () => [...homeVisitsKeys.search(), 'recent-searches'] as const,
  serviceSearch: (keyword: string, latitude?: number, longitude?: number) =>
    [...homeVisitsKeys.search(), 'services', keyword, latitude, longitude] as const,
  serviceCenterSearch: (keyword: string, latitude?: number, longitude?: number) =>
    [...homeVisitsKeys.search(), 'service-centers', keyword, latitude, longitude] as const,
};
