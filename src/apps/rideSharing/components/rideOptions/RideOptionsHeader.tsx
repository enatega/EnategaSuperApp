import React, { memo, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
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

  const fixedColumnItems = useMemo(() => rideOptions.slice(0, 2), [rideOptions]);
  const scrollItems = useMemo(() => rideOptions.slice(2), [rideOptions]);

  const optionLayout = useMemo(() => {
    if (rideOptions.length === 0) {
      return null;
    }

    return (
      <View style={styles.optionsLayout}>
        <View style={styles.fixedRow}>
          {fixedColumnItems.map((item) => (
            <View key={item.id} style={styles.fixedRowItem}>
              <RideOptionCard
                item={item}
                isActive={item.id === selectedCategory}
                onPress={onSelectCategory}
                containerStyle={styles.optionCardContainer}
              />
            </View>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollRowContainer}
        >
          {scrollItems.map((item) => (
            <View key={item.id} style={styles.scrollRowItem}>
              <RideOptionCard
                item={item}
                isActive={item.id === selectedCategory}
                onPress={onSelectCategory}
                containerStyle={styles.optionCardContainer}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }, [fixedColumnItems, onSelectCategory, rideOptions.length, scrollItems, selectedCategory]);

  return (
    <>
      {hideOptionsRow ? null : (
        <View style={styles.optionsGrid}>{optionLayout}</View>
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
  optionsLayout: {
    flexDirection: 'column',
    gap: 8,
  },
  fixedRow: {
    flexDirection: 'row',
    gap: 8,
  },
  fixedRowItem: {
    flex: 1,
    minWidth: 0,
  },
  scrollRowContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 12,
  },
  scrollRowItem: {
    width: 110,
    flexShrink: 0,
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
