import React, { useEffect, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../general/theme/theme';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import Button from '../../../../general/components/Button';
import { showToast } from '../../../../general/components/AppToast';
import RatingStars from '../../components/rateOrder/RatingStars';
import RatingTagList from '../../components/rateOrder/RatingTagList';
import RatingCommentInput from '../../components/rateOrder/RatingCommentInput';
import { useSubmitReviewMutation } from '../../hooks/useSubmitReviewMutation';
import type { DeliveriesStackParamList } from '../../navigation/types';

const RATING_TAGS_BY_SCORE: Record<number, string[]> = {
  1: ['Wrong items', 'Missing items', 'Poor packaging', 'Very late', 'Rude delivery'],
  2: ['Wrong items', 'Missing items', 'Poor packaging', 'Late delivery'],
  3: ['Average food', 'Okay packaging', 'Acceptable time'],
  4: ['Good food', 'Nice packaging', 'On time'],
  5: ['Delicious', 'Perfect packaging', 'Super fast', 'Friendly delivery'],
};

export default function RateOrderScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<DeliveriesStackParamList, 'RateOrder'>>();
  const { orderId, storeName } = route.params;

  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardOffset(e.endCoordinates.height - insets.bottom + 16);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0);
    });
    return () => {
      show.remove();
      hide.remove();
    };
  }, [insets.bottom]);

  const tags = rating > 0 ? (RATING_TAGS_BY_SCORE[rating] ?? []) : [];

  const handleTagToggle = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    setSelectedTags((prev) =>
      isSelected ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
    setComment((prev) => {
      if (isSelected) {
        // Remove the tag from comment (handles both ", tag" and "tag, " and standalone)
        return prev
          .replace(`, ${tag}`, '')
          .replace(`${tag}, `, '')
          .replace(tag, '')
          .trim();
      }
      return prev ? `${prev}, ${tag}` : tag;
    });
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
    setSelectedTags([]);
    setComment('');
  };

  const submitReview = useSubmitReviewMutation({
    onSuccess: () => {
      showToast.success(t('rate_order_success_title'), t('rate_order_success_message'));
      navigation.goBack();
    },
    onError: (error) => {
      showToast.error(t('rate_order_error_title'), error.message);
    },
  });

  const handleSubmit = () => {
    submitReview.mutate({
      orderId,
      rating,
      description: comment.trim(),
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('rate_order_title')} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Large top spacer to push content down like the design */}
        <View style={styles.topSpacer} />

        <View style={styles.hero}>
          <Text variant="caption" color={colors.mutedText} style={styles.center}>
            {storeName}
          </Text>

          <RatingStars value={rating} onChange={handleRatingChange} />

          <Text variant="title" weight="bold" style={styles.center}>
            {t('rate_order_heading')}
          </Text>
          <Text variant="body" color={colors.mutedText} style={styles.center}>
            {t('rate_order_subheading')}
          </Text>
        </View>

        {tags.length > 0 && (
          <RatingTagList
            tags={tags}
            selected={selectedTags}
            onToggle={handleTagToggle}
          />
        )}

        <RatingCommentInput
          value={comment}
          onChangeText={setComment}
          placeholder={t('rate_order_comment_placeholder')}
        />
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            borderTopColor: colors.border,
            backgroundColor: colors.background,
            paddingBottom: insets.bottom + 12,
            bottom: keyboardOffset,
          },
        ]}
      >
        <Button
          label={t('rate_order_submit')}
          onPress={handleSubmit}
          disabled={rating === 0 || submitReview.isPending}
          isLoading={submitReview.isPending}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  footer: {
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    position: 'absolute',
    right: 0,
  },
  hero: {
    alignItems: 'center',
    gap: 10,
  },
  screen: { flex: 1 },
  scrollContent: {
    gap: 20,
    padding: 16,
    paddingBottom: 100,
  },
  scrollView: { flex: 1 },
  topSpacer: { height: 60 },
});
