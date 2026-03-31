import React, { memo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import FindingRideBidCard from './FindingRideBidCard';
import type { FindingRideBid } from '../types/bids';
import { useRideBidsStore } from '../../../stores/useRideBidsStore';

type Props = {
  onAcceptBid?: (bid: FindingRideBid) => void;
  onDeclineBid?: (bid: FindingRideBid) => void;
  acceptingBidId?: string | null;
  decliningBidId?: string | null;
  isInteractionLocked?: boolean;
};

function FindingRideBidsList({
  onAcceptBid,
  onDeclineBid,
  acceptingBidId,
  decliningBidId,
  isInteractionLocked = false,
}: Props) {
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
            onPressDecline={(bid) => {
              if (onDeclineBid) {
                onDeclineBid(bid);
                return;
              }

              removeBid(bid.id);
            }}
            onPressAccept={onAcceptBid}
            isAccepting={acceptingBidId === item.id}
            isDeclining={decliningBidId === item.id}
            isInteractionLocked={
              isInteractionLocked
              && acceptingBidId !== item.id
              && decliningBidId !== item.id
            }
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
    maxHeight: 420,
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
