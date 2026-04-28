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
          backgroundColor: pressed ? colors.backgroundTertiary : 'transparent',
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <Icon type={iconLibrary} name={icon} size={24} color={colors.iconColor} />
        <View style={styles.textContainer}>
          <Text
            variant="body"
            weight="medium"
            color={colors.text}
            numberOfLines={1}
          >
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
});
