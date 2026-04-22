import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Text from '../Text';
import { useTheme } from '../../theme/theme';

type Props = {
  checkedItems: boolean[];
  onToggle: (index: number) => void;
};

export default function DeleteAccountConfirmStep({ checkedItems, onToggle }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('general');

  const confirmItems: string[] = [
    t('delete_account_confirm_item_orders'),
    t('delete_account_confirm_item_marketplace'),
  ];

  return (
    <View style={styles.container}>
      <Text variant="caption" color={colors.mutedText} style={styles.label}>
        {t('delete_account_step_label')}
      </Text>
      <Text variant="title" weight="bold" color={colors.text} style={styles.heading}>
        {t('delete_account_confirm_heading')}
      </Text>
      <Text variant="body" color={colors.mutedText} style={styles.description}>
        {t('delete_account_confirm_description')}
      </Text>

      <View style={styles.items}>
        {confirmItems.map((item, index) => {
          const isChecked = checkedItems[index] ?? false;
          return (
            <Pressable
              key={item}
              onPress={() => onToggle(index)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isChecked }}
              accessibilityLabel={item}
              style={[
                styles.checkRow,
                { borderColor: colors.border, backgroundColor: colors.surface },
              ]}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: isChecked ? colors.primary : 'transparent',
                    borderColor: isChecked ? colors.primary : colors.border,
                  },
                ]}
              >
                {isChecked && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
              <Text variant="body" color={colors.text} style={styles.itemText}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  checkRow: {
    alignItems: 'flex-start',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  checkbox: {
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    height: 22,
    justifyContent: 'center',
    marginTop: 1,
    width: 22,
  },
  container: {
    gap: 4,
  },
  description: {
    marginBottom: 8,
    marginTop: 4,
  },
  heading: {
    marginTop: 4,
  },
  itemText: {
    flex: 1,
  },
  items: {
    gap: 12,
    marginTop: 8,
  },
  label: {
    marginBottom: 2,
  },
});
