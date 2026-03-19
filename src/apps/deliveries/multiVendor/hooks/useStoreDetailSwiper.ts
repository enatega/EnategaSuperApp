import React from 'react';
import { PanResponder, ScrollView } from 'react-native';
import type { PanResponderGestureState } from 'react-native';
import type { DeliveryStoreDetailsFilterItem } from '../../api/types';

const SWIPE_ACTIVATION_DISTANCE = 12;
const SWIPE_TRIGGER_DISTANCE = 36;
const TABS_VIEWPORT_SIDE_PADDING = 32;
const OFFERS_TAB_KEY = 'offers';

export type StoreDetailSwipeDirection = 'next' | 'previous';

type StoreDetailTabLayout = {
  width: number;
  x: number;
};

type GetStoreDetailSwipeTargetCategoryIdParams = {
  activeCategoryId: string | null;
  categories: DeliveryStoreDetailsFilterItem[];
  direction: StoreDetailSwipeDirection;
};

type UseStoreDetailCardSwipeParams = {
  onSwipe?: (direction: StoreDetailSwipeDirection) => void;
};

type UseStoreDetailTabsScrollParams = {
  activeCategoryId: string | null;
  screenWidth: number;
};

function shouldActivateSwipe(gestureState: PanResponderGestureState) {
  return (
    Math.abs(gestureState.dx) > SWIPE_ACTIVATION_DISTANCE &&
    Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.25
  );
}

function getSwipeDirection(dx: number): StoreDetailSwipeDirection | null {
  if (dx >= SWIPE_TRIGGER_DISTANCE) {
    return 'next';
  }

  if (dx <= -SWIPE_TRIGGER_DISTANCE) {
    return 'previous';
  }

  return null;
}

function buildStoreDetailCategoryIds(categories: DeliveryStoreDetailsFilterItem[]) {
  return [null, ...categories.map((category) => category.id)];
}

export function getStoreDetailTabKey(categoryId: string | null) {
  return categoryId ?? OFFERS_TAB_KEY;
}

export function getStoreDetailSwipeTargetCategoryId({
  activeCategoryId,
  categories,
  direction,
}: GetStoreDetailSwipeTargetCategoryIdParams) {
  const categoryIds = buildStoreDetailCategoryIds(categories);
  const activeCategoryIndex = categoryIds.findIndex((categoryId) => categoryId === activeCategoryId);
  const currentIndex = activeCategoryIndex >= 0 ? activeCategoryIndex : 0;
  const targetIndex = direction === 'next' ? currentIndex - 1 : currentIndex + 1;
  const targetCategoryId = categoryIds[targetIndex];

  return typeof targetCategoryId === 'undefined' ? undefined : targetCategoryId;
}

export function useStoreDetailCardSwipe({ onSwipe }: UseStoreDetailCardSwipeParams) {
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, gestureState) =>
          shouldActivateSwipe(gestureState),
        onPanResponderRelease: (_event, gestureState) => {
          const direction = getSwipeDirection(gestureState.dx);

          if (direction) {
            onSwipe?.(direction);
          }
        },
        onPanResponderTerminate: (_event, gestureState) => {
          const direction = getSwipeDirection(gestureState.dx);

          if (direction) {
            onSwipe?.(direction);
          }
        },
      }),
    [onSwipe],
  );

  return panResponder.panHandlers;
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
