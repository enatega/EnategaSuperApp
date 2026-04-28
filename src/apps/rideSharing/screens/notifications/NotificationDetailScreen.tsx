import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenHeader from '../../../../general/components/ScreenHeader';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import { formatNotificationTime } from '../../components/notifications/formatNotificationTime';
import type { RideSharingStackParamList } from '../../navigation/RideSharingNavigator';

type NotificationDetailRouteProp = RouteProp<
  RideSharingStackParamList,
  'NotificationDetail'
>;

export default function NotificationDetailScreen() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('rideSharing');
  const route = useRoute<NotificationDetailRouteProp>();
  const notification = route.params;

  if (!notification) {
    return (
      <View style={[styles.container, { backgroundColor: colors.backgroundTertiary }]}>
        <ScreenHeader
          title={t('notification_detail_title')}
          style={{ backgroundColor: colors.backgroundTertiary }}
        />
        <View style={styles.content}>
          <Text
            weight="semiBold"
            style={{
              color: colors.mutedText,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
              textAlign: 'center',
            }}
          >
            {t('notification_detail_not_available')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundTertiary }]}>
      <ScreenHeader
        title={t('notification_detail_title')}
        style={{ backgroundColor: colors.backgroundTertiary }}
      />

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
          }}
          weight="extraBold"
        >
          {notification.title}
        </Text>

        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
            marginTop: 12,
          }}
          weight="medium"
        >
          {notification.description}
        </Text>

        <Text
          style={{
            color: colors.mutedText,
            fontSize: typography.size.xs2,
            lineHeight: typography.lineHeight.sm,
            marginTop: 16,
          }}
          weight="medium"
        >
          {formatNotificationTime(notification.createdAt)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
  },
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
