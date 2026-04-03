import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  selectedTip: number;
  onSelectTip: (amount: number) => void;
};

const TIP_OPTIONS = [5, 10, 20, 50] as const;

export default function CheckoutTipSection({
  selectedTip,
  onSelectTip,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text
          weight="extraBold"
          style={{
            color: colors.text,
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
          }}
        >
          {t('checkout_tip_title')}
        </Text>

        <Text
          style={{
            color: colors.mutedText,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {t('checkout_tip_description')}
        </Text>
      </View>

      <View style={styles.optionsRow}>
        {TIP_OPTIONS.map((amount) => {
          const isSelected = selectedTip === amount;

          return (
            <Pressable
              key={amount}
              accessibilityRole="button"
              onPress={() => onSelectTip(isSelected ? 0 : amount)}
              style={[
                styles.optionButton,
                {
                  backgroundColor: isSelected ? colors.blue50 : colors.surface,
                  borderColor: isSelected ? colors.blue800 : colors.border,
                },
              ]}
            >
              <Text
                weight="medium"
                style={{
                  color: colors.text,
                  fontSize: typography.size.sm2,
                  lineHeight: typography.lineHeight.md,
                }}
              >
                {`$ ${amount}`}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          accessibilityRole="button"
          onPress={() => onSelectTip(0)}
          style={[
            styles.optionButton,
            {
              backgroundColor: selectedTip === 0 ? colors.blue50 : colors.surface,
              borderColor: selectedTip === 0 ? colors.blue800 : colors.border,
            },
          ]}
        >
          <Ionicons color={colors.text} name="add" size={14} />
          <Text
            weight="medium"
            style={{
              color: colors.text,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            }}
          >
            {t('checkout_tip_custom')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
  optionButton: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: 32,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  section: {
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
