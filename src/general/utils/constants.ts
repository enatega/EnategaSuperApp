export const MINI_APPS = ['deliveries', 'rideSharing', 'homeVisits', 'appointments', 'developerMode'] as const;

export type MiniAppId = (typeof MINI_APPS)[number];
