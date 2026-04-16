export const homeVisitsKeys = {
  all: ['homeVisits'] as const,
  discovery: () => [...homeVisitsKeys.all, 'discovery'] as const,
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
};
