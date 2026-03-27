import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import Button from '../../../../general/components/Button';

type Props = {
  title: string;
  message: string;
  variant?: 'error' | 'warning';
  actionLabel?: string;
  onActionPress?: () => void;
  compact?: boolean;
};

function RideEstimateStatusCard({
  title,
  message,
  variant = 'error',
  actionLabel,
  onActionPress,
  compact = false,
}: Props) {
  const { colors, typography } = useTheme();
  const isError = variant === 'error';
  const accentColor = isError ? colors.danger : colors.warning;

  return (
    <View
      style={[
        styles.card,
        compact ? styles.cardCompact : styles.cardDefault,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          compact ? styles.iconWrapCompact : styles.iconWrapDefault,
          { backgroundColor: `${accentColor}1A` },
        ]}
      >
        <Icon
          type="Feather"
          name={isError ? 'alert-circle' : 'alert-triangle'}
          size={compact ? 18 : 22}
          color={accentColor}
        />
      </View>

      <View style={[styles.content, compact ? styles.contentCompact : styles.contentDefault]}>
        <Text
          weight="semiBold"
          style={[
            styles.title,
            compact && styles.titleCompact,
            compact
              ? { fontSize: typography.size.md, lineHeight: typography.lineHeight.md2 }
              : { fontSize: typography.size.lg, lineHeight: typography.lineHeight.lg },
          ]}
        >
          {title}
        </Text>
        <Text style={[styles.message, compact && styles.messageCompact, { color: colors.mutedText }]}>
          {message}
        </Text>
      </View>

      {actionLabel && onActionPress ? (
        <Button
          label={actionLabel}
          onPress={onActionPress}
          style={compact ? styles.actionCompact : styles.actionDefault}
        />
      ) : null}
    </View>
  );
}

export default memo(RideEstimateStatusCard);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 18,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardDefault: {
    paddingHorizontal: 20,
    paddingVertical: 22,
    alignItems: 'center',
  },
  cardCompact: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapDefault: {
    marginBottom: 14,
  },
  iconWrapCompact: {
    marginRight: 12,
  },
  content: {
    minWidth: 0,
  },
  contentDefault: {
    alignSelf: 'stretch',
  },
  contentCompact: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 6,
  },
  titleCompact: {
    textAlign: 'left',
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
  },
  messageCompact: {
    textAlign: 'left',
  },
  actionDefault: {
    alignSelf: 'stretch',
    marginTop: 18,
    borderRadius: 8,
  },
  actionCompact: {
    marginLeft: 12,
    marginTop: 4,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
});
