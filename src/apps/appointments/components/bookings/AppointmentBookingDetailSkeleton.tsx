import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';
import Icon from '../../../../general/components/Icon';
import Skeleton from '../../../../general/components/Skeleton';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  insets: EdgeInsets;
  onBack: () => void;
};

export default function AppointmentBookingDetailSkeleton({
  insets,
  onBack,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Skeleton borderRadius={0} height="100%" width="100%" />
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            style={[
              styles.backButton,
              { backgroundColor: colors.surface, top: insets.top + 10 },
            ]}
          >
            <Icon color={colors.text} name="arrow-back" size={22} />
          </Pressable>
          <Skeleton
            borderRadius={7}
            height={28}
            style={styles.heroTitle}
            width="54%"
          />
        </View>

        <View style={styles.content}>
          <Skeleton borderRadius={7} height={29} width={96} />
          <Skeleton borderRadius={6} height={26} width="78%" />
          <Skeleton borderRadius={5} height={20} width="42%" />

          <View style={styles.actions}>
            {Array.from({ length: 4 }).map((_, index) => (
              <View
                key={`booking-detail-action-skeleton-${index}`}
                style={[
                  styles.actionRow,
                  { borderBottomColor: colors.border },
                ]}
              >
                <Skeleton borderRadius={999} height={46} width={46} />
                <View style={styles.actionCopy}>
                  <Skeleton borderRadius={5} height={18} width="44%" />
                  <Skeleton borderRadius={5} height={16} width="68%" />
                </View>
                <Skeleton borderRadius={4} height={18} width={18} />
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Skeleton borderRadius={6} height={26} width="32%" />
            {Array.from({ length: 2 }).map((_, index) => (
              <View
                key={`booking-detail-item-skeleton-${index}`}
                style={styles.itemRow}
              >
                <View style={styles.itemCopy}>
                  <Skeleton borderRadius={5} height={18} width="58%" />
                  <Skeleton borderRadius={5} height={16} width="24%" />
                </View>
                <Skeleton borderRadius={5} height={18} width={58} />
              </View>
            ))}
            <View
              style={[styles.totalRow, { borderTopColor: colors.border }]}
            >
              <Skeleton borderRadius={5} height={18} width={56} />
              <Skeleton borderRadius={5} height={18} width={72} />
            </View>
          </View>

          <View
            style={[
              styles.section,
              { marginBottom: insets.bottom + 4 },
            ]}
          >
            <Skeleton borderRadius={6} height={26} width="54%" />
            <Skeleton borderRadius={5} height={20} width="100%" />
            <Skeleton borderRadius={5} height={20} width="72%" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  actionCopy: {
    flex: 1,
    gap: 6,
  },
  actionRow: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
  },
  actions: {
    marginTop: 18,
  },
  backButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    left: 16,
    position: 'absolute',
    width: 40,
  },
  content: {
    gap: 12,
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  hero: {
    height: 310,
  },
  heroTitle: {
    bottom: 22,
    left: 20,
    position: 'absolute',
  },
  itemCopy: {
    flex: 1,
    gap: 4,
  },
  itemRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  screen: {
    flex: 1,
  },
  section: {
    gap: 12,
    marginTop: 18,
  },
  totalRow: {
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
  },
});
