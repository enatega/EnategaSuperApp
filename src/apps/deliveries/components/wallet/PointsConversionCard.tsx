import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Button from '../../../../general/components/Button';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  availablePoints: number;
  isLoading: boolean;
  labels: {
    title: string;
    available: string;
    placeholder: string;
    convert: string;
  };
  onConvert: (points: number) => Promise<boolean>;
};

export default function PointsConversionCard({
  availablePoints,
  isLoading,
  labels,
  onConvert,
}: Props) {
  const { colors } = useTheme();
  const [value, setValue] = useState('');
  const points = Number(value);
  const isValid = Number.isInteger(points) && points > 0 && points <= availablePoints;

  const handleConvert = async () => {
    if (isValid && (await onConvert(points))) setValue('');
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.cardSoft, borderColor: colors.border }]}>
      <Text weight="bold" style={styles.title}>{labels.title}</Text>
      <Text color={colors.mutedText}>
        {labels.available}: {availablePoints.toLocaleString()}
      </Text>
      <View style={styles.row}>
        <TextInput
          value={value}
          onChangeText={(text) => setValue(text.replace(/\D/g, ''))}
          keyboardType="number-pad"
          placeholder={labels.placeholder}
          placeholderTextColor={colors.mutedText}
          accessibilityLabel={labels.placeholder}
          style={[
            styles.input,
            { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
          ]}
        />
        <Button
          label={labels.convert}
          onPress={() => void handleConvert()}
          disabled={!isValid}
          isLoading={isLoading}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: { minWidth: 110 },
  card: { borderRadius: 12, borderWidth: 1, gap: 10, marginHorizontal: 16, marginTop: 16, padding: 16 },
  input: { borderRadius: 8, borderWidth: 1, flex: 1, fontSize: 16, minHeight: 48, paddingHorizontal: 12 },
  row: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  title: { fontSize: 18 },
});
