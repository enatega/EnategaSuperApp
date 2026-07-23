import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from '../../../../general/components/Icon';
import Skeleton from '../../../../general/components/Skeleton';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { AppointmentSearchSuggestion } from '../../api/types';

type Props = {
  addressFallback: string;
  addressPrefix: string;
  isLoading: boolean;
  onAddressPress: () => void;
  onSuggestionPress: (suggestion: AppointmentSearchSuggestion) => void;
  selectedAddressLabel?: string;
  suggestions: AppointmentSearchSuggestion[];
};

export default function AppointmentsSearchSuggestions({
  addressFallback,
  addressPrefix,
  isLoading,
  onAddressPress,
  onSuggestionPress,
  selectedAddressLabel,
  suggestions,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={onAddressPress}
        style={styles.addressRow}
      >
        <Text
          style={[
            styles.addressText,
            { color: colors.mutedText, fontSize: typography.size.xs2 },
          ]}
        >
          {addressPrefix}
        </Text>
        <Text
          numberOfLines={1}
          style={[
            styles.addressLabel,
            styles.addressText,
            { color: colors.text, fontSize: typography.size.xs2 },
          ]}
          weight="medium"
        >
          {selectedAddressLabel ?? addressFallback}
        </Text>
        <Icon color={colors.text} name="chevron-down" size={16} type="Ionicons" />
      </Pressable>

      <View style={styles.chips}>
        {isLoading
          ? Array.from({ length: 8 }, (_, index) => (
              <Skeleton
                borderRadius={999}
                height={32}
                key={`search-chip-${index}`}
                width={index % 3 === 0 ? 96 : index % 3 === 1 ? 74 : 118}
              />
            ))
          : suggestions.map((suggestion) => (
              <Pressable
                accessibilityRole="button"
                key={suggestion.id}
                onPress={() => onSuggestionPress(suggestion)}
                style={({ pressed }) => [
                  styles.chip,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.76 : 1,
                  },
                ]}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: typography.size.sm2,
                    lineHeight: 22,
                  }}
                  weight="medium"
                >
                  {suggestion.name}
                </Text>
              </Pressable>
            ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addressLabel: {
    flex: 1,
  },
  addressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingBottom: 4,
    paddingTop: 8,
  },
  addressText: {
    lineHeight: 18,
  },
  chip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  container: {
    gap: 12,
  },
});
