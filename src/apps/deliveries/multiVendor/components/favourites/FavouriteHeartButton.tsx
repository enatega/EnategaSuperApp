import React from 'react';
import { ActivityIndicator, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../../general/theme/theme';
import { styles } from '../../../components/storeCard/styles';

type Props = {
  isFavourite: boolean;
  isLoading?: boolean;
  accessibilityLabel: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function FavouriteHeartButton({
  isFavourite,
  isLoading = false,
  accessibilityLabel,
  onPress,
  style,
}: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={12}
      disabled={isLoading}
      style={[styles.heartButton, { backgroundColor: colors.surface }, style]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.danger} />
      ) : (
        <Ionicons
          name={isFavourite ? 'heart' : 'heart-outline'}
          size={18}
          color={colors.danger}
        />
      )}
    </Pressable>
  );
}
