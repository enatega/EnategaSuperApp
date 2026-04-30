import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';
import Text from '../Text';
import { useTheme } from '../../theme/theme';

type Props = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  variant: 'loading' | 'empty' | 'error';
};

export default function ListStateView({
  title,
  description,
  actionLabel,
  onActionPress,
  containerStyle,
  variant,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {variant === 'loading' ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Ionicons
          name={variant === 'error' ? 'alert-circle-outline' : 'search-outline'}
          size={44}
          color={variant === 'error' ? colors.danger : colors.primary}
        />
      )}

      {title ? (
        <Text variant="subtitle" weight="bold" style={styles.title}>
          {title}
        </Text>
      ) : null}

      {description ? (
        <Text color={colors.mutedText} style={styles.description}>
          {description}
        </Text>
      ) : null}

      {actionLabel && onActionPress ? (
        <Button
          label={actionLabel}
          onPress={onActionPress}
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    minWidth: 140,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  description: {
    maxWidth: 280,
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
  },
});
