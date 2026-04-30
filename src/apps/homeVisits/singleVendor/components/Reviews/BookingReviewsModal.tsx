import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import ReviewListItem from './ReviewListItem';
import ReviewsFilterRow from './ReviewsFilterRow';
import ReviewSortSheet from './ReviewSortSheet';
import ReviewStars from './ReviewStars';
import type { BookingReviewItem, BookingReviewSummary } from './types';
import type { ReviewSortOption } from './ReviewSortSheet';

type Props = {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  visible: boolean;
  onClose: () => void;
  summary: BookingReviewSummary;
  reviews: BookingReviewItem[];
};

function BookingReviewsModal({
  hasNextPage = false,
  isFetchingNextPage = false,
  isLoading = false,
  onLoadMore,
  visible,
  onClose,
  summary,
  reviews,
}: Props) {
  const { t } = useTranslation('homeVisits');
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedRatings, setSelectedRatings] = React.useState<Array<number>>([]);
  const [selectedSort, setSelectedSort] =
    React.useState<ReviewSortOption>('latest');
  const [isSortVisible, setIsSortVisible] = React.useState(false);
  const maxDistributionCount = React.useMemo(
    () => Math.max(...summary.distribution.map((item) => item.count), 0),
    [summary.distribution],
  );

  const filteredReviews = React.useMemo<Array<BookingReviewItem>>(() => {
    if (selectedRatings.length === 0) {
      return reviews;
    }

    return reviews.filter((item) => selectedRatings.includes(item.rating));
  }, [reviews, selectedRatings]);
  const totalLabelCount =
    selectedRatings.length > 0 ? filteredReviews.length : summary.totalReviews;

  const sortedReviews = React.useMemo<Array<BookingReviewItem>>(() => {
    const nextReviews = [...filteredReviews];

    if (selectedSort === 'best') {
      nextReviews.sort((left, right) => right.rating - left.rating);
      return nextReviews;
    }

    if (selectedSort === 'worst') {
      nextReviews.sort((left, right) => left.rating - right.rating);
      return nextReviews;
    }

    nextReviews.sort((left, right) => {
      const leftValue = new Date(left.date).getTime();
      const rightValue = new Date(right.date).getTime();

      if (Number.isNaN(leftValue) || Number.isNaN(rightValue)) {
        return 0;
      }

      return rightValue - leftValue;
    });

    return nextReviews;
  }, [filteredReviews, selectedSort]);
  const shouldShowEmptyState = !isLoading && sortedReviews.length === 0;

  const onToggleRating = React.useCallback((rating: number) => {
    setSelectedRatings((previous) => (
      previous.includes(rating)
        ? previous.filter((current) => current !== rating)
        : [...previous, rating]
    ));
  }, []);

  const renderItem = React.useCallback(
    ({ item }: { item: BookingReviewItem }) => (
      <ReviewListItem item={item} />
    ),
    [],
  );

  const header = (
    <View>
      <View style={styles.handleContainer}>
        <View style={[styles.handle, { backgroundColor: colors.iconColor }]} />
      </View>

      <View style={styles.summaryBlock}>
        <ReviewStars
          rating={summary.averageRating}
          size={24}
        />
        <Text
          style={{
            color: colors.iconMuted,
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md2,
          }}
          weight="medium"
        >
          {t('single_vendor_reviews_summary_label', {
            count: summary.distribution.find((item) => item.rating === 5)?.count ?? 0,
            rating: summary.averageRating.toFixed(1),
          })}
        </Text>
      </View>

      <View style={styles.filtersContainer}>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md2,
            marginBottom: 8,
          }}
          weight="semiBold"
        >
          {t('single_vendor_reviews_filter_by')}
        </Text>
        {summary.distribution.map((item) => (
          <ReviewsFilterRow
            count={item.count}
            isDisabled={item.count === 0}
            isSelected={selectedRatings.includes(item.rating)}
            key={`filter-${item.rating}`}
            maxCount={maxDistributionCount}
            onPress={onToggleRating}
            rating={item.rating}
          />
        ))}
      </View>

      <View style={styles.listMeta}>
        <Text
          style={{
            color: colors.iconMuted,
            fontSize: typography.size.md2,
            lineHeight: typography.lineHeight.md2,
          }}
          weight="medium"
        >
          {t('single_vendor_reviews_total_label', { count: totalLabelCount })}
        </Text>
        <View style={styles.sortRow}>
          <Text
            style={{
              color: colors.iconMuted,
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md2,
            }}
            weight="medium"
          >
            {t('single_vendor_reviews_sort_by')}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setIsSortVisible(true)}
            style={[styles.sortButton, { backgroundColor: colors.background, borderColor: colors.border }]}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.md,
              }}
              weight="medium"
            >
              {t(`single_vendor_reviews_${selectedSort}`)}
            </Text>
            <MaterialCommunityIcons
              color={colors.iconMuted}
              name="chevron-down"
              size={16}
            />
          </Pressable>
        </View>
      </View>

      {shouldShowEmptyState ? (
        <View style={styles.emptyState}>
          <Image
            source={require('../../../../../general/assets/images/rating-1.png')}
            style={styles.emptyIllustration}

          />
          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.md2,
              lineHeight: typography.lineHeight.md2,
              textAlign: 'center',
            }}
            weight="semiBold"
          >
            {t('single_vendor_reviews_empty_title')}
          </Text>
          <Text
            style={{
              color: colors.mutedText,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
              textAlign: 'center',
            }}
            weight="medium"
          >
            {t('single_vendor_reviews_empty_subtitle')}
          </Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
      visible={visible}
    >
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.headerBar, { paddingTop: insets.top + 8 }]}>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={[styles.iconButton, { backgroundColor: colors.backgroundTertiary }]}
          >
            <MaterialCommunityIcons
              color={colors.text}
              name="arrow-left"
              size={22}
            />
          </Pressable>
          <Text
            style={{
              color: colors.text,
              flex: 1,
              fontSize: typography.size.lg,
              lineHeight: typography.lineHeight.md2,
              textAlign: 'center',
            }}
            weight="semiBold"
          >
            {t('single_vendor_reviews_title')}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={[styles.iconButton, { backgroundColor: colors.backgroundTertiary }]}
          >
            <MaterialCommunityIcons
              color={colors.text}
              name="close"
              size={22}
            />
          </Pressable>
        </View>

        <FlatList
          data={sortedReviews}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={header}
          ListEmptyComponent={null}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.paginationLoader}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
          renderItem={renderItem}
          onEndReached={() => {
            if (!hasNextPage || isFetchingNextPage || isLoading) {
              return;
            }

            onLoadMore?.();
          }}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        />

        <ReviewSortSheet
          onClose={() => setIsSortVisible(false)}
          onSelectSort={setSelectedSort}
          selectedSort={selectedSort}
          visible={isSortVisible}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  emptyIllustration: {
    height: 120,
    width: 120,
  },
  filtersContainer: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  handle: {
    borderRadius: 9999,
    height: 4,
    width: 96,
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 4,
  },
  headerBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  listMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  paginationLoader: {
    alignItems: 'center',
    paddingBottom: 16,
    paddingTop: 8,
  },
  screen: {
    flex: 1,
  },
  sortButton: {
    alignItems: 'center',
    borderRadius: 9999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  sortRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  summaryBlock: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default React.memo(BookingReviewsModal);
