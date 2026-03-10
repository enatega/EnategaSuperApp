import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  icon?: string;
  iconLibrary?: 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons' | 'Feather' | 'AntDesign';
  label: string;
  value: string;
  verified?: boolean;
  onPress?: () => void;
  showChevron?: boolean;
  style?: ViewStyle;
};

export default function ProfileInfoItem({
  icon,
  iconLibrary = 'Ionicons',
  label,
  value,
  verified = false,
  onPress,
  showChevron = true,
  style,
}: Props) {
  const { colors } = useTheme();

  const content = (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text variant="subtitle" weight="semiBold" color={colors.text}>
            {label}
          </Text>
          <View style={styles.valueContainer}>
            <Text variant="body" color={colors.mutedText} numberOfLines={1}>
              {value}
            </Text>
            {verified ? (
              <Icon
                type="Ionicons"
                name="checkmark-circle"
                size={18}
                color={colors.success}
                style={styles.verifiedIcon}
              />
            ) : null}
          </View>
        </View>
        {showChevron ? (
          <Icon
            type="Ionicons"
            name="chevron-forward"
            size={20}
            color={colors.mutedText}
          />
        ) : null}
      </View>
      {/* <View style={[styles.divider, { backgroundColor: colors.border }]} /> */}
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
    // paddingHorizontal: 20,
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
  textContainer: {
    flex: 1,
    gap: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  divider: {
    height: 1,
    marginTop: 16,
    marginLeft: 48,
  },
});
