import React, { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../../theme/theme';
import Icon from '../../components/Icon';
import Text from '../../components/Text';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  chooseOnMapLabel: string;
  onChooseOnMap: () => void;
  isLoading?: boolean;
};

function AddressSearchInput({
  value,
  onChangeText,
  placeholder,
  chooseOnMapLabel,
  onChooseOnMap,
  isLoading = false,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Icon type="Feather" name="search" size={16} color={colors.iconMuted} />
        <TextInput
          style={[styles.input, { color: colors.text, fontSize: typography.size.md2 }]}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedText}
          value={value}
          onChangeText={onChangeText}
          autoFocus
          returnKeyType="search"
          accessibilityLabel={placeholder}
        />
        {isLoading && <ActivityIndicator size="small" color={colors.primary} />}
      </View>
      <Pressable
        onPress={onChooseOnMap}
        accessibilityRole="button"
        accessibilityLabel={chooseOnMapLabel}
        style={({ pressed }) => [
          styles.mapButton,
          { backgroundColor: colors.backgroundTertiary, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <Icon type="Ionicons" name="map-outline" size={16} color={colors.primary} />
        <Text variant="caption" weight="semiBold" color={colors.primary}>
          {chooseOnMapLabel}
        </Text>
      </Pressable>
    </View>
  );
}

export default memo(AddressSearchInput);

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
  inputWrapper: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: 44,
    paddingHorizontal: 12,
  },
  mapButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
});
