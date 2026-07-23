import {
  BottomTabBar,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppointmentsFloatingCartButton from '../cart/AppointmentsFloatingCartButton';
import {
  DELIVERIES_TAB_BAR_HEIGHT,
  DELIVERIES_TAB_BAR_SAFE_PADDING,
} from '../../../deliveries/components/navigation/DeliveriesTabBar';

function AppointmentsTabBar(props: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const safeBottom = Math.max(insets.bottom, DELIVERIES_TAB_BAR_SAFE_PADDING);

  return (
    <View style={styles.container}>
      <BottomTabBar {...props} />
      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <AppointmentsFloatingCartButton
          style={[
            styles.floatingButton,
            {
              bottom: DELIVERIES_TAB_BAR_HEIGHT + safeBottom + 8,
              right: 16,
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

export default memo(AppointmentsTabBar);
