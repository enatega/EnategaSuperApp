export type BookingReviewSummary = {
  averageRating: number;
  totalReviews: number;
  distribution: Array<{
    rating: 1 | 2 | 3 | 4 | 5;
    count: number;
  }>;
};

export type BookingReviewItem = {
  id: string;
  serviceName: string;
  date: string;
  rating: number;
  comment: string;
  avatarUrl?: string | null;
};
