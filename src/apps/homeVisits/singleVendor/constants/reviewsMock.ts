import type { TFunction } from 'i18next';
import type { BookingReviewItem, BookingReviewSummary } from '../components/Reviews/types';

export const DEFAULT_BOOKING_REVIEW_SUMMARY: BookingReviewSummary = {
  averageRating: 4.5,
  distribution: [
    { rating: 5, count: 297 },
    { rating: 4, count: 6 },
    { rating: 3, count: 0 },
    { rating: 2, count: 0 },
    { rating: 1, count: 0 },
  ],
  totalReviews: 303,
};

const FIGMA_AVATARS = [
  'http://localhost:3845/assets/20ae5f5c29fa748d1efc32809184a4c10a982ff5.png',
  'http://localhost:3845/assets/9a71da30cad0dac1c53adae506768407c18bbcb7.png',
  'http://localhost:3845/assets/6a2eaa6c3d6b9d327fa4f5cad6d9df6b36e78af3.png',
  'http://localhost:3845/assets/254cd4d2e83b47750f15757324416941a8241615.png',
  'http://localhost:3845/assets/13a1cba948951eca35e86a485f8139983643e8cd.png',
  'http://localhost:3845/assets/52beffb2c2c81eebe7034d5c4bb504cefbd698e6.png',
  'http://localhost:3845/assets/d39c4d7c54dc5ee4fdca831bb29db08d4164b832.png',
];

export function getDefaultBookingReviews(
  t: TFunction<'homeVisits'>,
): BookingReviewItem[] {
  return [
    {
      avatarUrl: FIGMA_AVATARS[0],
      comment: t('single_vendor_reviews_comment_1'),
      date: '2025-10-23',
      id: 'review-1',
      rating: 5,
      serviceName: t('single_vendor_reviews_service_home_cleaning'),
    },
    {
      avatarUrl: FIGMA_AVATARS[1],
      comment: t('single_vendor_reviews_comment_2'),
      date: '2025-10-23',
      id: 'review-2',
      rating: 4,
      serviceName: t('single_vendor_reviews_service_plumber'),
    },
    {
      avatarUrl: FIGMA_AVATARS[2],
      comment: t('single_vendor_reviews_comment_3'),
      date: '2025-10-24',
      id: 'review-3',
      rating: 5,
      serviceName: t('single_vendor_reviews_service_window_cleaning'),
    },
    {
      avatarUrl: FIGMA_AVATARS[3],
      comment: t('single_vendor_reviews_comment_4'),
      date: '2025-10-25',
      id: 'review-4',
      rating: 5,
      serviceName: t('single_vendor_reviews_service_electrician'),
    },
    {
      avatarUrl: FIGMA_AVATARS[4],
      comment: t('single_vendor_reviews_comment_5'),
      date: '2025-10-26',
      id: 'review-5',
      rating: 5,
      serviceName: t('single_vendor_reviews_service_floor_cleaning'),
    },
    {
      avatarUrl: FIGMA_AVATARS[5],
      comment: t('single_vendor_reviews_comment_6'),
      date: '2025-10-27',
      id: 'review-6',
      rating: 5,
      serviceName: t('single_vendor_reviews_service_washing'),
    },
    {
      avatarUrl: FIGMA_AVATARS[6],
      comment: t('single_vendor_reviews_comment_7'),
      date: '2025-10-28',
      id: 'review-7',
      rating: 5,
      serviceName: t('single_vendor_reviews_service_washing'),
    },
  ];
}
