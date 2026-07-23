import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../general/components/Icon';
import SearchInput from '../../../../general/components/search/SearchInput';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  onBackPress: () => void;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
};

export default function AppointmentsSearchHeader({
  onBackPress,
  onChangeText,
  placeholder,
  value,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('appointments');

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityLabel={t('details_action_back')}
        accessibilityRole="button"
        onPress={onBackPress}
        style={({ pressed }) => [
          styles.backButton,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: pressed ? 0.82 : 1,
          },
        ]}
      >
        <Icon color={colors.text} name="arrow-back" size={24} type="Ionicons" />
      </Pressable>

      <SearchInput
        autoFocus
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.searchInput}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    width: 'auto',
  },
});
