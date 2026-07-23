import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { AppointmentStoreService } from '../../api/types';
import { getServiceMeta } from '../details/detailHelpers';
import AppointmentServicePrice from './AppointmentServicePrice';

type Props = {
  item: AppointmentStoreService;
  onPress: (service: AppointmentStoreService) => void;
};

export default function AppointmentServicesRow({ item, onPress }: Props) {
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
        accessibilityRole="button"
        onPress={() => onPress(item)}
        style={[
          styles.addButton,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <Icon color={colors.text} name="plus" size={20} type="Feather" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
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
    minHeight: 88,
    paddingVertical: 14,
  },
});
