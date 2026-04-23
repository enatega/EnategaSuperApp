import React, { useMemo } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import apiClient from '../../api/apiClient';
import EmptyNotification from '../../assets/svgs/emptyNotification.svg';
import Button from '../../components/Button';
import ScreenHeader from '../../components/ScreenHeader';
import Text from '../../components/Text';
import { useAuthSessionQuery } from '../../hooks/useAuthQueries';
import { useTheme } from '../../theme/theme';
import {
  notificationMockSections,
  type NotificationMockSection,
} from './mockNotifications';

const NOTIFICATIONS_LIMIT = 10;

type AppPrefix = 'deliveries' | 'home-services';

type NotificationsApiItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

type NotificationsApiResponse = {
  items: NotificationsApiItem[];
  offset: number;
  limit: number;
  total: number;
  isEnd: boolean;
  nextOffset: number | null;
};

type Props = {
  appPrefix?: AppPrefix;
  sections?: NotificationMockSection[];
  userId?: string | null;
};

export default function NotificationsScreen({
  appPrefix = 'home-services',
  sections,
  userId: userIdProp,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('general');

  const sessionQuery = useAuthSessionQuery();
  const userId = userIdProp ?? sessionQuery.data?.user?.id ?? null;
  const isStaticMode = Boolean(sections);

  const sectionData = useMemo(
    () => sections ?? notificationMockSections,
    [sections],
  );

  const visibleSections = useMemo(
    () => sectionData.filter((section) => section.data.length > 0),
    [sectionData],
  );

  const todayQuery = useInfiniteQuery<NotificationsApiResponse>({
    queryKey: ['notifications', appPrefix, 'today', userId, NOTIFICATIONS_LIMIT],
    queryFn: ({ pageParam = 0 }) =>
      apiClient.get<NotificationsApiResponse>(
        `/api/v1/apps/${appPrefix}/users-notifications/user/today/${userId}`,
        { offset: pageParam as number, limit: NOTIFICATIONS_LIMIT },
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    enabled: !isStaticMode && Boolean(userId),
    staleTime: 60 * 1000,
  });

  const pastQuery = useInfiniteQuery<NotificationsApiResponse>({
    queryKey: ['notifications', appPrefix, 'past', userId, NOTIFICATIONS_LIMIT],
    queryFn: ({ pageParam = 0 }) =>
      apiClient.get<NotificationsApiResponse>(
        `/api/v1/apps/${appPrefix}/users-notifications/user/past/${userId}`,
        { offset: pageParam as number, limit: NOTIFICATIONS_LIMIT },
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    enabled: !isStaticMode && Boolean(userId),
    staleTime: 60 * 1000,
  });

  const todayItems = todayQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const pastItems = pastQuery.data?.pages.flatMap((page) => page.items) ?? [];

  const isDynamicLoading =
    !isStaticMode
    && (sessionQuery.isLoading
      || ((todayQuery.isLoading && todayItems.length === 0)
        || (pastQuery.isLoading && pastItems.length === 0)));

  const isEmpty = isStaticMode
    ? visibleSections.length === 0
    : !isDynamicLoading && todayItems.length === 0 && pastItems.length === 0;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('notifications_title')} />

      {isStaticMode ? (
        <FlatList
          data={visibleSections}
          keyExtractor={(section) => section.id}
          contentContainerStyle={[
            styles.contentContainer,
            isEmpty ? styles.emptyContainer : null,
          ]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.sectionSeparator} />}
          renderItem={({ item: section }) => (
            <View>
              <Text
                weight="extraBold"
                style={{
                  color: colors.text,
                  fontSize: typography.size.lg,
                  lineHeight: typography.lineHeight.md,
                  marginBottom: 6,
                }}
              >
                {t(section.titleKey)}
              </Text>

              <FlatList
                data={section.data}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                renderItem={({ item }) => (
                  <View style={styles.row}>
                    <View
                      style={[
                        styles.iconWrap,
                        {
                          backgroundColor: colors.surfaceSoft,
                        },
                      ]}
                    >
                      <Ionicons
                        name={item.iconName}
                        size={24}
                        color={colors.iconMuted}
                      />
                    </View>

                    <View style={styles.messageColumn}>
                      <Text
                        numberOfLines={1}
                        weight="medium"
                        style={{
                          color: colors.text,
                          fontSize: typography.size.sm2,
                          lineHeight: typography.lineHeight.md,
                        }}
                      >
                        {t(item.titleKey)}
                      </Text>

                      <Text
                        numberOfLines={1}
                        weight="medium"
                        style={{
                          color: colors.mutedText,
                          fontSize: typography.size.xs2,
                          lineHeight: typography.lineHeight.sm,
                          marginTop: 2,
                        }}
                      >
                        {t(item.subtitleKey)}
                      </Text>
                    </View>
                  </View>
                )}
              />
            </View>
          )}
          ListEmptyComponent={(
            <View style={styles.emptyState}>
              <EmptyNotification width={200} height={200} />
              <Text
                weight="semiBold"
                style={{
                  color: colors.text,
                  fontSize: typography.size.md2,
                  lineHeight: typography.lineHeight.md,
                  marginTop: 16,
                  textAlign: 'center',
                }}
              >
                {t('notifications_empty_title')}
              </Text>
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                  marginTop: 8,
                  textAlign: 'center',
                }}
              >
                {t('notifications_empty_description')}
              </Text>
            </View>
          )}
        />
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.contentContainer,
            isEmpty ? styles.emptyContainer : null,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {todayItems.length > 0 ? (
            <View>
              <Text
                weight="extraBold"
                style={{
                  color: colors.text,
                  fontSize: typography.size.lg,
                  lineHeight: typography.lineHeight.md,
                  marginBottom: 6,
                }}
              >
                {t('notifications_section_today')}
              </Text>

              <FlatList
                data={todayItems}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                renderItem={({ item }) => (
                  <View style={styles.row}>
                    <View
                      style={[
                        styles.iconWrap,
                        {
                          backgroundColor: colors.surfaceSoft,
                        },
                      ]}
                    >
                      <Ionicons
                        name="notifications-outline"
                        size={24}
                        color={colors.iconMuted}
                      />
                    </View>

                    <View style={styles.messageColumn}>
                      <Text
                        numberOfLines={1}
                        weight="medium"
                        style={{
                          color: colors.text,
                          fontSize: typography.size.sm2,
                          lineHeight: typography.lineHeight.md,
                        }}
                      >
                        {item.title}
                      </Text>

                      <Text
                        numberOfLines={1}
                        weight="medium"
                        style={{
                          color: colors.mutedText,
                          fontSize: typography.size.xs2,
                          lineHeight: typography.lineHeight.sm,
                          marginTop: 2,
                        }}
                      >
                        {item.description}
                      </Text>
                    </View>
                  </View>
                )}
                ListFooterComponent={
                  todayQuery.hasNextPage ? (
                    <View style={styles.showMoreWrap}>
                      <Button
                        variant="ghost"
                        label={t('notifications_show_more')}
                        isLoading={todayQuery.isFetchingNextPage}
                        onPress={() => {
                          void todayQuery.fetchNextPage();
                        }}
                      />
                    </View>
                  ) : null
                }
              />
            </View>
          ) : null}

          {todayItems.length > 0 && pastItems.length > 0 ? (
            <View style={styles.sectionSeparator} />
          ) : null}

          {pastItems.length > 0 ? (
            <View>
              <Text
                weight="extraBold"
                style={{
                  color: colors.text,
                  fontSize: typography.size.lg,
                  lineHeight: typography.lineHeight.md,
                  marginBottom: 6,
                }}
              >
                {t('notifications_section_past')}
              </Text>

              <FlatList
                data={pastItems}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                renderItem={({ item }) => (
                  <View style={styles.row}>
                    <View
                      style={[
                        styles.iconWrap,
                        {
                          backgroundColor: colors.surfaceSoft,
                        },
                      ]}
                    >
                      <Ionicons
                        name="notifications-outline"
                        size={24}
                        color={colors.iconMuted}
                      />
                    </View>

                    <View style={styles.messageColumn}>
                      <Text
                        numberOfLines={1}
                        weight="medium"
                        style={{
                          color: colors.text,
                          fontSize: typography.size.sm2,
                          lineHeight: typography.lineHeight.md,
                        }}
                      >
                        {item.title}
                      </Text>

                      <Text
                        numberOfLines={1}
                        weight="medium"
                        style={{
                          color: colors.mutedText,
                          fontSize: typography.size.xs2,
                          lineHeight: typography.lineHeight.sm,
                          marginTop: 2,
                        }}
                      >
                        {item.description}
                      </Text>
                    </View>
                  </View>
                )}
                ListFooterComponent={
                  pastQuery.hasNextPage ? (
                    <View style={styles.showMoreWrap}>
                      <Button
                        variant="ghost"
                        label={t('notifications_show_more')}
                        isLoading={pastQuery.isFetchingNextPage}
                        onPress={() => {
                          void pastQuery.fetchNextPage();
                        }}
                      />
                    </View>
                  ) : null
                }
              />
            </View>
          ) : null}

          {isEmpty ? (
            <View style={styles.emptyState}>
              <EmptyNotification width={200} height={200} />
              <Text
                weight="semiBold"
                style={{
                  color: colors.text,
                  fontSize: typography.size.md2,
                  lineHeight: typography.lineHeight.md,
                  marginTop: 16,
                  textAlign: 'center',
                }}
              >
                {t('notifications_empty_title')}
              </Text>
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                  marginTop: 8,
                  textAlign: 'center',
                }}
              >
                {t('notifications_empty_description')}
              </Text>
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  emptyContainer: {
    justifyContent: 'center',
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  itemSeparator: {
    height: 12,
  },
  messageColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  screen: {
    flex: 1,
  },
  sectionSeparator: {
    height: 16,
  },
  showMoreWrap: {
    alignItems: 'flex-end',
    marginTop: 12,
  },
});
