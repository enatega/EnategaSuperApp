import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../Skeleton';

type Props = {
  hasFeatureCard?: boolean;
};

export default function ProfileSkeleton({
  hasFeatureCard = false,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Skeleton width={140} height={24} borderRadius={6} />
          <Skeleton width={100} height={16} borderRadius={4} />
        </View>
        <Skeleton width={56} height={56} borderRadius={28} />
      </View>

      {hasFeatureCard ? (
        <View style={styles.featureCardWrapper}>
          <Skeleton width="100%" height={156} borderRadius={12} />
        </View>
      ) : null}

      <View style={styles.menuWrapper}>
        <Skeleton width="100%" height={280} borderRadius={8} />
      </View>
      <View style={styles.menuWrapper}>
        <Skeleton width="100%" height={160} borderRadius={8} />
      </View>
      <View style={styles.menuWrapper}>
        <Skeleton width="100%" height={56} borderRadius={8} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingTop: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerText: {
    gap: 8,
  },
  menuWrapper: {
    paddingHorizontal: 16,
  },
  featureCardWrapper: {
    paddingHorizontal: 16,
  },
});
