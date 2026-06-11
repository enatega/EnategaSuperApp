import apiClient from './apiClient';

export type IntroBannerAppPrefix = 'deliveries';

type IntroBannerResponseItem = {
  id?: string;
  intro_banner_url?: string | null;
  media_type?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type AppIntroBanner = {
  id: string;
  mediaType: string | null;
  mediaUri: string;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeIntroBanner(
  value: IntroBannerResponseItem,
  index: number,
): AppIntroBanner | null {
  const mediaUri = value.intro_banner_url?.trim();

  if (!mediaUri) {
    return null;
  }

  return {
    id: value.id ?? `intro-banner-${index}`,
    mediaType: value.media_type ?? null,
    mediaUri,
    isActive: value.is_active ?? false,
    createdAt: value.created_at ?? null,
    updatedAt: value.updated_at ?? null,
  };
}

function normalizeIntroBannerResponse(payload: unknown): AppIntroBanner[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map((item, index) =>
      isRecord(item)
        ? normalizeIntroBanner(item as IntroBannerResponseItem, index)
        : null,
    )
    .filter((item): item is AppIntroBanner => item !== null);
}

export const introBannerService = {
  async getIntroBanners(appPrefix: IntroBannerAppPrefix) {
    const response = await apiClient.get<unknown>(
      `/api/v1/apps/${appPrefix}/intro-banner`,
      undefined,
      { skipAuth: true },
    );

    return normalizeIntroBannerResponse(response);
  },
};
