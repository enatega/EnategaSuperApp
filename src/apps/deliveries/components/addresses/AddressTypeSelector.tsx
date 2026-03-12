import React, { memo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';
import type { AddressType } from '../../api/addressService';

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

const OPTIONS: Array<{
  value: AddressType;
  icon: keyof typeof Ionicons.glyphMap;
  key: keyof Props['labels'];
}> = [
  { value: 'HOME', icon: 'home-outline', key: 'home' },
  { value: 'APARTMENT', icon: 'business-outline', key: 'apartment' },
  { value: 'OFFICE', icon: 'briefcase-outline', key: 'office' },
  { value: 'OTHER', icon: 'location-outline', key: 'other' },
];

function AddressTypeSelector({ selected, onSelect, labels }: Props) {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = OPTIONS.find((o) => o.value === selected) ?? OPTIONS[0];

  return (
    <View style={[styles.wrapper, { zIndex: 10 }]}>
      <Pressable
        onPress={() => setIsOpen((prev) => !prev)}
        accessibilityRole="button"
        accessibilityLabel={labels[selectedOption.key]}
        style={[
          styles.trigger,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.triggerLeft}>
          <Ionicons name={selectedOption.icon} size={18} color={colors.text} />
          <Text weight="regular" color={colors.text} style={styles.triggerText}>
            {labels[selectedOption.key]}
          </Text>
        </View>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.mutedText}
        />
      </Pressable>

      {isOpen && (
        <View
          style={[
            styles.dropdown,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => {
                  onSelect(opt.value);
                  setIsOpen(false);
                }}
                accessibilityRole="button"
                accessibilityLabel={labels[opt.key]}
                style={({ pressed }) => [
                  styles.dropdownItem,
                  {
                    backgroundColor: pressed
                      ? colors.backgroundTertiary
                      : colors.surface,
                  },
                ]}
              >
                <Ionicons name={opt.icon} size={18} color={colors.text} />
                <Text
                  weight={isSelected ? 'semiBold' : 'regular'}
                  color={colors.text}
                  style={styles.dropdownItemText}
                >
                  {labels[opt.key]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default memo(AddressTypeSelector);

const styles = StyleSheet.create({
  dropdown: {
    borderRadius: 6,
    borderWidth: 1,
    left: 16,
    marginTop: 4,
    position: 'absolute',
    right: 16,
    top: '100%',
    zIndex: 30,
  },
  dropdownItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  trigger: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  triggerLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  triggerText: {
    fontSize: 16,
  },
  wrapper: {
    position: 'relative',
  },
});
