import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../../general/components/Skeleton';
import { useTheme } from '../../../../../general/theme/theme';

export default function StoreDetailMenuCardSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={[styles.imageArea, { backgroundColor: colors.surfaceSoft }]}>
          <View style={styles.imageHeader}>
            <Skeleton height={20} width="34%" borderRadius={6} />
            <Skeleton height={32} width={32} borderRadius={16} />
          </View>

          <View style={styles.imageWrapper}>
            <Skeleton height="62%" width="70%" borderRadius={12} />
          </View>
        </View>

        <View style={styles.content}>
          <Skeleton height={16} width="36%" borderRadius={6} />
          <Skeleton height={20} width="78%" borderRadius={6} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexShrink: 0,
    marginVertical: 6,
    width: '48%',
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageArea: {
    aspectRatio: 1.15,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  imageHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 8,
  },
  content: {
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
});
