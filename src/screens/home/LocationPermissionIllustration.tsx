import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../general/theme/theme';
import Icon from '../../general/components/Icon';

export default function LocationPermissionIllustration() {
  const { colors } = useTheme();

  return (
    <View style={styles.root}>
      <View style={[styles.orbital, styles.orbitalLarge, { borderColor: colors.blue100 }]} />
      <View style={[styles.orbital, styles.orbitalSmall, { borderColor: colors.blue100 }]} />
      <View style={[styles.planet, { backgroundColor: colors.blue50 }]}>
        <Icon type="MaterialIcons" name="public" size={52} color={colors.blue800} />
      </View>
      <View style={[styles.pin, { backgroundColor: colors.white }]}>
        <Icon type="Ionicons" name="location-sharp" size={30} color={colors.text} />
      </View>
      <View style={styles.plane}>
        <Icon type="Ionicons" name="airplane" size={24} color={colors.text} />
      </View>
      <View style={styles.ship}>
        <Icon type="MaterialCommunityIcons" name="ferry" size={28} color={colors.text} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbital: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.9,
  },
  orbitalLarge: {
    width: 132,
    height: 70,
    borderRadius: 999,
    transform: [{ rotate: '20deg' }],
  },
  orbitalSmall: {
    width: 122,
    height: 62,
    borderRadius: 999,
    transform: [{ rotate: '-20deg' }],
  },
  planet: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    position: 'absolute',
    top: 14,
    left: 23,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  plane: {
    position: 'absolute',
    top: 10,
    right: 20,
    transform: [{ rotate: '15deg' }],
  },
  ship: {
    position: 'absolute',
    bottom: 12,
    left: 18,
  },
});
