import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { WalletResponse } from '../../api/profileService';
import { useTheme } from '../../theme/theme';
import Text from '../Text';

type Props = {
  membership: WalletResponse['data']['membership'];
  lifetimePoints: number;
  labels: {
    lifetimePoints: string;
    multiplier: string;
    nextTier: (name: string, points: number) => string;
    topTier: string;
  };
};

export default function MembershipCard({
  membership,
  lifetimePoints,
  labels,
}: Props) {
  const { colors } = useTheme();
  if (!membership) return null;

  const next = membership.next_tier;
  const progress = next
    ? Math.min(
        1,
        Math.max(
          0,
          (lifetimePoints - membership.minimum_points) /
            (next.minimum_points - membership.minimum_points),
        ),
      )
    : 1;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, { backgroundColor: colors.cardSoft, borderColor: colors.border }]}>
        <View style={styles.heading}>
          <Text weight="bold" style={styles.tier}>{membership.name}</Text>
          <Text weight="semiBold" color={colors.primary}>
            ×{membership.points_multiplier.toFixed(2)} {labels.multiplier}
          </Text>
        </View>
        <Text color={colors.mutedText}>
          {labels.lifetimePoints}: {lifetimePoints.toLocaleString()}
        </Text>
        <View style={[styles.track, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progress,
              { backgroundColor: colors.primary, width: `${progress * 100}%` },
            ]}
          />
        </View>
        <Text variant="caption" color={colors.mutedText}>
          {next ? labels.nextTier(next.name, next.points_remaining) : labels.topTier}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, borderWidth: 1, gap: 10, padding: 16 },
  heading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  progress: { borderRadius: 4, height: 8 },
  tier: { fontSize: 20 },
  track: { borderRadius: 4, height: 8, overflow: 'hidden' },
  wrapper: { paddingHorizontal: 16 },
});
