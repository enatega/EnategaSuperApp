import React from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  View,
} from 'react-native';
import PagerView, { type PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type {
  DeliveryStoreDetailsFilterItem,
  DeliveryStoreDetailsProduct,
} from '../../../api/types';
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
const OFFERS_PAGE_KEY = 'offers';

type StoreDetailSkeletonItem = (typeof STORE_DETAIL_PRODUCT_SKELETON_ITEMS)[number];
type StoreDetailListItem = DeliveryStoreDetailsProduct | StoreDetailSkeletonItem;

type Props = {
  activeCategoryId: string | null;
  categories: DeliveryStoreDetailsFilterItem[];
  emptyText: string;
  onCategorySelect: (categoryId: string | null) => void;
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
  emptyText,
  onCategorySelect,
  products,
  shouldShowProductSkeletons,
}: Props) {
  const { colors } = useTheme();
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
  const activePageHeight = Math.max(pageHeights[activePageKey] ?? 0, MIN_PAGER_HEIGHT);
  const activeListData = React.useMemo<StoreDetailListItem[]>(
    () => (shouldShowProductSkeletons ? STORE_DETAIL_PRODUCT_SKELETON_ITEMS : products),
    [products, shouldShowProductSkeletons],
  );

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

        return (
          <View
            collapsable={false}
            key={pageKey}
            style={[styles.page, { backgroundColor: colors.background }]}
          >
            <View onLayout={(event) => handlePageLayout(pageCategoryId, event)}>
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
              ) : (
                <View style={styles.emptyState}>
                  <Text style={{ color: colors.mutedText }}>{emptyText}</Text>
                </View>
              )}
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
  emptyState: {
    paddingTop: 8,
  },
});
