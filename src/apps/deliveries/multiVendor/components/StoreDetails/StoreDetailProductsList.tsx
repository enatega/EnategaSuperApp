import React from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import PagerView, { type PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import { useTheme } from '../../../../../general/theme/theme';
import type {
  DeliveryStoreDetailsFilterItem,
  DeliveryStoreDetailsProduct,
} from '../../../api/types';
import ListStateView from '../../../components/filterablePaginatedList/ListStateView';
import {
  buildStoreDetailCategoryIds,
  getStoreDetailCategoryIdAtPageIndex,
  getStoreDetailCategoryPageIndex,
} from '../../hooks/useStoreDetailPager';
import StoreDetailMenuCard from './StoreDetailMenuCard';
import StoreDetailMenuCardSkeleton from './StoreDetailMenuCardSkeleton';

const STORE_DETAIL_PRODUCT_SKELETON_ITEMS = Array.from({ length: 4 }, (_, index) => ({
  id: `store-detail-product-skeleton-${index}`,
  isSkeleton: true as const,
}));
const MIN_PAGER_HEIGHT = 1;
const LIST_STATE_MIN_HEIGHT = 180;
const OFFERS_PAGE_KEY = 'offers';
const PAGE_HORIZONTAL_PADDING = 16;
const PRODUCT_CARD_ASPECT_RATIO = 1.15;
const PRODUCT_CARD_CONTENT_HEIGHT = 72;
const PRODUCT_CARD_VERTICAL_MARGIN = 12;
const PRODUCT_CARD_WIDTH_RATIO = 0.48;

type StoreDetailSkeletonItem = (typeof STORE_DETAIL_PRODUCT_SKELETON_ITEMS)[number];
type StoreDetailListItem = DeliveryStoreDetailsProduct | StoreDetailSkeletonItem;

type Props = {
  activeCategoryId: string | null;
  categories: DeliveryStoreDetailsFilterItem[];
  contentLayoutKey?: string;
  emptyText: string;
  errorText?: string | null;
  hasError?: boolean;
  hasFetchedProducts?: boolean;
  onCategorySelect: (categoryId: string | null) => void;
  onRetry?: () => void;
  products: DeliveryStoreDetailsProduct[];
  shouldShowProductSkeletons: boolean;
};

function isStoreDetailSkeletonItem(item: StoreDetailListItem): item is StoreDetailSkeletonItem {
  return (item as StoreDetailSkeletonItem).isSkeleton === true;
}

function getPageKey(categoryId: string | null) {
  return categoryId ?? OFFERS_PAGE_KEY;
}

export default function StoreDetailProductsList({
  activeCategoryId,
  categories,
  contentLayoutKey,
  emptyText,
  errorText,
  hasError = false,
  hasFetchedProducts = false,
  onCategorySelect,
  onRetry,
  products,
  shouldShowProductSkeletons,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const { width } = useWindowDimensions();
  const pagerViewRef = React.useRef<PagerView>(null);
  const [pageHeights, setPageHeights] = React.useState<Record<string, number>>({});
  const pageCategoryIds = React.useMemo(
    () => buildStoreDetailCategoryIds(categories),
    [categories],
  );
  const activePageIndex = React.useMemo(
    () => getStoreDetailCategoryPageIndex({ activeCategoryId, categories }),
    [activeCategoryId, categories],
  );
  const activePageIndexRef = React.useRef(activePageIndex);
  const activePageKey = getPageKey(activeCategoryId);
  const activeListData = React.useMemo<StoreDetailListItem[]>(
    () => (shouldShowProductSkeletons ? STORE_DETAIL_PRODUCT_SKELETON_ITEMS : products),
    [products, shouldShowProductSkeletons],
  );
  const estimatedGridHeight = React.useMemo(() => {
    const pageContentWidth = Math.max(width - PAGE_HORIZONTAL_PADDING * 2, 0);
    const cardWidth = pageContentWidth * PRODUCT_CARD_WIDTH_RATIO;

    return Math.ceil(
      cardWidth / PRODUCT_CARD_ASPECT_RATIO +
      PRODUCT_CARD_CONTENT_HEIGHT +
      PRODUCT_CARD_VERTICAL_MARGIN,
    );
  }, [width]);
  const shouldShowActiveErrorState =
    hasFetchedProducts && hasError && products.length === 0 && !shouldShowProductSkeletons;
  const shouldShowActiveEmptyState =
    hasFetchedProducts &&
    products.length === 0 &&
    !shouldShowProductSkeletons &&
    !shouldShowActiveErrorState;
  const activeContentMinHeight = activeListData.length > 0
    ? estimatedGridHeight
    : shouldShowActiveErrorState || shouldShowActiveEmptyState
      ? LIST_STATE_MIN_HEIGHT
      : MIN_PAGER_HEIGHT;
  const activePageHeight = Math.max(
    pageHeights[activePageKey] ?? 0,
    activeContentMinHeight,
    MIN_PAGER_HEIGHT,
  );
  const activeContentStateKey = React.useMemo(() => {
    const stateKey = shouldShowProductSkeletons
      ? 'loading'
      : shouldShowActiveErrorState
        ? 'error'
        : shouldShowActiveEmptyState
          ? 'empty'
          : `products-${products.length}`;

    return `${contentLayoutKey ?? activePageKey}:${stateKey}`;
  }, [
    activePageKey,
    contentLayoutKey,
    products.length,
    shouldShowActiveEmptyState,
    shouldShowActiveErrorState,
    shouldShowProductSkeletons,
  ]);

  React.useEffect(() => {
    if (activePageIndexRef.current === activePageIndex) {
      return;
    }

    pagerViewRef.current?.setPage(activePageIndex);
    activePageIndexRef.current = activePageIndex;
  }, [activePageIndex]);

  const handlePageSelected = React.useCallback(
    (event: PagerViewOnPageSelectedEvent) => {
      const nextPageIndex = event.nativeEvent.position;
      const nextCategoryId = getStoreDetailCategoryIdAtPageIndex(nextPageIndex, categories) ?? null;

      activePageIndexRef.current = nextPageIndex;

      if (nextCategoryId !== activeCategoryId) {
        onCategorySelect(nextCategoryId);
      }
    },
    [activeCategoryId, categories, onCategorySelect],
  );

  const handlePageLayout = React.useCallback(
    (categoryId: string | null, event: LayoutChangeEvent) => {
      const nextHeight = event.nativeEvent.layout.height;
      const pageKey = getPageKey(categoryId);

      if (nextHeight <= 0) {
        return;
      }

      setPageHeights((currentHeights) => {
        if (currentHeights[pageKey] === nextHeight) {
          return currentHeights;
        }

        return {
          ...currentHeights,
          [pageKey]: nextHeight,
        };
      });
    },
    [],
  );

  return (
    <PagerView
      initialPage={activePageIndex}
      offscreenPageLimit={1}
      onPageSelected={handlePageSelected}
      ref={pagerViewRef}
      style={[styles.pager, { height: activePageHeight }]}
    >
      {pageCategoryIds.map((pageCategoryId) => {
        const pageKey = getPageKey(pageCategoryId);
        const isActivePage = pageCategoryId === activeCategoryId;
        const pageData: StoreDetailListItem[] = isActivePage ? activeListData : [];
        const shouldShowErrorState = isActivePage && shouldShowActiveErrorState;
        const shouldShowEmptyState = isActivePage && shouldShowActiveEmptyState;
        const pageContentKey = isActivePage ? activeContentStateKey : `${pageKey}:inactive`;

        return (
          <View
            collapsable={false}
            key={pageKey}
            style={[styles.page, { backgroundColor: colors.background }]}
          >
            <View
              key={pageContentKey}
              onLayout={(event) => handlePageLayout(pageCategoryId, event)}
            >
              {pageData.length > 0 ? (
                <View style={styles.grid}>
                  {pageData.map((item) =>
                    isStoreDetailSkeletonItem(item) ? (
                      <StoreDetailMenuCardSkeleton key={item.id} />
                    ) : (
                      <StoreDetailMenuCard item={item} key={item.id} />
                    ),
                  )}
                </View>
              ) : shouldShowErrorState ? (
                <ListStateView
                  actionLabel={t('generic_list_retry')}
                  containerStyle={styles.stateView}
                  description={errorText ?? t('store_details_load_error')}
                  onActionPress={onRetry}
                  title={t('generic_list_error_title')}
                  variant="error"
                />
              ) : shouldShowEmptyState ? (
                <ListStateView
                  containerStyle={styles.stateView}
                  description={emptyText}
                  variant="empty"
                />
              ) : null}
            </View>
          </View>
        );
      })}
    </PagerView>
  );
}

const styles = StyleSheet.create({
  pager: {
    width: '100%',
  },
  page: {
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stateView: {
    flex: 0,
  },
});
