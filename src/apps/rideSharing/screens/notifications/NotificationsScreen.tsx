import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Button from '../../../../general/components/Button';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import NotificationsSkeleton from '../../../../general/components/notifications/NotificationsSkeleton';
import { useTheme } from '../../../../general/theme/theme';
import NotificationListItem from '../../components/notifications/NotificationListItem';
import NotificationsEmptyIllustration from '../../components/notifications/NotificationsEmptyIllustration';
import { formatNotificationTime } from '../../components/notifications/formatNotificationTime';
import type { UserNotificationItem } from '../../api/userService';
import { useProfile } from '../../hooks/useProfile';
import {
  usePastNotifications,
  useTodayNotifications,
} from '../../hooks/useUserQueries';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';

type NavigationProp = NativeStackNavigationProp<RideSharingStackParamList>;

export default function NotificationsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors, typography } = useTheme();
  const { t } = useTranslation('rideSharing');
  const { userProfile, isLoading: isProfileLoading } = useProfile();
  console.log("user profile id", userProfile?.id);

  const todayQuery = useTodayNotifications(userProfile?.id);
  const pastQuery = usePastNotifications(userProfile?.id);

  const todayItems = useMemo(
    () => todayQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [todayQuery.data],
  );
  const pastItems = useMemo(
    () => pastQuery.data?.pages.flatMap((page) => page.items) ?? [],
    [pastQuery.data],
  );

  const isLoading = isProfileLoading
    || ((todayQuery.isLoading && todayItems.length === 0)
      || (pastQuery.isLoading && pastItems.length === 0));

  const hasAnyError = Boolean(todayQuery.error || pastQuery.error);
  const isEmpty = !isLoading && todayItems.length === 0 && pastItems.length === 0;

  useEffect(() => {
    console.log('[NotificationsScreen] userProfile.id:', userProfile?.id);
    console.log('[NotificationsScreen] today query status:', {
      isLoading: todayQuery.isLoading,
      isFetching: todayQuery.isFetching,
      hasNextPage: todayQuery.hasNextPage,
      pages: todayQuery.data?.pages.length ?? 0,
    });
    console.log('[NotificationsScreen] past query status:', {
      isLoading: pastQuery.isLoading,
      isFetching: pastQuery.isFetching,
      hasNextPage: pastQuery.hasNextPage,
      pages: pastQuery.data?.pages.length ?? 0,
    });
  }, [
    userProfile?.id,
    todayQuery.isLoading,
    todayQuery.isFetching,
    todayQuery.hasNextPage,
    todayQuery.data?.pages.length,
    pastQuery.isLoading,
    pastQuery.isFetching,
    pastQuery.hasNextPage,
    pastQuery.data?.pages.length,
  ]);

  useEffect(() => {
    if (todayQuery.error) {
      console.error('[NotificationsScreen] today notifications error:', todayQuery.error);
    }
    if (pastQuery.error) {
      console.error('[NotificationsScreen] past notifications error:', pastQuery.error);
    }
  }, [todayQuery.error, pastQuery.error]);

  const handleNotificationPress = useCallback(
    (item: UserNotificationItem) => {
      navigation.navigate('NotificationDetail', {
        notificationId: item.id,
        title: item.title,
        description: item.description,
        createdAt: item.createdAt,
      });
    },
    [navigation],
  );

  const renderTodayItem = useCallback(
    ({ item }: { item: UserNotificationItem }) => (
      <NotificationListItem
        notification={item}
        timeLabel={formatNotificationTime(item.createdAt)}
        onPress={handleNotificationPress}
      />
    ),
    [handleNotificationPress],
  );

  const renderPastItem = useCallback(
    ({ item }: { item: UserNotificationItem }) => (
      <NotificationListItem
        notification={item}
        timeLabel={formatNotificationTime(item.createdAt)}
        onPress={handleNotificationPress}
      />
    ),
    [handleNotificationPress],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.backgroundTertiary }]}>
      <ScreenHeader
        title={t('sidebar_notifications')}
        style={{ backgroundColor: colors.backgroundTertiary }}
      />

      {isLoading ? (
        <NotificationsSkeleton />
      ) : hasAnyError ? (
        <View style={styles.centerState}>
          <Text
            weight="semiBold"
            style={{
              color: colors.danger,
              textAlign: 'center',
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {t('notifications_load_error')}
          </Text>
        </View>
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
                  fontSize: typography.size.h5,
                  lineHeight: typography.lineHeight.h5,
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
                renderItem={renderTodayItem}
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
                  fontSize: typography.size.h5,
                  lineHeight: typography.lineHeight.h5,
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
                renderItem={renderPastItem}
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
              <NotificationsEmptyIllustration />
              <Text
                weight="extraBold"
                style={{
                  color: colors.text,
                  fontSize: typography.size.h5,
                  lineHeight: typography.lineHeight.h5,
                  marginTop: 8,
                  textAlign: 'center',
                }}
              >
                {t('notifications_empty_title')}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                  marginTop: 8,
                  textAlign: 'center',
                }}
                weight="medium"
              >
                {t('notifications_empty_subtitle')}
              </Text>
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centerState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 28,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    justifyContent: 'center',
    paddingBottom: 40,
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  itemSeparator: {
    height: 12,
  },
  screen: {
    flex: 1,
  },
  sectionSeparator: {
    height: 16,
  },
  showMoreWrap: {
    alignItems: 'center',
    marginTop: 12,
  },
});
