import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import type { ListRenderItemInfo } from '@shopify/flash-list';
import type { StyleProp, ViewStyle, ViewToken } from 'react-native';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import VerticalList from '../../../../general/components/VerticalList';
import { useTheme } from '../../../../general/theme/theme';
import useServiceCenterServices from '../../singleVendor/hooks/useServiceCenterServices';
import type { HomeVisitsSingleVendorServiceCenterListItem } from '../../singleVendor/api/types';
import { formatPrice } from '../ServiceDetailsPage/serviceDetailsSelection';
import { normalizeEstimatedDurationLabel } from './serviceDuration';

type ServiceRowItem = {
  type: 'service';
  key: string;
  categoryId: string;
  service: HomeVisitsSingleVendorServiceCenterListItem;
};

type SectionHeaderItem = {
  type: 'section';
  key: string;
  categoryId: string;
  title: string;
};

type ListItem = SectionHeaderItem | ServiceRowItem;

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
  const listRef = useRef<{ scrollToIndex: (params: { animated?: boolean; index: number; viewPosition?: number }) => void } | null>(null);
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

  const sections = useMemo(() => {
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

    return Array.from(byCategory.values());
  }, [query.data]);

  const categories = useMemo<CategoryTab[]>(
    () => sections.map((section) => ({ id: section.id, name: section.name })),
    [sections],
  );

  const listItems = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];

    for (const section of sections) {
      items.push({
        type: 'section',
        key: `section-${section.id}`,
        categoryId: section.id,
        title: section.name,
      });

      for (const service of section.services) {
        items.push({
          type: 'service',
          key: `service-${service.id}`,
          categoryId: section.id,
          service,
        });
      }
    }

    return items;
  }, [sections]);

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

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const categoryIndexMap = useMemo(() => {
    const indexMap = new Map<string, number>();

    listItems.forEach((item, index) => {
      if (item.type === 'section' && !indexMap.has(item.categoryId)) {
        indexMap.set(item.categoryId, index);
      }
    });

    return indexMap;
  }, [listItems]);

  const resolvedActiveCategory =
    activeCategoryId ?? categories[0]?.id ?? null;

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
    if (categories.length === 0 || listItems.length === 0) {
      return;
    }

    setActiveCategoryId((previous) => previous ?? categories[0].id);
    listRef.current?.scrollToIndex({
      animated: false,
      index: 0,
      viewPosition: 0,
    });
  }, [categories, listItems.length]);

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
      setActiveCategoryId(categoryId);
      const sectionIndex = categoryIndexMap.get(categoryId);

      if (sectionIndex == null) {
        return;
      }

      listRef.current?.scrollToIndex({
        animated: true,
        index: sectionIndex,
        viewPosition: 0,
      });
    },
    [categoryIndexMap],
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const firstVisible = viewableItems.find(
        (token) => token.item && (token.item as ListItem).type === 'section',
      );

      if (!firstVisible?.item) {
        return;
      }

      const categoryId = (firstVisible.item as ListItem).categoryId;
      setActiveCategoryId((previous) => (previous === categoryId ? previous : categoryId));
    },
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ListItem>) => {
      if (item.type === 'section') {
        return <SectionHeader title={item.title} />;
      }

      const isSelected = selectedIdsSet.has(item.service.id);

      return (
        <ServiceRow
          isSelected={isSelected}
          isSelectionLocked={lockedSelectedIdsSet.has(item.service.id)}
          onPress={() => handleToggleService(item.service.id)}
          service={item.service}
        />
      );
    },
    [handleToggleService, lockedSelectedIdsSet, selectedIdsSet],
  );

  const keyExtractor = useCallback((item: ListItem) => item.key, []);

  const getItemType = useCallback((item: ListItem) => item.type, []);

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
          contentContainerStyle={styles.tabsRow}
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
        >
          {categories.map((category) => {
            const isActive = resolvedActiveCategory === category.id;

            return (
              <Pressable
                key={category.id}
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

      <VerticalList<ListItem>
        contentContainerStyle={contentContainerStyle as any}
        data={listItems}
        getItemType={getItemType}
        keyExtractor={keyExtractor}
        ListFooterComponent={footer}
        maintainVisibleContentPosition={{ disabled: true }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.4}
        onViewableItemsChanged={onViewableItemsChanged.current}
        ref={listRef}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
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
