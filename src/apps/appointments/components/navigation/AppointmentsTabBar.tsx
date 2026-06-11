import {
  BottomTabBar,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import React, { memo } from 'react';

function AppointmentsTabBar(props: BottomTabBarProps) {
  return <BottomTabBar {...props} />;
}

export default memo(AppointmentsTabBar);
