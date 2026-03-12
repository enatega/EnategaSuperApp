import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';
import type { AddressType } from '../../api/addressService';

type TypeOption = {
  value: AddressType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type Props = {
  selected: AddressType;
  onSelect: (type: AddressType) => void;
  labels: {
    home: string;
    apartment: string;
    office: string;
    other: string;
  };
};

const OPTIONS: Array<{ value: AddressType; icon: keyof typeof Ionicons.glyphMap; key: keyof Props['labels'] }> = [
  { value: 'HOME', icon: 'home-outline', key: 'home' },
  { value: 'APARTMENT', icon: 'business-outline', key: 'apartment' },
  { value: 'OFFICE', icon: 'briefcase-outline', key: 'office' },
  { value: 'OTHER', icon: 'location-outline', key: 'other' },
];

function AddressTypeSelector({ selected, onSelect, labels }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {OPTIONS.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={labels[opt.key]}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.primary : colors.backgroundTertiary,
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
          >
            <Ionicons
              name={opt.icon}
              size={16}
              color={isSelected ? colors.white : colors.text}
            />
            <Text
              variant="caption"
              weight={isSelected ? 'semiBold' : 'medium'}
              color={isSelected ? colors.white : colors.text}
            >
              {labels[opt.key]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default memo(AddressTypeSelector);

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
  },
});
