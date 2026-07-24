import React from 'react';
import { ScrollView } from 'react-native';

const TABS_VIEWPORT_SIDE_PADDING = 32;
const ALL_TAB_KEY = 'all';

type TabLayout = {
  width: number;
  x: number;
};

export function getAppointmentDetailTabKey(categoryId: string | null) {
  return categoryId ?? ALL_TAB_KEY;
}

export function useAppointmentDetailTabsScroll({
  activeCategoryId,
  screenWidth,
}: {
  activeCategoryId: string | null;
  screenWidth: number;
}) {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [tabLayouts, setTabLayouts] = React.useState<Record<string, TabLayout>>(
    {},
  );
  const tabViewportWidth = Math.max(screenWidth - TABS_VIEWPORT_SIDE_PADDING, 0);

  const registerTabLayout = React.useCallback(
    (categoryId: string | null, nextLayout: TabLayout) => {
      const tabKey = getAppointmentDetailTabKey(categoryId);

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
    },
    [],
  );

  React.useEffect(() => {
    const activeLayout = tabLayouts[getAppointmentDetailTabKey(activeCategoryId)];

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
