import apiClient from '../../../general/api/apiClient';

export interface SubmitReviewPayload {
  orderId: string;
  rating: number;
  description: string;
}

export interface SubmitReviewResponse {
  message: string;
}

export const reviewService = {
  submitReview: async (payload: SubmitReviewPayload): Promise<SubmitReviewResponse> => {
    return apiClient.post<SubmitReviewResponse>(
      '/api/v1/apps/delivery-reviews',
      payload,
    );
  },
};
