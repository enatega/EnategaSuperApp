import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { AppointmentStoreService } from '../../api/types';
import { getServiceMeta } from '../details/detailHelpers';
import AppointmentServicePrice from './AppointmentServicePrice';

type Props = {
  isSelected: boolean;
  item: AppointmentStoreService;
  onPress: (service: AppointmentStoreService) => void;
};

export default function AppointmentServiceSelectionRow({
  isSelected,
  item,
  onPress,
}: Props) {
  const { colors, typography } = useTheme();
  const metaLabel = getServiceMeta(item);

  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={styles.content}>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.size.md,
            lineHeight: typography.lineHeight.md,
          }}
          weight="semiBold"
        >
          {item.name}
        </Text>

        <View style={styles.metaRow}>
          <AppointmentServicePrice
            dealName={item.deal?.name}
            originalPrice={item.originalPrice}
            price={item.price}
          />
          <Text style={{ color: colors.mutedText, fontSize: typography.size.sm }}>
            {metaLabel}
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityLabel={item.name}
        accessibilityRole="button"
        onPress={() => onPress(item)}
        style={[
          styles.actionButton,
          {
            backgroundColor: isSelected ? colors.blue50 : colors.surface,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
      >
        <Icon
          color={isSelected ? colors.primary : colors.text}
          name={isSelected ? 'checkmark' : 'add'}
          size={24}
          type="Ionicons"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  content: {
    flex: 1,
    gap: 8,
    paddingRight: 12,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  row: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
});
