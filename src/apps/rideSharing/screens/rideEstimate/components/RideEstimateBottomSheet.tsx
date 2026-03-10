import React, { memo } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../../general/theme/theme';
import SwipeableBottomSheet from '../../../../../general/components/SwipeableBottomSheet';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';
import Button from '../../../../../general/components/Button';
import type { RideOptionItem } from '../../../components/rideOptions/types';
import RideEstimateSelectedOptionCard from './RideEstimateSelectedOptionCard';
import RideEstimateOptionRow from './RideEstimateOptionRow';

type RideEstimateFareOption = RideOptionItem & {
  fare?: number;
  recommendedFare?: number;
};

type Props = {
  options: RideEstimateFareOption[];
  selectedOptionId: RideOptionItem['id'];
  onSelectOption: (id: RideOptionItem['id']) => void;
  onConfirmRide: () => void;
};

function RideEstimateBottomSheet({
  options,
  selectedOptionId,
  onSelectOption,
  onConfirmRide,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const expandedHeight = Math.min(screenHeight * 0.54, 450);
  const collapsedHeight = 128;
  const selectedOption = options.find((item) => item.id === selectedOptionId) ?? options[0];
  const remainingOptions = options.filter((item) => item.id !== selectedOption?.id);

  return (
    <SwipeableBottomSheet
      expandedHeight={expandedHeight}
      collapsedHeight={collapsedHeight + insets.bottom}
      style={[
        styles.sheet,
        {
          backgroundColor: colors.surface,
          paddingBottom: insets.bottom + 20,
          shadowColor: colors.shadowColor,
        },
      ]}
      handle={<View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />}
      handleContainerStyle={styles.handleContainer}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {selectedOption ? (
          <RideEstimateSelectedOptionCard
            item={selectedOption}
            fare={selectedOption.fare}
            recommendedFare={selectedOption.recommendedFare}
          />
        ) : null}

        <View style={styles.list}>
          {remainingOptions.map((item) => (
            <RideEstimateOptionRow
              key={item.id}
              item={item}
              fare={item.fare}
              onPress={onSelectOption}
            />
          ))}
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Pressable style={styles.footerRow}>
            <View style={styles.footerLabelRow}>
              <Icon type="MaterialCommunityIcons" name="calendar-clock-outline" size={22} color={colors.text} />
              <Text weight="medium">{t('ride_schedule_label')}</Text>
            </View>
            <Icon type="Feather" name="chevron-right" size={20} color={colors.text} />
          </Pressable>

          <Pressable style={styles.footerRow}>
            <View style={styles.footerLabelRow}>
              <Icon type="MaterialCommunityIcons" name="cash-multiple" size={22} color={colors.text} />
              <Text weight="medium">{t('ride_payment_cash')}</Text>
            </View>
            <Icon type="Feather" name="chevron-right" size={20} color={colors.text} />
          </Pressable>

          <Button label={t('ride_find_button')} onPress={onConfirmRide} style={styles.confirmButton} />
        </View>
      </ScrollView>
    </SwipeableBottomSheet>
  );
}

export default memo(RideEstimateBottomSheet);

const styles = StyleSheet.create({
  sheet: {
    paddingTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 999,
  },
  list: {
    paddingTop: 4,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  confirmButton: {
    borderRadius: 6,
    backgroundColor: '#1691BF',
    borderColor: '#1691BF',
  },
});
