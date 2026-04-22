import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/theme';

type Props = {
  totalSteps: number;
  currentStep: number;
};

export default function DeleteAccountStepIndicator({ totalSteps, currentStep }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            {
              backgroundColor:
                index < currentStep ? colors.primary : colors.border,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderRadius: 3,
    flex: 1,
    height: 4,
  },
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
