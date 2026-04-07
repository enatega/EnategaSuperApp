import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  amounts: number[];
  currency: string;
  selectedAmount: number | null;
  onSelect: (amount: number) => void;
};

export default function QuickAmountChips({ amounts, currency, selectedAmount, onSelect }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {amounts.map((amount) => {
        const isSelected = selectedAmount === amount;
        return (
          <Pressable
            key={amount}
            onPress={() => onSelect(amount)}
            style={[
              styles.chip,
              isSelected
                ? { backgroundColor: colors.findingRidePrimarySoft, borderColor: colors.findingRidePrimary }
                : { borderColor: colors.border },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
          >
            <Text
              variant="caption"
              weight="medium"
              color={isSelected ? colors.findingRidePrimary : colors.text}
              style={styles.chipText}
            >
              {currency} {amount.toFixed(2)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  chip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
