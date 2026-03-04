import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Text from '../../../general/components/Text';
import Icon from '../../../general/components/Icon';
import { useTheme } from '../../../general/theme/theme';

type Props = {
  icon: string;
  iconLibrary?: 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons' | 'Feather' | 'AntDesign';
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showChevron?: boolean;
  style?: ViewStyle;
};

export default function SidebarItem({
  icon,
  iconLibrary = 'Ionicons',
  title,
  subtitle,
  onPress,
  showChevron = false,
  style,
}: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed ? colors.cardSoft : 'transparent',
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.cardSoft }]}>
          <Icon
            type={iconLibrary}
            name={icon}
            size={24}
            color={colors.text}
          />
        </View>
        <View style={styles.textContainer}>
          <Text variant="subtitle" weight="semiBold" color={colors.text}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" color={colors.mutedText} numberOfLines={2}>
              {subtitle}
            </Text>
          ) : null}
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
});
