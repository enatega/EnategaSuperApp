import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../../general/components/Icon';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import type { ChainMenuTemplate } from '../../api/types';

type Props = {
  hasError?: boolean;
  isLoading?: boolean;
  items: ChainMenuTemplate[];
  onSelectTemplate: (template: ChainMenuTemplate) => void;
  selectedTemplateId?: string | null;
};

export default function ChainMenuTemplateDropdown({
  hasError = false,
  isLoading = false,
  items,
  onSelectTemplate,
  selectedTemplateId,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('deliveries');
  const [isOpen, setIsOpen] = useState(false);

  const selectedTemplate = useMemo(
    () =>
      items.find((item) => item.id === selectedTemplateId) ??
      items[0] ??
      null,
    [items, selectedTemplateId],
  );

  const isDisabled = isLoading || hasError || items.length === 0;
  const label = isLoading
    ? t('chain_menu_template_loading')
    : hasError
      ? t('chain_menu_template_unavailable')
      : selectedTemplate?.name ?? t('chain_menu_template_empty');

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel={t('chain_menu_template_selector_label')}
        accessibilityRole="button"
        disabled={isDisabled}
        onPress={() => setIsOpen((current) => !current)}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: colors.backgroundTertiary,
            opacity: isDisabled ? 0.7 : pressed ? 0.88 : 1,
          },
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.text} size="small" />
        ) : null}
        <Text
          numberOfLines={1}
          weight="medium"
          style={{
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {label}
        </Text>
        {!isLoading ? (
          <Icon
            color={colors.text}
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={16}
            type="Ionicons"
          />
        ) : null}
      </Pressable>

      {isOpen && items.length > 0 ? (
        <View
          style={[
            styles.menu,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.shadowColor,
            },
          ]}
        >
          {items.map((item) => {
            const isSelected = item.id === selectedTemplate?.id;

            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                onPress={() => {
                  onSelectTemplate(item);
                  setIsOpen(false);
                }}
                style={({ pressed }) => [
                  styles.menuItem,
                  {
                    backgroundColor: isSelected
                      ? colors.backgroundTertiary
                      : pressed
                        ? colors.gray100
                        : colors.surface,
                  },
                ]}
              >
                <Text
                  weight={isSelected ? 'semiBold' : 'medium'}
                  style={{
                    color: colors.text,
                    fontSize: typography.size.sm2,
                    lineHeight: typography.lineHeight.md,
                  }}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 20,
  },
  menu: {
    borderRadius: 12,
    borderWidth: 1,
    elevation: 4,
    marginTop: 8,
    minWidth: 180,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    top: '100%',
  },
  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  trigger: {
    alignItems: 'center',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 7,
    minHeight: 32,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
});
