import React, { memo, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import { RideCategory } from '../../utils/rideOptions';
import { RideOptionItem } from './types';
import RideOptionCard from './RideOptionCard';

type Props = {
  rideOptions: RideOptionItem[];
  selectedCategory: RideCategory | null;
  onSelectCategory: (category: RideCategory) => void;
  onSearchPress: () => void;
  searchDisabled?: boolean;
  hideOptionsRow?: boolean;
};

function RideOptionsHeader({
  rideOptions,
  selectedCategory,
  onSelectCategory,
  onSearchPress,
  searchDisabled = false,
  hideOptionsRow = false,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');

  const optionRows = useMemo(() => {
    if (rideOptions.length === 0) {
      return [];
    }

    if (rideOptions.length <= 3) {
      return [rideOptions];
    }

    const firstRowSize = Math.ceil(rideOptions.length / 2);
    const rows: RideOptionItem[][] = [
      rideOptions.slice(0, firstRowSize),
      rideOptions.slice(firstRowSize),
    ];

    return rows;
  }, [rideOptions]);

  const renderOptionGrid = useMemo(
    () =>
      optionRows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.optionsRow}>
          {row.map((item) => (
            <View key={item.id} style={styles.optionCell}>
              <RideOptionCard
                item={item}
                isActive={item.id === selectedCategory}
                onPress={onSelectCategory}
                containerStyle={styles.optionCardContainer}
              />
            </View>
          ))}
        </View>
      )),
    [onSelectCategory, optionRows, selectedCategory],
  );

  return (
    <>
      {hideOptionsRow ? null : (
        <View style={styles.optionsGrid}>{renderOptionGrid}</View>
      )}
      <Pressable
        onPress={() => onSearchPress()}
        disabled={searchDisabled}
        style={[
          styles.searchInput,
          {
            borderColor: colors.border,
            shadowColor: colors.shadowColor,
            backgroundColor: colors.surface,
            opacity: searchDisabled ? 0.6 : 1,
          },
        ]}
      >
        <Icon type="Feather" name="search" size={16} color={colors.iconMuted} />
        <Text style={{ color: colors.mutedText }}>
          {t('ride_search_placeholder')}
        </Text>
      </Pressable>
    </>
  );
}

export default memo(RideOptionsHeader);

const styles = StyleSheet.create({
  optionsGrid: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 8,
    gap: 8,
  },
  optionCell: {
    flex: 1,
    minWidth: 0,
  },
  optionCardContainer: {
    minHeight: 86,
  },
  searchInput: {
    marginTop: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});
