import { useMutation } from '@tanstack/react-query';
import { ApiError } from '../../../general/api/apiClient';
import {
  reviewService,
  type SubmitReviewPayload,
  type SubmitReviewResponse,
} from '../api/reviewService';

type Options = {
  onSuccess?: (data: SubmitReviewResponse) => void;
  onError?: (error: ApiError) => void;
};

export function useSubmitReviewMutation(options?: Options) {
  return useMutation<SubmitReviewResponse, ApiError, SubmitReviewPayload>({
    mutationFn: reviewService.submitReview,
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
}
