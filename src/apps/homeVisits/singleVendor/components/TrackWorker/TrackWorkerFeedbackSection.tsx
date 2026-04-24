import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '../../../../../general/components/Button';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  rating: number;
  feedback: string;
  onChangeRating: (value: number) => void;
  onChangeFeedback: (value: string) => void;
  onSubmit: () => void;
};

export default function TrackWorkerFeedbackSection({
  rating,
  feedback,
  onChangeRating,
  onChangeFeedback,
  onSubmit,
}: Props) {
  const { t } = useTranslation('homeVisits');
  const { colors } = useTheme();

  return (
    <View style={styles.feedbackBlock}>
      <View style={styles.starsRow}>
        {Array.from({ length: 5 }).map((_, index) => {
          const starIndex = index + 1;
          return (
            <Pressable key={starIndex} onPress={() => onChangeRating(starIndex)}>
              <MaterialCommunityIcons
                color={starIndex <= rating ? '#EAB308' : colors.border}
                name="star"
                size={44}
              />
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.title, { color: colors.text }]} weight="bold">
        {t('single_vendor_track_worker_feedback_title')}
      </Text>

      <Text style={[styles.subtitle, { color: colors.text }]} weight="medium">
        {t('single_vendor_track_worker_feedback_subtitle')}
      </Text>

      <TextInput
        multiline
        onChangeText={onChangeFeedback}
        placeholder={t('single_vendor_track_worker_feedback_placeholder')}
        placeholderTextColor={colors.mutedText}
        style={[
          styles.feedbackInput,
          {
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
        textAlignVertical="top"
        value={feedback}
      />

      <Button
        disabled={rating < 1 || feedback.trim().length === 0}
        label={t('single_vendor_track_worker_submit')}
        onPress={onSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  feedbackBlock: {
    gap: 12,
    minHeight: 560,
    paddingTop: 180,
  },
  feedbackInput: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 110,
    padding: 12,
  },
  starsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 0,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
  },
});
