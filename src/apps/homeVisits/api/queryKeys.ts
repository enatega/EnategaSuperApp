export const homeVisitsKeys = {
  all: ['homeVisits'] as const,
  supportChat: () => [...homeVisitsKeys.all, 'support-chat'] as const,
  supportChatConversations: () =>
    [...homeVisitsKeys.supportChat(), 'conversations'] as const,
  supportChatAdmins: () => [...homeVisitsKeys.supportChat(), 'admins'] as const,
  supportTickets: () => [...homeVisitsKeys.all, 'support-tickets'] as const,
  supportTicketOptions: () => [...homeVisitsKeys.all, 'support-ticket-options'] as const,
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
  singleVendorServiceBookingScreen: (serviceId: string) =>
    [...homeVisitsKeys.discovery(), 'single-vendor-service-booking-screen', serviceId] as const,
  singleVendorServiceReviews: (serviceId: string, filters?: { limit?: number }) =>
    [...homeVisitsKeys.discovery(), 'single-vendor-service-reviews', serviceId, filters] as const,
  singleVendorBookings: (filters?: { limit?: number; tab?: string }) =>
    [...homeVisitsKeys.all, 'single-vendor-bookings', filters] as const,
  singleVendorBookingDetail: (orderId: string) =>
    [...homeVisitsKeys.all, 'single-vendor-booking-detail', orderId] as const,
};
