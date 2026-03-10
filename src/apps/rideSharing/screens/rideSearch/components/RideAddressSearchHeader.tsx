import React, { memo, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../../../../../general/theme/theme';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';

type Props = {
  fromValue: string;
  toValue: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  fromPlaceholder: string;
  toPlaceholder: string;
  chooseOnMapLabel: string;
  onFocusFrom?: () => void;
  onFocusTo?: () => void;
  activeField?: 'from' | 'to';
  loadingField?: 'from' | 'to' | null;
  onChooseOnMap?: () => void;
};

function RideAddressSearchHeader({
  fromValue,
  toValue,
  onChangeFrom,
  onChangeTo,
  fromPlaceholder,
  toPlaceholder,
  chooseOnMapLabel,
  onFocusFrom,
  onFocusTo,
  activeField = 'from',
  loadingField = null,
  onChooseOnMap,
}: Props) {
  const { colors, typography } = useTheme();
  const [focusedField, setFocusedField] = useState<'from' | 'to' | null>(activeField);

  useEffect(() => {
    setFocusedField(activeField);
  }, [activeField]);

  return (
    <>
      <View style={styles.inputsBlock}>
        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: colors.surface,
              borderColor: focusedField === 'from' ? colors.primary : colors.border,
              shadowColor: focusedField === 'from' ? colors.primary : colors.shadowColor,
            },
          ]}
        >
          <Icon type="Feather" name="search" size={16} color={colors.iconMuted} />
          <TextInput
            style={[styles.inputText, { color: colors.text, fontSize: typography.size.md2 }]}
            placeholder={fromPlaceholder}
            placeholderTextColor={colors.mutedText}
            value={fromValue}
            onChangeText={onChangeFrom}
            autoFocus={activeField === 'from'}
            onFocus={() => {
              setFocusedField('from');
              onFocusFrom?.();
            }}
            onBlur={() => setFocusedField(null)}
            selectionColor={colors.primary}
          />
          {loadingField === 'from' ? <ActivityIndicator size="small" color={colors.primary} /> : null}
        </View>
        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: colors.surface,
              borderColor: focusedField === 'to' ? colors.primary : colors.border,
              shadowColor: focusedField === 'to' ? colors.primary : colors.shadowColor,
            },
          ]}
        >
          <Icon type="Feather" name="map-pin" size={16} color={colors.iconMuted} />
          <TextInput
            style={[styles.inputText, { color: colors.text, fontSize: typography.size.md2 }]}
            placeholder={toPlaceholder}
            placeholderTextColor={colors.mutedText}
            value={toValue}
            onChangeText={onChangeTo}
            autoFocus={activeField === 'to'}
            onFocus={() => {
              setFocusedField('to');
              onFocusTo?.();
            }}
            onBlur={() => setFocusedField(null)}
            selectionColor={colors.primary}
          />
          {loadingField === 'to' ? <ActivityIndicator size="small" color={colors.primary} /> : null}
        </View>
      </View>

      <Pressable style={styles.chooseOnMapRow} onPress={onChooseOnMap}>
        <Icon type="Feather" name="map" size={16} color={colors.primary} />
        <Text weight="medium" style={{ color: colors.primary }}>
          {chooseOnMapLabel}
        </Text>
      </Pressable>
    </>
  );
}

export default memo(RideAddressSearchHeader);

const styles = StyleSheet.create({
  inputsBlock: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  inputText: {
    flex: 1,
    paddingVertical: 0,
  },
  chooseOnMapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
