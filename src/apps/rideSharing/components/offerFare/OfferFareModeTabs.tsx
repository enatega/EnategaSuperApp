import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { RideOfferMode } from '../../utils/rideOffer';

type Props = {
  activeMode: RideOfferMode;
  onChange: (mode: RideOfferMode) => void;
  standardLabel: string;
  hourlyLabel: string;
};

function OfferFareModeTabs({
  activeMode,
  onChange,
  standardLabel,
  hourlyLabel,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundTertiary }]}>
      {([
        { mode: 'standard', label: standardLabel },
        { mode: 'hourly', label: hourlyLabel },
      ] as const).map((item) => {
        const isActive = item.mode === activeMode;

        return (
          <Pressable
            key={item.mode}
            onPress={() => onChange(item.mode)}
            style={[
              styles.tabButton,
              isActive
                ? {
                    backgroundColor: colors.surface,
                    shadowColor: colors.shadowColor,
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                    shadowOffset: { width: 0, height: 1 },
                    elevation: 2,
                  }
                : null,
            ]}
          >
            <Text
              weight="medium"
              color={isActive ? colors.text : colors.mutedText}
              style={styles.tabLabel}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default memo(OfferFareModeTabs);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 6,
  },
  tabButton: {
    flex: 1,
    minHeight: 34,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 14,
    lineHeight: 22,
  },
});
