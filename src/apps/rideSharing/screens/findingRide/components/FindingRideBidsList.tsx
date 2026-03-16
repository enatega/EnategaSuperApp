import React, { memo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import FindingRideBidCard from './FindingRideBidCard';
import type { FindingRideBid } from '../types/bids';
import { useRideBidsStore } from '../../../stores/useRideBidsStore';

type Props = {
  onAcceptBid?: (bid: FindingRideBid) => void;
};

function FindingRideBidsList({ onAcceptBid }: Props) {
  const bids = useRideBidsStore((state) => state.bids);
  const removeBid = useRideBidsStore((state) => state.removeBid);

  if (!bids.length) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.container}>
      <FlatList
        data={bids}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FindingRideBidCard
            bid={item}
            onPressDecline={(bid) => removeBid(bid.id)}
            onPressAccept={onAcceptBid}
          />
        )}
        contentContainerStyle={styles.contentContainer}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        inverted
      />
    </View>
  );
}

export default memo(FindingRideBidsList);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 340,
  },
  list: {
    borderRadius: 24,
  },
  contentContainer: {
    paddingVertical: 2,
  },
  separator: {
    height: 10,
  },
});
