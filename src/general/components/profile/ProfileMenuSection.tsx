import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/theme';

type Props = {
  children: React.ReactNode;
};

export default function ProfileMenuSection({ children }: Props) {
  const { colors } = useTheme();
  const items = React.Children.toArray(children);

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, { borderColor: colors.border }]}>
        {items.map((child, index) => (
          <React.Fragment key={index}>
            {child}
            {index < items.length - 1 && (
              <View style={styles.dividerWrapper}>
                <View
                  style={[styles.divider, { backgroundColor: colors.border }]}
                />
              </View>
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
  },
  dividerWrapper: {
    paddingVertical: 4,
  },
  wrapper: {
    paddingHorizontal: 16,
  },
});
