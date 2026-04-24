import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Icon from '../../../../../general/components/Icon';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  isFavourite: boolean;
  isLoading?: boolean;
  accessibilityLabel: string;
  onPress: () => void;
  tone?: 'danger' | 'neutral';
  outlined?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function FavouriteHeartButton({
  isFavourite,
  isLoading = false,
  accessibilityLabel,
  onPress,
  tone = 'danger',
  outlined = false,
  style,
}: Props) {
  const { colors } = useTheme();
  const iconColor = tone === 'neutral' ? colors.text : colors.danger;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={12}
      disabled={isLoading}
      style={[
        styles.heartButton,
        {
          backgroundColor: colors.surface,
          borderColor: outlined ? colors.border : 'transparent',
          borderWidth: outlined ? 1 : 0,
          shadowColor: colors.shadowColor,
        },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <Icon
          color={iconColor}
          name={isFavourite ? 'favorite' : 'favorite-border'}
          size={22}
          type="MaterialIcons"
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heartButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    top: 8,
    width: 32,
    zIndex: 10,
  },
});
