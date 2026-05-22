import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomSheetHandle from '../../../../../general/components/BottomSheetHandle';
import Icon from '../../../../../general/components/Icon';
import Text from '../../../../../general/components/Text';
import SwipeableBottomSheet from '../../../../../general/components/SwipeableBottomSheet';
import { useTheme } from '../../../../../general/theme/theme';
import type { HomeVisitsContractType } from '../../../types/teamSchedule';

type Option = {
  id: HomeVisitsContractType;
  label: string;
};

type Props = {
  visible: boolean;
  title: string;
  selectedType: HomeVisitsContractType;
  options: Option[];
  onClose: () => void;
  onSelect: (value: HomeVisitsContractType) => void;
};

function ContractTypeSheet({ onClose, onSelect, options, selectedType, title, visible }: Props) {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <SwipeableBottomSheet
        collapsedHeight={0}
        expandedHeight={260 + Math.max(insets.bottom, 16)}
        handle={<BottomSheetHandle color={colors.border} />}
        modal
        onCollapsed={onClose}
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surface,
            paddingBottom: Math.max(insets.bottom, 16),
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View style={styles.header}>
          <Text
            weight="extraBold"
            style={{ color: colors.text, fontSize: typography.size.lg, lineHeight: typography.lineHeight.md }}
          >
            {title}
          </Text>
        </View>

        <View style={styles.optionsWrap}>
          {options.map((option) => {
            const isSelected = option.id === selectedType;
            return (
              <Pressable
                key={option.id}
                onPress={() => {
                  onSelect(option.id);
                  onClose();
                }}
                style={[styles.option, { borderColor: colors.border }]}
              >
                <Text
                  weight={isSelected ? 'semiBold' : 'regular'}
                  style={{ color: colors.text, flex: 1, fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
                >
                  {option.label}
                </Text>
                {isSelected ? <Icon type="Feather" name="check" size={16} color={colors.warning} /> : null}
              </Pressable>
            );
          })}
        </View>
      </SwipeableBottomSheet>
    </View>
  );
}

export default memo(ContractTypeSheet);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  option: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionsWrap: {
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9, 9, 11, 0.3)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 8,
  },
});
