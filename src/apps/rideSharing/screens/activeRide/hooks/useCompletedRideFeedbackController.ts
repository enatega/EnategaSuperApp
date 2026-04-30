import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../../general/components/AppToast';
import { useAuthSessionQuery } from '../../../../../general/hooks/useAuthQueries';
import { getApiErrorMessage } from '../../../../../general/utils/apiError';
import type { ActiveRidePayload } from '../../../api/types';
import { useRateRide } from '../../../hooks/useRideMutations';
import { useCompletedRideFeedbackStore } from '../../../stores/useCompletedRideFeedbackStore';

type SubmitPayload = {
  rating: number;
  feedback: string;
};

function getReviewedId(rawRideData?: ActiveRidePayload, fallbackDriverUserId?: string) {
  return rawRideData?.driver?.user?.id ?? rawRideData?.driver?.id ?? fallbackDriverUserId;
}

export function useCompletedRideFeedbackController() {
  const { t } = useTranslation('rideSharing');
  const authSessionQuery = useAuthSessionQuery();
  const feedbackRide = useCompletedRideFeedbackStore((state) => state.feedbackRide);
  const clearFeedbackRide = useCompletedRideFeedbackStore((state) => state.clearFeedbackRide);
  const rateRideMutation = useRateRide();

  const handleClose = useCallback(() => {
    if (rateRideMutation.isPending) {
      return;
    }

    clearFeedbackRide();
  }, [clearFeedbackRide, rateRideMutation.isPending]);

  const handleSubmit = useCallback(async ({ rating, feedback }: SubmitPayload) => {
    const reviewerId = authSessionQuery.data?.user?.id;
    console.log("my reviewerId is : ", reviewerId);
    const reviewedId = getReviewedId(feedbackRide?.rawRideData, feedbackRide?.driverUserId);
    console.log("my reviewedId is : ", reviewedId);
    console.log('my feedbackRide is : ', feedbackRide);

    if (!feedbackRide?.rideId || !reviewerId || rateRideMutation.isPending) {
      return;
    }

    try {
      const payload = {
        description: feedback,
        rideId: feedbackRide.rideId,
        rating,
        reviewedId,
        reviewerId,
      };

      console.log('[handleSubmit] rateRide payload:', payload);

      await rateRideMutation.mutateAsync(payload);

      clearFeedbackRide();
      showToast.success(
        t('ride_feedback_submit_success_title'),
        t('ride_feedback_submit_success_message'),
      );
    } catch (error) {
      showToast.error(
        t('ride_feedback_submit_error_title'),
        getApiErrorMessage(error, t('ride_feedback_submit_error_message')),
      );
    }
  }, [
    authSessionQuery.data?.user?.id,
    clearFeedbackRide,
    feedbackRide?.driverUserId,
    feedbackRide?.rideId,
    feedbackRide?.rawRideData,
    rateRideMutation,
    t,
  ]);

  return {
    feedbackRide,
    isSubmitting: rateRideMutation.isPending,
    handleClose,
    handleSubmit,
  };
}
