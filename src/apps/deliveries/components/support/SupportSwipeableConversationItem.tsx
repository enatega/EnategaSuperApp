import React, { useMemo, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import type { ThemeColors } from '../../../../general/theme/colors';
import { useTheme } from '../../../../general/theme/theme';
import SupportConversationDeleteAction, {
  SUPPORT_CONVERSATION_DELETE_ACTION_WIDTH,
} from './SupportConversationDeleteAction';
import SupportConversationItem from './SupportConversationItem';

type Props = {
  avatarTone: keyof ThemeColors;
  avatarLabel: string;
  dateLabel: string;
  message: string;
  name: string;
  onDelete?: () => void;
  onPress?: () => void;
  unreadCount?: number;
};

const OPEN_THRESHOLD = SUPPORT_CONVERSATION_DELETE_ACTION_WIDTH * 0.45;

export default function SupportSwipeableConversationItem({
  avatarTone,
  avatarLabel,
  dateLabel,
  message,
  name,
  onDelete,
  onPress,
  unreadCount,
}: Props) {
  const { colors } = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef(0);

  const animateTo = (toValue: number) => {
    lastOffset.current = toValue;
    Animated.spring(translateX, {
      toValue,
      useNativeDriver: true,
      bounciness: 0,
      speed: 20,
    }).start();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && gestureState.dx < -6,
        onPanResponderGrant: () => {
          translateX.stopAnimation((value) => {
            lastOffset.current = value;
          });
        },
        onPanResponderMove: (_, gestureState) => {
          const nextValue = Math.max(
            -SUPPORT_CONVERSATION_DELETE_ACTION_WIDTH,
            Math.min(0, lastOffset.current + gestureState.dx),
          );

          translateX.setValue(nextValue);
        },
        onPanResponderRelease: (_, gestureState) => {
          const finalValue = lastOffset.current + gestureState.dx;
          const shouldOpen = finalValue < -OPEN_THRESHOLD;

          animateTo(shouldOpen ? -SUPPORT_CONVERSATION_DELETE_ACTION_WIDTH : 0);
        },
        onPanResponderTerminate: () => {
          animateTo(0);
        },
      }),
    [translateX],
  );

  const handleDelete = () => {
    animateTo(0);
    onDelete?.();
  };

  const handlePress = () => {
    if (lastOffset.current !== 0) {
      animateTo(0);
      return;
    }

    onPress?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <SupportConversationDeleteAction onPress={handleDelete} />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            backgroundColor: colors.background,
            transform: [{ translateX }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <SupportConversationItem
          avatarTone={avatarTone}
          avatarLabel={avatarLabel}
          dateLabel={dateLabel}
          message={message}
          name={name}
          onPress={handlePress}
          unreadCount={unreadCount}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    alignItems: 'flex-end',
    bottom: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: SUPPORT_CONVERSATION_DELETE_ACTION_WIDTH,
  },
  container: {
    overflow: 'hidden',
    width: '100%',
  },
  content: {
    width: '100%',
    zIndex: 1,
  },
});
