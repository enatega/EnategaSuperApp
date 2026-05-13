import {
  BottomTabBar,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeliveriesFloatingCartButton from './DeliveriesFloatingCartButton';

export const DELIVERIES_TAB_BAR_HEIGHT = 72;
export const DELIVERIES_TAB_BAR_SAFE_PADDING = 8;

const FLOATING_BUTTON_RIGHT_OFFSET = 16;

function DeliveriesTabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const safeBottom = Math.max(insets.bottom, DELIVERIES_TAB_BAR_SAFE_PADDING);

  return (
    <View style={styles.container}>
      <BottomTabBar {...props} />
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <DeliveriesFloatingCartButton
          style={[
            styles.floatingButton,
            {
              bottom: DELIVERIES_TAB_BAR_HEIGHT + safeBottom + 8,
              right: FLOATING_BUTTON_RIGHT_OFFSET,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  floatingButton: {
    position: 'absolute',
  },
});

export default memo(DeliveriesTabBar);
