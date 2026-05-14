import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { ListRenderItemInfo } from '@shopify/flash-list';
import PagerView from 'react-native-pager-view';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import VerticalList from '../../../../general/components/VerticalList';
import { useTheme } from '../../../../general/theme/theme';
import useServiceCenterServices from '../../singleVendor/hooks/useServiceCenterServices';
import type { HomeVisitsSingleVendorServiceCenterListItem } from '../../singleVendor/api/types';
import { formatPrice } from '../ServiceDetailsPage/serviceDetailsSelection';
import { normalizeEstimatedDurationLabel } from './serviceDuration';

type ServiceSection = {
  key: string;
  categoryId: string;
  title: string;
  data: HomeVisitsSingleVendorServiceCenterListItem[];
};

type CategoryTab = {
  id: string;
  name: string;
};

type Props = {
  serviceCenterId: string;
  selectedServiceIds?: string[];
  lockedSelectedServiceIds?: string[];
  onSelectedServiceIdsChange?: (serviceIds: string[]) => void;
  onSelectedServicesChange?: (services: HomeVisitsSingleVendorServiceCenterListItem[]) => void;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

function formatDuration(service: HomeVisitsSingleVendorServiceCenterListItem) {
  const normalizedEstimatedDuration = normalizeEstimatedDurationLabel(
    service.estimatedDuration,
  );
  if (normalizedEstimatedDuration) {
    return normalizedEstimatedDuration;
  }

  if (service.duration == null || service.duration <= 0) {
    return null;
  }

  const normalizedUnit = service.durationUnit?.toLowerCase().trim() ?? '';
  if (normalizedUnit.includes('hour')) {
    return `${service.duration} ${service.duration === 1 ? 'hr' : 'hrs'}`;
  }

  return `${service.duration} min`;
}

function ServiceCenterServicesList({
  contentContainerStyle,
  lockedSelectedServiceIds,
  onSelectedServiceIdsChange,
  onSelectedServicesChange,
  selectedServiceIds,
  serviceCenterId,
}: Props) {
  const { colors, typography } = useTheme();
  const pagerRef = useRef<PagerView | null>(null);
  const hasAppliedInitialPageRef = useRef(false);
  const tabsScrollRef = useRef<ScrollView | null>(null);
  const tabsContentWidthRef = useRef(0);
  const tabsViewportWidthRef = useRef(0);
  const tabLayoutMapRef = useRef<Map<string, { x: number; width: number }>>(new Map());
  const query = useServiceCenterServices(serviceCenterId);
  const lockedSelectedIds = useMemo(
    () => Array.from(new Set(lockedSelectedServiceIds ?? [])),
    [lockedSelectedServiceIds],
  );
  const lockedSelectedIdsSet = useMemo(
    () => new Set(lockedSelectedIds),
    [lockedSelectedIds],
  );

  const isControlled = selectedServiceIds != null;
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(lockedSelectedIds);
  const activeSelectedIds = useMemo(
    () => Array.from(new Set([...(isControlled ? (selectedServiceIds ?? []) : internalSelectedIds), ...lockedSelectedIds])),
    [internalSelectedIds, isControlled, lockedSelectedIds, selectedServiceIds],
  );

  const sections = useMemo<ServiceSection[]>(() => {
    const byCategory = new Map<
      string,
      { id: string; name: string; services: HomeVisitsSingleVendorServiceCenterListItem[] }
    >();

    for (const service of query.data) {
      const existing = byCategory.get(service.category.id);
      if (existing) {
        existing.services.push(service);
        continue;
      }

      byCategory.set(service.category.id, {
        id: service.category.id,
        name: service.category.name,
        services: [service],
      });
    }

    return Array.from(byCategory.values()).map((section) => ({
      key: `section-${section.id}`,
      categoryId: section.id,
      title: section.name,
      data: section.services,
    }));
  }, [query.data]);

  const categories = useMemo<CategoryTab[]>(
    () => sections.map((section) => ({ id: section.categoryId, name: section.title })),
    [sections],
  );

  const selectedIdsSet = useMemo(() => new Set(activeSelectedIds ?? []), [activeSelectedIds]);

  const selectedServices = useMemo(
    () =>
      query.data.filter((service) =>
        selectedIdsSet.has(service.id),
      ),
    [query.data, selectedIdsSet],
  );
  const selectedServicesSignature = useMemo(
    () =>
      selectedServices
        .map((service) => `${service.id}:${service.price ?? 0}`)
        .sort()
        .join('|'),
    [selectedServices],
  );
  const lastNotifiedSelectionRef = useRef<string>('');

  const [activePageIndex, setActivePageIndex] = useState(0);

  const categorySectionIndexMap = useMemo(() => {
    const indexMap = new Map<string, number>();
    sections.forEach((section, index) => {
      indexMap.set(section.categoryId, index);
    });
    return indexMap;
  }, [sections]);

  const resolvedActiveCategory = categories[activePageIndex]?.id ?? categories[0]?.id ?? null;

  const scrollActiveTabIntoView = useCallback((categoryId: string | null) => {
    if (!categoryId) {
      return;
    }

    const layout = tabLayoutMapRef.current.get(categoryId);
    if (!layout) {
      return;
    }

    const viewportWidth = tabsViewportWidthRef.current;
    const contentWidth = tabsContentWidthRef.current;
    if (viewportWidth <= 0 || contentWidth <= 0) {
      return;
    }

    const centeredOffset = layout.x - (viewportWidth - layout.width) / 2;
    const maxOffset = Math.max(0, contentWidth - viewportWidth);
    const nextOffset = Math.max(0, Math.min(centeredOffset, maxOffset));

    tabsScrollRef.current?.scrollTo({
      x: nextOffset,
      animated: true,
    });
  }, []);

  React.useEffect(() => {
    hasAppliedInitialPageRef.current = false;
  }, [serviceCenterId]);

  React.useEffect(() => {
    if (isControlled) {
      return;
    }

    setInternalSelectedIds((previous) => {
      const nextIds = Array.from(new Set([...previous, ...lockedSelectedIds]));

      if (nextIds.length === previous.length) {
        return previous;
      }

      return nextIds;
    });
  }, [isControlled, lockedSelectedIds]);

  React.useEffect(() => {
    if (sections.length === 0) {
      if (activePageIndex !== 0) {
        setActivePageIndex(0);
      }
      return;
    }

    if (activePageIndex > sections.length - 1) {
      const nextIndex = sections.length - 1;
      setActivePageIndex(nextIndex);
      pagerRef.current?.setPageWithoutAnimation(nextIndex);
    }
  }, [activePageIndex, sections.length]);

  React.useEffect(() => {
    if (hasAppliedInitialPageRef.current) {
      return;
    }

    if (sections.length === 0) {
      return;
    }

    const preferredSectionIndex = sections.findIndex((section) =>
      section.data.some((service) => selectedIdsSet.has(service.id)),
    );
    const nextIndex = preferredSectionIndex >= 0 ? preferredSectionIndex : 0;

    hasAppliedInitialPageRef.current = true;
    if (activePageIndex !== nextIndex) {
      setActivePageIndex(nextIndex);
      pagerRef.current?.setPageWithoutAnimation(nextIndex);
    }
  }, [activePageIndex, sections, selectedIdsSet]);

  const applySelection = useCallback(
    (nextIds: string[]) => {
      const nextWithLocked = Array.from(new Set([...nextIds, ...lockedSelectedIds]));

      if (!isControlled) {
        setInternalSelectedIds(nextWithLocked);
      }

      onSelectedServiceIdsChange?.(nextWithLocked);
    },
    [isControlled, lockedSelectedIds, onSelectedServiceIdsChange],
  );

  const handleToggleService = useCallback(
    (serviceId: string) => {
      if (lockedSelectedIdsSet.has(serviceId)) {
        return;
      }

      const nextIds = selectedIdsSet.has(serviceId)
        ? (activeSelectedIds ?? []).filter((id) => id !== serviceId)
        : [...(activeSelectedIds ?? []), serviceId];

      applySelection(nextIds);
    },
    [activeSelectedIds, applySelection, lockedSelectedIdsSet, selectedIdsSet],
  );

  const handleSelectCategory = useCallback(
    (categoryId: string) => {
      const sectionIndex = categorySectionIndexMap.get(categoryId);

      if (sectionIndex == null) {
        return;
      }

      setActivePageIndex(sectionIndex);
      pagerRef.current?.setPage(sectionIndex);
    },
    [categorySectionIndexMap],
  );

  React.useEffect(() => {
    scrollActiveTabIntoView(resolvedActiveCategory);
  }, [resolvedActiveCategory, scrollActiveTabIntoView]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<HomeVisitsSingleVendorServiceCenterListItem>) => {
      const isSelected = selectedIdsSet.has(item.id);

      return (
        <ServiceRow
          isSelected={isSelected}
          isSelectionLocked={lockedSelectedIdsSet.has(item.id)}
          onPress={() => handleToggleService(item.id)}
          service={item}
        />
      );
    },
    [handleToggleService, lockedSelectedIdsSet, selectedIdsSet],
  );

  const keyExtractor = useCallback((item: HomeVisitsSingleVendorServiceCenterListItem) => item.id, []);

  const handleEndReached = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  }, [query]);

  const footer = useMemo(() => {
    if (!query.isFetchingNextPage) {
      return null;
    }

    return (
      <View style={styles.paginationLoader}>
        <ActivityIndicator size="small" color={colors.warning} />
      </View>
    );
  }, [colors.warning, query.isFetchingNextPage]);

  React.useEffect(() => {
    if (!onSelectedServicesChange) {
      return;
    }

    if (lastNotifiedSelectionRef.current === selectedServicesSignature) {
      return;
    }

    lastNotifiedSelectionRef.current = selectedServicesSignature;
    onSelectedServicesChange(selectedServices);
  }, [onSelectedServicesChange, selectedServices, selectedServicesSignature]);

  if (query.isPending && query.data.length === 0) {
    return <ServiceCenterServicesListSkeleton />;
  }

  if (query.isError) {
    return (
      <View style={[styles.emptyStateWrap, { borderColor: colors.border }]}> 
        <Text
          weight="semiBold"
          style={{
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          Unable to load services
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          ref={tabsScrollRef}
          contentContainerStyle={styles.tabsRow}
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          onContentSizeChange={(width) => {
            tabsContentWidthRef.current = width;
            scrollActiveTabIntoView(resolvedActiveCategory);
          }}
          onLayout={(event) => {
            tabsViewportWidthRef.current = event.nativeEvent.layout.width;
            scrollActiveTabIntoView(resolvedActiveCategory);
          }}
        >
          {categories.map((category) => {
            const isActive = resolvedActiveCategory === category.id;

            return (
              <Pressable
                key={category.id}
                onLayout={(event) => {
                  tabLayoutMapRef.current.set(category.id, {
                    x: event.nativeEvent.layout.x,
                    width: event.nativeEvent.layout.width,
                  });
                  if (resolvedActiveCategory === category.id) {
                    scrollActiveTabIntoView(category.id);
                  }
                }}
                onPress={() => handleSelectCategory(category.id)}
                style={[
                  styles.tabChip,
                  {
                    backgroundColor: isActive ? colors.cardPeach : colors.background,
                  },
                ]}
              >
                <Text
                  weight="medium"
                  style={{
                    color: isActive ? colors.text : colors.iconMuted,
                    fontSize: typography.size.sm2,
                    lineHeight: typography.lineHeight.md,
                  }}
                >
                  {category.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(event) => {
          setActivePageIndex(event.nativeEvent.position);
        }}
      >
        {sections.map((section) => (
          <View key={section.key} style={styles.page}>
            <VerticalList<HomeVisitsSingleVendorServiceCenterListItem>
              contentContainerStyle={contentContainerStyle as any}
              data={section.data}
              keyExtractor={keyExtractor}
              
              ListFooterComponent={footer}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.4}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ))}
      </PagerView>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.sectionHeaderWrap}>
      <Text
        weight="bold"
        style={{
          color: colors.text,
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {title}
      </Text>
    </View>
  );
}

const ServiceRow = memo(function ServiceRow({
  isSelected,
  isSelectionLocked,
  onPress,
  service,
}: {
  service: HomeVisitsSingleVendorServiceCenterListItem;
  isSelected: boolean;
  isSelectionLocked: boolean;
  onPress: () => void;
}) {
  const { colors, typography } = useTheme();
  const durationLabel = formatDuration(service);

  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}> 
      <View style={styles.rowMeta}>
        <Text
          weight="medium"
          numberOfLines={1}
          style={{
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {service.name}
        </Text>

        <View style={styles.rowSubMeta}>
          <Text
            weight="medium"
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {formatPrice(service.price)}
          </Text>

          {durationLabel ? (
            <>
              <Icon type="Entypo" name="dot-single" size={16} color={colors.iconMuted} />
              <Text
                weight="medium"
                style={{
                  color: colors.iconMuted,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                }}
              >
                {durationLabel}
              </Text>
            </>
          ) : null}
        </View>
      </View>

      <Pressable
        disabled={isSelectionLocked}
        onPress={onPress}
        style={[
          styles.toggle,
          {
            backgroundColor: isSelected ? colors.cardPeach : colors.background,
            borderColor: isSelected ? colors.warning : colors.border,
            opacity: isSelectionLocked ? 0.85 : 1,
          },
        ]}
      >
        <Ionicons
          color={colors.text}
          name={isSelected ? 'checkmark' : 'add'}
          size={18}
        />
      </Pressable>
    </View>
  );
});

function ServiceCenterServicesListSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={styles.skeletonWrap}>
      <View style={styles.tabsRow}>
        {[0, 1, 2, 3].map((item) => (
          <View
            key={item}
            style={[
              styles.skeletonChip,
              {
                backgroundColor: colors.backgroundTertiary,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.sectionHeaderWrap}>
        <View
          style={[
            styles.skeletonTitle,
            {
              backgroundColor: colors.backgroundTertiary,
            },
          ]}
        />
      </View>

      {Array.from({ length: 8 }).map((_, index) => (
        <View key={index} style={[styles.row, { borderBottomColor: colors.border }]}> 
          <View style={styles.rowMeta}>
            <View
              style={[
                styles.skeletonLinePrimary,
                {
                  backgroundColor: colors.backgroundTertiary,
                },
              ]}
            />
            <View
              style={[
                styles.skeletonLineSecondary,
                {
                  backgroundColor: colors.backgroundTertiary,
                },
              ]}
            />
          </View>

          <View
            style={[
              styles.toggle,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyStateWrap: {
    borderRadius: 10,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
  },
  paginationLoader: {
    paddingBottom: 12,
    paddingTop: 8,
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  row: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowMeta: {
    flex: 1,
    gap: 2,
  },
  rowSubMeta: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  screen: {
    flex: 1,
  },
  sectionHeaderWrap: {
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  skeletonChip: {
    borderRadius: 999,
    height: 30,
    width: 88,
  },
  skeletonLinePrimary: {
    borderRadius: 6,
    height: 18,
    width: '74%',
  },
  skeletonLineSecondary: {
    borderRadius: 6,
    height: 16,
    width: '45%',
  },
  skeletonTitle: {
    borderRadius: 8,
    height: 28,
    width: 120,
  },
  skeletonWrap: {
    flex: 1,
  },
  tabChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tabsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabsContainer: {
    flexGrow: 0,
    flexShrink: 0,
    height: 46,
    justifyContent: 'center',
  },
  tabsScroll: {
    flex: 0,
    flexBasis: 46,
    flexGrow: 0,
    flexShrink: 0,
    height: 46,
  },
  toggle: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
});

export default memo(ServiceCenterServicesList);
