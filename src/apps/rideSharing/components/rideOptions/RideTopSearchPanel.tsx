import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Pressable } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Icon from '../../../../general/components/Icon';
import type { CachedAddress } from './types';

type Props = {
  onOpenSidebar: () => void;
  onSelectAddress: (address?: CachedAddress) => void;
};

export default function RideTopSearchPanel({ onOpenSidebar, onSelectAddress }: Props) {
  void onSelectAddress;
  const { colors } = useTheme();

  return (
    <View style={[styles.rideTopView, { backgroundColor: 'transparent' }]}>
      <View style={styles.searchRow}>
        <Pressable
          onPress={onOpenSidebar}
          style={[
            styles.menuButton,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
              shadowColor: colors.shadowColor,
            },
          ]}
        >
          <Icon type="Feather" name="menu" size={18} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rideTopView: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    gap: 0,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});
