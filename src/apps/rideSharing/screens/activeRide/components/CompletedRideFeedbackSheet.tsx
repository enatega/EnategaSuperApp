import React, { memo, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import BottomSheetHandle from '../../../../../general/components/BottomSheetHandle';
import SwipeableBottomSheet from '../../../../../general/components/SwipeableBottomSheet';
import Text from '../../../../../general/components/Text';
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const isCourierFlow = isCourierRideRequest(feedbackRide.rawRideData?.ride_type?.name)
    || isCourierRideRequest(feedbackRide.rawRideData?.ride_type?.id)
    || Boolean(feedbackRide.rawRideData?.courierDetail);
  const feedbackTags = useMemo(
    () => [
      'ride_feedback_tag_good_music',
      'ride_feedback_tag_clean_and_neat',
      'ride_feedback_tag_careful_driving',
      'ride_feedback_tag_nice_car',
      'ride_feedback_tag_polite_driver',
      'ride_feedback_tag_driver_arrived_quickly',
    ],
    [],
  );

  const isSubmitDisabled = useMemo(
    () => rating <= 0 || isSubmitting,
    [isSubmitting, rating],
  );

  const toggleTag = (tag: string) => {
    setSelectedTags((previous) => (
      previous.includes(tag)
        ? previous.filter((item) => item !== tag)
        : [...previous, tag]
    ));
  };

  const handleSubmit = () => {
    if (isSubmitDisabled) {
      return;
    }

    const selectedTagLabels = selectedTags.map((tag) => t(tag)).join(', ');
    const composedFeedback = [selectedTagLabels, feedback.trim()].filter(Boolean).join('. ');

    onSubmit({
      rating,
      feedback: composedFeedback,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={StyleSheet.absoluteFill}
      pointerEvents="box-none"
    >
      <SwipeableBottomSheet
        expandedHeight={640 + insets.bottom}
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

          <Text weight="medium" style={[styles.subtitle, { color: '#374151' }]}>
            {t('ride_feedback_tip_subtitle')}
          </Text>

          <RatingStars
            value={rating}
            onChange={setRating}
            size={48}
            filledColor={colors.warning}
            emptyColor={colors.border}
            style={styles.starsRow}
          />

          <View style={styles.tagsWrap}>
            {feedbackTags.map((tag) => {
              const selected = selectedTags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: selected ? colors.findingRidePrimarySoft : colors.gray100,
                    },
                  ]}
                >
                  <Text
                    weight="medium"
                    style={{ color: selected ? colors.findingRidePrimary : '#374151' }}
                  >
                    {t(tag)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

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
    paddingTop: 6,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'center',
    letterSpacing: -0.48,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  starsRow: {
    marginBottom: 14,
  },
  tagChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagsWrap: {
    alignItems: 'center',
    columnGap: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
    rowGap: 8,
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
