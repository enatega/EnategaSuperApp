import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Text from '../Text';
import { useTheme } from '../../theme/theme';
import SupportIssueField from './SupportIssueField';

export type SupportIssueOption = {
  label: string;
  value: string;
};

type Props = {
  options: SupportIssueOption[];
  placeholder: string;
  sheetTitle: string;
  value?: string;
  onChange: (value: string) => void;
};

export default function SupportIssueDropdown({
  options,
  placeholder,
  sheetTitle,
  value,
  onChange,
}: Props) {
  const { colors, typography } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const handleToggle = () => {
    setIsExpanded((current) => !current);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setIsExpanded(false);
  };

  return (
    <View style={styles.container}>
      <SupportIssueField
        hasValue={Boolean(selectedOption)}
        isExpanded={isExpanded}
        label={selectedOption?.label ?? placeholder}
        onPress={handleToggle}
      />

      <Modal
        animationType="fade"
        onRequestClose={handleClose}
        transparent
        visible={isExpanded}
      >
        <Pressable style={styles.overlay} onPress={handleClose}>
          <Pressable>
            <View
              style={[
                styles.menu,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  shadowColor: colors.shadowColor,
                },
              ]}
            >
              <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <Text
                  color={colors.text}
                  style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
                  weight="semiBold"
                >
                  {sheetTitle}
                </Text>
              </View>

              <View style={styles.content}>
                {options.map((option) => {
                  const isSelected = option.value === value;

                  return (
                    <Pressable
                      accessibilityLabel={option.label}
                      accessibilityRole="button"
                      key={option.value}
                      onPress={() => handleSelect(option.value)}
                      style={({ pressed }) => [
                        styles.option,
                        {
                          backgroundColor: isSelected ? colors.surfaceSoft : colors.background,
                          opacity: pressed ? 0.72 : 1,
                        },
                      ]}
                    >
                      <Text
                        color={colors.text}
                        style={[
                          styles.optionLabel,
                          { fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md },
                        ]}
                      >
                        {option.label}
                      </Text>

                      <View
                        style={[
                          styles.radioOuter,
                          { borderColor: isSelected ? colors.primary : colors.border },
                        ]}
                      >
                        {isSelected ? (
                          <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                        ) : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  content: {
    padding: 4,
    width: '100%',
  },
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 4,
    width: '100%',
  },
  menu: {
    borderRadius: 6,
    borderWidth: 1,
    elevation: 4,
    maxWidth: 361,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    width: '100%',
  },
  option: {
    alignItems: 'center',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 8,
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 6,
    width: '100%',
  },
  optionLabel: {
    flex: 1,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(9, 9, 11, 0.3)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  radioInner: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  radioOuter: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
});
