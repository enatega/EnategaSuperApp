import React from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import apiClient from "../../api/apiClient";
import EmptyNotification from "../../assets/svgs/emptyNotification.svg";
import Button from "../../components/Button";
import NotificationsSkeleton from "../../components/notifications/NotificationsSkeleton";
import ScreenHeader from "../../components/ScreenHeader";
import Text from "../../components/Text";
import { useAuthSessionQuery } from "../../hooks/useAuthQueries";
import { useTheme } from "../../theme/theme";

const NOTIFICATIONS_LIMIT = 10;

type AppPrefix = "deliveries" | "general-bookings" | "home-services";

export type NotificationsApiItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  data?: Record<string, unknown> | null;
  deep_link?: string | null;
  isRead?: boolean;
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
  apiPathPrefix?: string;
  authenticatedUserRoutes?: boolean;
  onNotificationPress?: (notification: NotificationsApiItem) => void;
  userId?: string | null;
};

export default function NotificationsScreen({
  appPrefix = "home-services",
  apiPathPrefix,
  authenticatedUserRoutes = false,
  onNotificationPress,
  userId: userIdProp,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation("general");
  const queryClient = useQueryClient();

  const sessionQuery = useAuthSessionQuery();
  const userId = userIdProp ?? sessionQuery.data?.user?.id ?? null;
  const resolvedApiPathPrefix =
    apiPathPrefix ?? `/api/v1/apps/${appPrefix}/users-notifications`;
  const notificationQueryKey = [
    "notifications",
    appPrefix,
    authenticatedUserRoutes ? "current-user" : userId,
  ] as const;

  const todayQuery = useInfiniteQuery<NotificationsApiResponse>({
    queryKey: [...notificationQueryKey, "today", NOTIFICATIONS_LIMIT],
    queryFn: ({ pageParam = 0 }) =>
      apiClient.get<NotificationsApiResponse>(
        authenticatedUserRoutes
          ? `${resolvedApiPathPrefix}/today`
          : `${resolvedApiPathPrefix}/user/today/${userId}`,
        { offset: pageParam as number, limit: NOTIFICATIONS_LIMIT },
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    enabled: Boolean(userId),
    staleTime: 60 * 1000,
  });

  const pastQuery = useInfiniteQuery<NotificationsApiResponse>({
    queryKey: [...notificationQueryKey, "past", NOTIFICATIONS_LIMIT],
    queryFn: ({ pageParam = 0 }) =>
      apiClient.get<NotificationsApiResponse>(
        authenticatedUserRoutes
          ? `${resolvedApiPathPrefix}/past`
          : `${resolvedApiPathPrefix}/user/past/${userId}`,
        { offset: pageParam as number, limit: NOTIFICATIONS_LIMIT },
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.isEnd ? undefined : (lastPage.nextOffset ?? undefined),
    enabled: Boolean(userId),
    staleTime: 60 * 1000,
  });

  const todayItems = todayQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const pastItems = pastQuery.data?.pages.flatMap((page) => page.items) ?? [];

  const isDynamicLoading =
    sessionQuery.isLoading ||
    (todayQuery.isLoading && todayItems.length === 0) ||
    (pastQuery.isLoading && pastItems.length === 0);

  const isEmpty =
    !isDynamicLoading && todayItems.length === 0 && pastItems.length === 0;
  const isRefreshing = todayQuery.isRefetching || pastQuery.isRefetching;

  const refreshNotifications = () => {
    void Promise.all([todayQuery.refetch(), pastQuery.refetch()]);
  };

  const handleNotificationPress = (notification: NotificationsApiItem) => {
    if (notification.isRead === false && authenticatedUserRoutes) {
      void apiClient
        .patch(`${resolvedApiPathPrefix}/${notification.id}/read`)
        .then(() =>
          queryClient.invalidateQueries({ queryKey: notificationQueryKey }),
        )
        .catch(() => undefined);
    }

    onNotificationPress?.(notification);
  };

  const renderNotification = ({ item }: { item: NotificationsApiItem }) => {
    const isUnread = item.isRead === false;

    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => handleNotificationPress(item)}
        style={({ pressed }) => [
          styles.row,
          pressed ? styles.rowPressed : null,
        ]}
      >
        <View
          style={[styles.iconWrap, { backgroundColor: colors.surfaceSoft }]}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={isUnread ? colors.primary : colors.iconMuted}
          />
        </View>

        <View style={styles.messageColumn}>
          <View style={styles.titleRow}>
            {isUnread ? (
              <View
                style={[styles.unreadDot, { backgroundColor: colors.primary }]}
              />
            ) : null}
            <Text
              numberOfLines={1}
              weight={isUnread ? "bold" : "medium"}
              style={{
                color: colors.text,
                flex: 1,
                fontSize: typography.size.sm2,
                lineHeight: typography.lineHeight.md,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                color: colors.mutedText,
                fontSize: typography.size.xxs,
              }}
            >
              {new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          <Text
            numberOfLines={2}
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
      </Pressable>
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t("notifications_title")} />

      {isDynamicLoading ? (
        <NotificationsSkeleton />
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.contentContainer,
            isEmpty ? styles.emptyContainer : null,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshNotifications}
              tintColor={colors.primary}
            />
          }
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
                {t("notifications_section_today")}
              </Text>

              <FlatList
                data={todayItems}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => (
                  <View style={styles.itemSeparator} />
                )}
                renderItem={renderNotification}
                ListFooterComponent={
                  todayQuery.hasNextPage ? (
                    <View style={styles.showMoreWrap}>
                      <Button
                        variant="ghost"
                        label={t("notifications_show_more")}
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
                {t("notifications_section_past")}
              </Text>

              <FlatList
                data={pastItems}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => (
                  <View style={styles.itemSeparator} />
                )}
                renderItem={renderNotification}
                ListFooterComponent={
                  pastQuery.hasNextPage ? (
                    <View style={styles.showMoreWrap}>
                      <Button
                        variant="ghost"
                        label={t("notifications_show_more")}
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
                  textAlign: "center",
                }}
              >
                {t("notifications_empty_title")}
              </Text>
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                {t("notifications_empty_description")}
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
    justifyContent: "center",
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 30,
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  itemSeparator: {
    height: 12,
  },
  messageColumn: {
    flex: 1,
    justifyContent: "center",
  },
  row: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    gap: 12,
    paddingVertical: 4,
  },
  rowPressed: {
    opacity: 0.7,
  },
  screen: {
    flex: 1,
  },
  sectionSeparator: {
    height: 16,
  },
  showMoreWrap: {
    alignItems: "flex-end",
    marginTop: 12,
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  unreadDot: {
    borderRadius: 999,
    height: 7,
    width: 7,
  },
});
