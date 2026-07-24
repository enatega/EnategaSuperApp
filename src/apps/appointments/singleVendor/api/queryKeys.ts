export const singleVendorAppointmentKeys = {
  all: ['appointments', 'singleVendor'] as const,
  home: () => [...singleVendorAppointmentKeys.all, 'home'] as const,
  store: () => [...singleVendorAppointmentKeys.home(), 'store'] as const,
  serviceTypes: () =>
    [...singleVendorAppointmentKeys.home(), 'serviceTypes'] as const,
  banners: () => [...singleVendorAppointmentKeys.home(), 'banners'] as const,
  categories: () =>
    [...singleVendorAppointmentKeys.home(), 'categories'] as const,
  categoryServices: (categoryId: string) =>
    [
      ...singleVendorAppointmentKeys.home(),
      'categoryServices',
      categoryId,
    ] as const,
  topServices: () =>
    [...singleVendorAppointmentKeys.home(), 'topServices'] as const,
  deals: () => [...singleVendorAppointmentKeys.home(), 'deals'] as const,
  orderAgain: () =>
    [...singleVendorAppointmentKeys.home(), 'orderAgain'] as const,
  favouriteServices: () =>
    [...singleVendorAppointmentKeys.all, 'favouriteServices'] as const,
};
