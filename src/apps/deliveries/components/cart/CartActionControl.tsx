import React from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import { useTheme } from '../../../../general/theme/theme';

type CartActionControlMode = 'add' | 'quantity';
type CartActionControlSize = 'small' | 'medium';

type Props = {
  accessibilityLabel?: string;
  count?: number;
  disabled?: boolean;
  isLoading?: boolean;
  mode?: CartActionControlMode;
  onAdd?: () => void;
  onDecrement?: () => void;
  onIncrement?: () => void;
  style?: StyleProp<ViewStyle>;
  size?: CartActionControlSize;
};

const SIZE_CONFIG: Record<
  CartActionControlSize,
  {
    actionIcon: number;
    addWidth: number;
    controlWidth: number;
    height: number;
    horizontalPadding: number;
    quantityFontSize: number;
    quantityLineHeight: number;
  }
> = {
  small: {
    actionIcon: 14,
    addWidth: 24,
    controlWidth: 78,
    height: 24,
    horizontalPadding: 8,
    quantityFontSize: 12,
    quantityLineHeight: 16,
  },
  medium: {
    actionIcon: 18,
    addWidth: 32,
    controlWidth: 96,
    height: 32,
    horizontalPadding: 10,
    quantityFontSize: 14,
    quantityLineHeight: 20,
  },
};

export default function CartActionControl({
  accessibilityLabel,
  count = 1,
  disabled = false,
  isLoading = false,
  mode = 'add',
  onAdd,
  onDecrement,
  onIncrement,
  size = 'medium',
  style,
}: Props) {
  const { colors } = useTheme();
  const config = SIZE_CONFIG[size];
  const progress = React.useRef(new Animated.Value(mode === 'quantity' ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: mode === 'quantity' ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [mode, progress]);

  const animatedWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [config.addWidth, config.controlWidth],
  });
  const addOpacity = progress.interpolate({
    inputRange: [0, 0.45, 1],
    outputRange: [1, 0, 0],
  });
  const addScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.92],
  });
  const quantityOpacity = progress.interpolate({
    inputRange: [0, 0.55, 1],
    outputRange: [0, 0, 1],
  });
  const quantityScale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.96, 1],
  });
  const isQuantityMode = mode === 'quantity';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: config.height / 2,
          height: config.height,
          shadowColor: colors.shadowColor,
          width: animatedWidth,
        },
        style,
      ]}
    >
      <Animated.View
        pointerEvents={isQuantityMode ? 'none' : 'auto'}
        style={[
          styles.overlay,
          {
            opacity: addOpacity,
            transform: [{ scale: addScale }],
          },
        ]}
      >
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          disabled={disabled || isLoading}
          onPress={onAdd}
          style={({ pressed }) => [
            styles.touchable,
            {
              opacity: disabled || isLoading ? 0.45 : pressed ? 0.72 : 1,
            },
          ]}
        >
          <Icon color={colors.text} name="plus" size={config.actionIcon} type="Feather" />
        </Pressable>
      </Animated.View>

      <Animated.View
        pointerEvents={isQuantityMode ? 'auto' : 'none'}
        style={[
          styles.overlay,
          styles.quantityOverlay,
          {
            opacity: quantityOpacity,
            paddingHorizontal: config.horizontalPadding,
            transform: [{ scale: quantityScale }],
          },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          disabled={disabled || isLoading}
          hitSlop={6}
          onPress={onDecrement}
          style={({ pressed }) => [
            styles.inlineAction,
            { opacity: disabled || isLoading ? 0.45 : pressed ? 0.72 : 1 },
          ]}
        >
          <Icon color={colors.text} name="minus" size={config.actionIcon - 1} type="Feather" />
        </Pressable>

        <View style={styles.countContainer}>
          <Text
            style={{
              color: colors.text,
              fontSize: config.quantityFontSize,
              fontVariant: ['tabular-nums'],
              lineHeight: config.quantityLineHeight,
            }}
            weight="semiBold"
          >
            {count}
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={disabled || isLoading}
          hitSlop={6}
          onPress={onIncrement}
          style={({ pressed }) => [
            styles.inlineAction,
            { opacity: disabled || isLoading ? 0.45 : pressed ? 0.72 : 1 },
          ]}
        >
          <Icon color={colors.text} name="plus" size={config.actionIcon - 1} type="Feather" />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  countContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  inlineAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityOverlay: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  touchable: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
});
