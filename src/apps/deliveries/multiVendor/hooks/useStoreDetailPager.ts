import React from 'react';
import { ScrollView } from 'react-native';
import type { DeliveryStoreDetailsFilterItem } from '../../api/types';

const TABS_VIEWPORT_SIDE_PADDING = 32;
const OFFERS_TAB_KEY = 'offers';

type StoreDetailTabLayout = {
  width: number;
  x: number;
};

type GetStoreDetailCategoryPageIndexParams = {
  activeCategoryId: string | null;
  categories: DeliveryStoreDetailsFilterItem[];
};

type UseStoreDetailTabsScrollParams = {
  activeCategoryId: string | null;
  screenWidth: number;
};

export function buildStoreDetailCategoryIds(categories: DeliveryStoreDetailsFilterItem[]) {
  return [null, ...categories.map((category) => category.id)];
}

export function getStoreDetailCategoryIdAtPageIndex(
  pageIndex: number,
  categories: DeliveryStoreDetailsFilterItem[],
) {
  return buildStoreDetailCategoryIds(categories)[pageIndex];
}

export function getStoreDetailCategoryPageIndex({
  activeCategoryId,
  categories,
}: GetStoreDetailCategoryPageIndexParams) {
  const categoryIds = buildStoreDetailCategoryIds(categories);
  const activeCategoryIndex = categoryIds.findIndex((categoryId) => categoryId === activeCategoryId);

  return activeCategoryIndex >= 0 ? activeCategoryIndex : 0;
}

export function getStoreDetailTabKey(categoryId: string | null) {
  return categoryId ?? OFFERS_TAB_KEY;
}

export function useStoreDetailTabsScroll({
  activeCategoryId,
  screenWidth,
}: UseStoreDetailTabsScrollParams) {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [tabLayouts, setTabLayouts] = React.useState<Record<string, StoreDetailTabLayout>>({});
  const tabViewportWidth = Math.max(screenWidth - TABS_VIEWPORT_SIDE_PADDING, 0);

  const registerTabLayout = (categoryId: string | null, nextLayout: StoreDetailTabLayout) => {
    const tabKey = getStoreDetailTabKey(categoryId);

    setTabLayouts((currentLayouts) => {
      const currentLayout = currentLayouts[tabKey];

      if (
        currentLayout?.x === nextLayout.x &&
        currentLayout?.width === nextLayout.width
      ) {
        return currentLayouts;
      }

      return {
        ...currentLayouts,
        [tabKey]: nextLayout,
      };
    });
  };

  React.useEffect(() => {
    const activeLayout = tabLayouts[getStoreDetailTabKey(activeCategoryId)];

    if (!activeLayout) {
      return;
    }

    const targetOffset = Math.max(
      activeLayout.x - tabViewportWidth / 2 + activeLayout.width / 2,
      0,
    );

    scrollViewRef.current?.scrollTo({ x: targetOffset, animated: true });
  }, [activeCategoryId, tabLayouts, tabViewportWidth]);

  return {
    registerTabLayout,
    scrollViewRef,
  };
}
