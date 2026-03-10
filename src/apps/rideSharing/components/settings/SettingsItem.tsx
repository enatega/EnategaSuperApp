import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  icon?: string;
  iconLibrary?: 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons' | 'Feather' | 'AntDesign';
  title: string;
  value?: string;
  showChevron?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function SettingsItem({
  icon,
  iconLibrary = 'Ionicons',
  title,
  value,
  showChevron = true,
  isSelected,
  onPress,
  style,
}: Props) {
  const { colors } = useTheme();

  const content = (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.leftSlot}>
          {icon ? (
            <Icon
              type={iconLibrary}
              name={icon}
              size={24}
              color={colors.text}
              style={styles.icon}
            />
          ) : null}
          <Text variant="subtitle" weight="semiBold" color={colors.text}>
            {title}
          </Text>
        </View>

        <View style={styles.rightSlot}>
          {value ? (
            <Text variant="body" color={colors.mutedText} style={styles.valueText}>
              {value}
            </Text>
          ) : null}

          {isSelected !== undefined ? (
            <View
              style={[
                styles.radioOuter,
                { borderColor: isSelected ? colors.primary : colors.mutedText },
              ]}
            >
              {isSelected && (
                <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
              )}
            </View>
          ) : showChevron ? (
            <Icon
              type="Ionicons"
              name="chevron-forward"
              size={20}
              color={colors.mutedText}
            />
          ) : null}
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.pressable,
          {
            backgroundColor: pressed ? colors.cardSoft : 'transparent',
          },
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  pressable: {
    borderRadius: 12,
    marginHorizontal: -8,
    paddingHorizontal: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  icon: {
    width: 24,
    textAlign: 'center',
  },
  rightSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueText: {
    maxWidth: 150,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
