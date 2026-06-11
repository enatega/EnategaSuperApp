import type { IntroBannerAppPrefix } from './introBannerService';

export const introBannerKeys = {
  all: ['intro-banner'] as const,
  app: (appPrefix: IntroBannerAppPrefix) =>
    [...introBannerKeys.all, appPrefix] as const,
};
