import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../../general/components/Skeleton';

function RideEstimateBottomSheetSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.selectedCard}>
        <View style={styles.selectedHeader}>
          <View style={styles.selectedMeta}>
            <Skeleton width={80} height={24} borderRadius={12} />
            <View style={styles.selectedTextBlock}>
              <Skeleton width={116} height={14} borderRadius={7} />
              <Skeleton width={54} height={12} borderRadius={6} />
            </View>
          </View>
          <Skeleton width={20} height={20} borderRadius={10} />
        </View>

        <View style={styles.fareRow}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <View style={styles.fareMeta}>
            <Skeleton width={132} height={34} borderRadius={10} />
            <Skeleton width={96} height={12} borderRadius={6} style={styles.fareHint} />
          </View>
          <Skeleton width={40} height={40} borderRadius={20} />
        </View>
      </View>

      <View style={styles.optionList}>
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} style={styles.optionRow}>
            <Skeleton width={48} height={20} borderRadius={8} />
            <View style={styles.optionMeta}>
              <Skeleton width={102} height={14} borderRadius={7} />
              <Skeleton width={42} height={12} borderRadius={6} />
            </View>
            <Skeleton width={62} height={14} borderRadius={7} />
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <View style={styles.footerLabel}>
            <Skeleton width={22} height={22} borderRadius={11} />
            <Skeleton width={110} height={14} borderRadius={7} />
          </View>
          <Skeleton width={18} height={18} borderRadius={9} />
        </View>

        <View style={styles.footerRow}>
          <View style={styles.footerLabel}>
            <Skeleton width={22} height={22} borderRadius={11} />
            <Skeleton width={84} height={14} borderRadius={7} />
          </View>
          <Skeleton width={18} height={18} borderRadius={9} />
        </View>

        <Skeleton width="auto" height={48} borderRadius={8} style={styles.buttonSkeleton} />
      </View>
    </View>
  );
}

export default memo(RideEstimateBottomSheetSkeleton);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  selectedCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
    gap: 18,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  selectedMeta: {
    gap: 10,
  },
  selectedTextBlock: {
    gap: 8,
  },
  fareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fareMeta: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  fareHint: {
    marginTop: 8,
  },
  optionList: {
    paddingTop: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionMeta: {
    flex: 1,
    gap: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonSkeleton: {
    marginTop: 2,
  },
});
