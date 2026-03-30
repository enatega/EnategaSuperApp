import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from '../../../../general/components/Skeleton';

export default function SupportConversationsSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Skeleton width={96} height={24} borderRadius={6} style={styles.sectionTitle} />
        {Array.from({ length: 2 }).map((_, index) => (
          <ConversationRowSkeleton key={`recent-${index}`} />
        ))}
      </View>

      <View style={styles.section}>
        <Skeleton width={72} height={24} borderRadius={6} style={styles.sectionTitle} />
        {Array.from({ length: 3 }).map((_, index) => (
          <ConversationRowSkeleton key={`past-${index}`} />
        ))}
      </View>
    </View>
  );
}

function ConversationRowSkeleton() {
  return (
    <View style={styles.row}>
      <Skeleton width={48} height={48} borderRadius={24} />

      <View style={styles.content}>
        <Skeleton width="58%" height={15} borderRadius={4} />
        <Skeleton width="76%" height={12} borderRadius={4} />
      </View>

      <View style={styles.meta}>
        <Skeleton width={44} height={12} borderRadius={4} />
        <Skeleton width={20} height={18} borderRadius={4} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 28,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  meta: {
    alignItems: 'flex-end',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  section: {
    width: '100%',
  },
  sectionTitle: {
    marginBottom: 8,
    marginLeft: 16,
    marginTop: 8,
  },
});
