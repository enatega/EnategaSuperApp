import React, { useMemo } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import EmptyNotification from '../../assets/svgs/emptyNotification.svg';
import ScreenHeader from '../../components/ScreenHeader';
import Text from '../../components/Text';
import { useTheme } from '../../theme/theme';
import {
  notificationMockSections,
  type NotificationMockSection,
} from './mockNotifications';

type Props = {
  sections?: NotificationMockSection[];
};

export default function NotificationsScreen({ sections }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('general');

  const sectionData = useMemo(
    () => sections ?? notificationMockSections,
    [sections],
  );

  const visibleSections = useMemo(
    () => sectionData.filter((section) => section.data.length > 0),
    [sectionData],
  );

  const isEmpty = visibleSections.length === 0;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title={t('notifications_title')} />

      <SectionList
        sections={visibleSections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.contentContainer,
          isEmpty ? styles.emptyContainer : null,
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
        renderSectionHeader={({ section }) => (
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
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
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
});
