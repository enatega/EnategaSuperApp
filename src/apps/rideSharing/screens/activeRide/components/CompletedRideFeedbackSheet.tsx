import React, { memo, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import BottomSheetHandle from '../../../../../general/components/BottomSheetHandle';
import SwipeableBottomSheet from '../../../../../general/components/SwipeableBottomSheet';
import Text from '../../../../../general/components/Text';
import Image from '../../../../../general/components/Image';
import Button from '../../../../../general/components/Button';
import RatingStars from '../../../../../general/components/RatingStars';
import { useTheme } from '../../../../../general/theme/theme';
import type { CompletedRideFeedbackData } from '../types/view';
import { isCourierRideRequest } from '../../../utils/courierBooking';

type SubmitPayload = {
  rating: number;
  feedback: string;
};

type Props = {
  feedbackRide: CompletedRideFeedbackData;
  isSubmitting?: boolean;
  onSubmit: (payload: SubmitPayload) => void;
  onClose: () => void;
};

function CompletedRideFeedbackSheet({
  feedbackRide,
  isSubmitting = false,
  onSubmit,
  onClose,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const isCourierFlow = isCourierRideRequest(feedbackRide.rawRideData?.ride_type?.name)
    || isCourierRideRequest(feedbackRide.rawRideData?.ride_type?.id)
    || Boolean(feedbackRide.rawRideData?.courierDetail);

  const isSubmitDisabled = useMemo(
    () => rating <= 0 || isSubmitting,
    [isSubmitting, rating],
  );

  const handleSubmit = () => {
    if (isSubmitDisabled) {
      return;
    }

    onSubmit({
      rating,
      feedback: feedback.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={StyleSheet.absoluteFill}
      pointerEvents="box-none"
    >
      <SwipeableBottomSheet
        expandedHeight={540 + insets.bottom}
        collapsedHeight={0}
        initialState="expanded"
        modal
        onCollapsed={onClose}
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surface,
            shadowColor: colors.shadowColor,
          },
        ]}
        handle={<BottomSheetHandle color={colors.findingRideHandle} />}
      >
        <View style={[styles.content, { paddingBottom: insets.bottom + 18 }]}>
          <Text weight="extraBold" style={[styles.title, { color: colors.text }]}>
            {isCourierFlow ? t('ride_feedback_courier_title') : t('ride_feedback_title')}
          </Text>

          {feedbackRide.driverAvatarUri ? (
            <Image source={{ uri: feedbackRide.driverAvatarUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: colors.cardSoft }]}>
              <Text weight="extraBold" style={[styles.avatarInitial, { color: colors.text }]}>
                {(feedbackRide.driverName ?? 'D').slice(0, 1).toUpperCase()}
              </Text>
            </View>
          )}

          <Text weight="semiBold" style={[styles.subtitle, { color: colors.text }]}>
            {isCourierFlow ? t('ride_feedback_rate_courier') : t('ride_feedback_rate_trip')}
          </Text>

          <RatingStars
            value={rating}
            onChange={setRating}
            size={48}
            filledColor="#D7B24A"
            emptyColor={colors.border}
            style={styles.starsRow}
          />

          <TextInput
            multiline
            placeholder={t('ride_feedback_placeholder')}
            placeholderTextColor={colors.iconDisabled}
            value={feedback}
            onChangeText={setFeedback}
            textAlignVertical="top"
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.surface,
              },
            ]}
          />

          <Button
            label={t('ride_feedback_submit')}
            onPress={handleSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitDisabled}
            style={[
              styles.submitButton,
              isSubmitDisabled
                ? {
                    backgroundColor: colors.backgroundTertiary,
                    borderColor: colors.backgroundTertiary,
                  }
                : {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
            ]}
          />
        </View>
      </SwipeableBottomSheet>
    </KeyboardAvoidingView>
  );
}

export default memo(CompletedRideFeedbackSheet);

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 999,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'center',
    letterSpacing: -0.48,
    marginBottom: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 20,
  },
  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarInitial: {
    fontSize: 34,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 18,
  },
  starsRow: {
    marginBottom: 20,
  },
  input: {
    width: '100%',
    minHeight: 112,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  submitButton: {
    width: '100%',
    minHeight: 44,
    borderRadius: 6,
  },
});
