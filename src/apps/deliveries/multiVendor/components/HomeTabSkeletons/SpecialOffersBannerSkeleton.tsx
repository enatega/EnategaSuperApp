import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../../general/components/Skeleton';

export default function SpecialOffersBannerSkeleton() {
  return (
    <View style={styles.wrapper}>
      <Skeleton borderRadius={18} height={206} width="100%">
        <View style={styles.content}>
          <Skeleton borderRadius={6} height={14} width={140} />
          <Skeleton borderRadius={8} height={28} width="68%" />
          <Skeleton borderRadius={7} height={16} width="82%" />
          <Skeleton borderRadius={7} height={16} width="54%" />
        </View>
      </Skeleton>

      <View style={styles.dots}>
        <Skeleton borderRadius={999} height={8} width={24} />
        <Skeleton borderRadius={999} height={8} width={8} />
        <Skeleton borderRadius={999} height={8} width={8} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
  },
  content: {
    gap: 12,
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  dots: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: 10,
  },
});
