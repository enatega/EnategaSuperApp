import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/theme';
import Icon from './Icon';
import Text from './Text';

type Props = {
  label?: string;
  onPress: () => void;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function MapCurrentLocationButton({
  label,
  onPress,
  isLoading = false,
  style,
}: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
          opacity: isLoading ? 0.75 : pressed ? 0.9 : 1,
        },
        style,
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.blue50 }]}>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.blue800} />
        ) : (
          <Icon type="MaterialIcons" name="my-location" size={18} color={colors.blue800} />
        )}
      </View>
      {label && <Text variant='caption' weight="semiBold">{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
