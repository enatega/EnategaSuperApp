export const chainAppointmentKeys = {
  all: ['appointments', 'chain'] as const,
  home: () => [...chainAppointmentKeys.all, 'home'] as const,
  branches: (latitude?: number, longitude?: number) =>
    [
      ...chainAppointmentKeys.home(),
      'branches',
      latitude,
      longitude,
    ] as const,
  banners: () => [...chainAppointmentKeys.home(), 'banners'] as const,
  topServices: () => [...chainAppointmentKeys.home(), 'topServices'] as const,
  orderAgain: () => [...chainAppointmentKeys.home(), 'orderAgain'] as const,
  favourites: () => [...chainAppointmentKeys.all, 'favourites'] as const,
};
