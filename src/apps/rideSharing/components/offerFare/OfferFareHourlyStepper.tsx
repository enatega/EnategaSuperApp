import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
  subtitle: string;
  onIncrease: () => void;
  onDecrease: () => void;
  isDecreaseDisabled?: boolean;
};

function OfferFareHourlyStepper({
  title,
  subtitle,
  onIncrease,
  onDecrease,
  isDecreaseDisabled = false,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onDecrease}
        disabled={isDecreaseDisabled}
        style={[
          styles.button,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
            shadowColor: colors.shadowColor,
            opacity: isDecreaseDisabled ? 0.5 : 1,
          },
        ]}
      >
        <Icon type="Feather" name="minus" size={20} color={colors.text} />
      </Pressable>

      <View style={styles.content}>
        <Text weight="extraBold" style={styles.title}>
          {title}
        </Text>
        <Text weight="medium" color={colors.mutedText} style={styles.subtitle}>
          {subtitle}
        </Text>
      </View>

      <Pressable
        onPress={onIncrease}
        style={[
          styles.button,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <Icon type="Feather" name="plus" size={20} color={colors.text} />
      </Pressable>
    </View>
  );
}

export default memo(OfferFareHourlyStepper);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.48,
  },
  subtitle: {
    fontSize: 10,
    lineHeight: 14,
  },
});
