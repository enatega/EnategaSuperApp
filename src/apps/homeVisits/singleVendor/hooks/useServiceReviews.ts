import { useInfiniteQuery } from '@tanstack/react-query';
import type { ApiError } from '../../../../general/api/apiClient';
import { homeVisitsKeys } from '../../api/queryKeys';
import { homeVisitsSingleVendorDiscoveryService } from '../api/discoveryService';
import type {
  HomeVisitsServiceReview,
  HomeVisitsServiceReviewsApiResponse,
} from '../api/types';
import type { BookingReviewItem, BookingReviewSummary } from '../components/Reviews/types';

const SERVICE_REVIEWS_LIMIT = 10;

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function toStringValue(...values: Array<unknown>) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return '';
}

function mapReviewItem(
  review: HomeVisitsServiceReview,
  serviceNameFallback: string,
  fallbackId: string,
): BookingReviewItem {
  const rawRating = toNumber(review.rating, 0);
  const normalizedRating = Math.min(5, Math.max(1, Math.round(rawRating || 1)));

  return {
    id: toStringValue(review.id, review._id, fallbackId) || fallbackId,
    serviceName:
      toStringValue(
        review.serviceName,
        review.serviceTitle,
        review.service?.name,
        review.service?.title,
      ) || serviceNameFallback,
    date: toStringValue(review.createdAt, review.created_at) || new Date().toISOString(),
    rating: normalizedRating,
    comment:
      toStringValue(
        review.review,
        review.comment,
        review.text,
        review.description,
      ) || '—',
    avatarUrl: toStringValue(
      review.user?.image,
      review.user?.profile,
      review.user?.avatar,
    ) || null,
  };
}

function buildDistribution(reviews: BookingReviewItem[]): BookingReviewSummary['distribution'] {
  const counts = new Map<number, number>([
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
  ]);

  for (const review of reviews) {
    const rating = Math.min(5, Math.max(1, Math.round(review.rating)));
    counts.set(rating, (counts.get(rating) ?? 0) + 1);
  }

  return [5, 4, 3, 2, 1].map((rating) => ({
    rating: rating as 1 | 2 | 3 | 4 | 5,
    count: counts.get(rating) ?? 0,
  }));
}

type Options = {
  enabled?: boolean;
  serviceNameFallback?: string;
};

export default function useServiceReviews(
  serviceId: string,
  options: Options = {},
) {
  const { enabled = true, serviceNameFallback = 'Service' } = options;
  const query = useInfiniteQuery<HomeVisitsServiceReviewsApiResponse, ApiError>({
    queryKey: homeVisitsKeys.singleVendorServiceReviews(serviceId, {
      limit: SERVICE_REVIEWS_LIMIT,
    }),
    queryFn: ({ pageParam = 0 }) =>
      homeVisitsSingleVendorDiscoveryService.getServiceReviewsPage({
        serviceId,
        offset: pageParam as number,
        limit: SERVICE_REVIEWS_LIMIT,
      }),
    enabled: Boolean(serviceId) && enabled,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const loadedCount = pages.reduce((total, page) => total + page.reviews.length, 0);

      if (loadedCount >= lastPage.total) {
        return undefined;
      }

      if (lastPage.reviews.length < SERVICE_REVIEWS_LIMIT) {
        return undefined;
      }

      return loadedCount;
    },
    staleTime: 60 * 1000,
  });

  const pages = query.data?.pages ?? [];
  const mappedReviews = pages.flatMap((page, pageIndex) =>
    page.reviews.map((review, reviewIndex) =>
      mapReviewItem(
        review,
        serviceNameFallback,
        `review-${pageIndex}-${reviewIndex}`,
      ),
    ),
  );
  const reviewCount = pages[0]?.reviewCount ?? mappedReviews.length;
  const averageRating = pages[0]?.averageRating ?? 0;
  const summary: BookingReviewSummary = {
    averageRating: Number.isFinite(averageRating) ? averageRating : 0,
    totalReviews: reviewCount,
    distribution: buildDistribution(mappedReviews),
  };

  return {
    ...query,
    reviews: mappedReviews,
    summary,
  };
}

