import {
  BottomTabBar,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import DeliveriesFloatingCartButton from './DeliveriesFloatingCartButton';

export const DELIVERIES_TAB_BAR_HEIGHT = 82;

const FLOATING_BUTTON_RIGHT_OFFSET = 16;
const FLOATING_BUTTON_BOTTOM_OFFSET = 90;

function DeliveriesTabBar(props: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      <BottomTabBar {...props} />
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <DeliveriesFloatingCartButton
          style={[
            styles.floatingButton,
            {
              bottom: FLOATING_BUTTON_BOTTOM_OFFSET,
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
