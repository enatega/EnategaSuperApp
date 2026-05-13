import React from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import { useTranslation } from 'react-i18next';

type QuickAction = {
  id: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  labelKey: string;
};

const GO_ANYWHERE_ACTIONS: QuickAction[] = [
  { id: 'ride', icon: 'car-outline', labelKey: 'multi_vendor_home_quick_ride' },
  { id: 'scheduled', icon: 'calendar-month-outline', labelKey: 'multi_vendor_home_quick_scheduled' },
  { id: 'hourly', icon: 'clock-outline', labelKey: 'multi_vendor_home_quick_hourly' },
  { id: 'courier', icon: 'truck-fast-outline', labelKey: 'multi_vendor_home_quick_courier' },
];

const DELIVERY_ACTIONS: QuickAction[] = [
  { id: 'food', icon: 'food-outline', labelKey: 'multi_vendor_home_delivery_food' },
  { id: 'groceries', icon: 'cart-outline', labelKey: 'multi_vendor_home_delivery_groceries' },
];

export default function AllInOneQuickActions() {
  const { t } = useTranslation('deliveries');
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]} weight="bold">
        {t('multi_vendor_home_go_anywhere')}
      </Text>

      <View style={styles.quickRow}>
        {GO_ANYWHERE_ACTIONS.map((action) => (
          <View key={action.id} style={styles.quickItem}>
            <View style={[styles.quickIconBox, { backgroundColor: colors.surfaceSoft }]}>
              <MaterialCommunityIcons name={action.icon} size={24} color={colors.primary} />
            </View>
            <Text style={[styles.quickLabel, { color: colors.text }]} weight="semiBold">
              {t(action.labelKey)}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: colors.text }]} weight="bold">
        {t('multi_vendor_home_get_anything')}
      </Text>

      <View style={styles.deliveryRow}>
        {DELIVERY_ACTIONS.map((action) => (
          <View key={action.id} style={[styles.deliveryCard, { backgroundColor: colors.blue50 }]}>
            <View style={styles.deliveryTextWrap}>
              <Text style={[styles.deliveryTitle, { color: colors.text }]} weight="semiBold">
                {t(action.labelKey)}
              </Text>
              <Text style={[styles.deliverySubtitle, { color: colors.mutedText }]}>
                {t('multi_vendor_home_delivery_subtitle')}
              </Text>
            </View>
            <MaterialCommunityIcons name={action.icon} size={30} color={colors.primary} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 28,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickItem: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  quickIconBox: {
    alignItems: 'center',
    borderRadius: 16,
    height: 72,
    justifyContent: 'center',
    width: '100%',
  },
  quickLabel: {
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
  },
  deliveryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  deliveryCard: {
    alignItems: 'center',
    borderRadius: 16,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 78,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  deliveryTextWrap: {
    flex: 1,
    gap: 2,
    paddingRight: 8,
  },
  deliveryTitle: {
    fontSize: 24,
    lineHeight: 26,
  },
  deliverySubtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
});
