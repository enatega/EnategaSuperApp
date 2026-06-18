import React, { memo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon, { type IconType } from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type ServiceModeOption = {
  id: string;
  title: string;
  description: string;
  iconName: string;
  iconType?: IconType;
};

type Props = {
  title: string;
  titleIconName?: string;
  titleIconType?: IconType;
  infoText?: string;
  options: ServiceModeOption[];
  selectedMode: string;
  onSelect: (mode: string) => void;
};

function ServiceModeSection({
  onSelect,
  options,
  selectedMode,
  title,
  titleIconName,
  titleIconType = 'Feather',
  infoText,
}: Props) {
  const { colors, typography } = useTheme();
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {titleIconName ? (
          <Icon
            type={titleIconType}
            name={titleIconName}
            size={26}
            color={colors.warning}
          />
        ) : null}
        <Text
          weight="extraBold"
          style={{
            color: colors.text,
            fontSize: typography.size.lg,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {title}
        </Text>
        {infoText ? (
          <View style={styles.infoWrap}>
            <Pressable
              accessibilityLabel={`${title} information`}
              accessibilityRole="button"
              onHoverIn={() => setIsInfoVisible(true)}
              onHoverOut={() => setIsInfoVisible(false)}
              onPress={() => setIsInfoVisible((current) => !current)}
              style={styles.infoButton}
            >
              <Icon
                type="Ionicons"
                name="information-circle-outline"
                size={18}
                color={colors.iconMuted}
              />
            </Pressable>
          </View>
        ) : null}
      </View>
      {infoText && isInfoVisible ? (
        <View
          style={[
            styles.infoTooltip,
            {
              backgroundColor: colors.warningSoft,
              borderColor: colors.warning,
            },
          ]}
        >
          <Text
            weight="medium"
            style={{
              color: colors.warningText,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            }}
          >
            {infoText}
          </Text>
        </View>
      ) : null}

      <View style={styles.optionsWrap}>
        {options.map((option) => {
          const isSelected = selectedMode === option.id;

          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              style={[
                styles.optionCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: isSelected ? colors.warning : colors.border,
                },
              ]}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionRow}>
                  <View
                    style={[
                      styles.radioOuter,
                      {
                        borderColor: isSelected ? colors.warning : colors.border,
                      },
                    ]}
                  >
                    {isSelected ? <View style={[styles.radioInner, { backgroundColor: colors.warning }]} /> : null}
                  </View>
                  <View style={styles.textWrap}>
                    <Text
                      weight="semiBold"
                      style={{
                        color: colors.text,
                        fontSize: typography.size.sm2,
                        lineHeight: typography.lineHeight.md,
                      }}
                    >
                      {option.title}
                    </Text>
                    <Text
                      weight="medium"
                      style={{
                        color: colors.mutedText,
                        fontSize: typography.size.xs2,
                        lineHeight: typography.lineHeight.sm,
                      }}
                    >
                      {option.description}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.trailingIconWrap,
                    {
                      backgroundColor: isSelected ? colors.warningSoft : colors.backgroundTertiary,
                    },
                  ]}
                >
                  <Icon
                    type={option.iconType ?? 'Feather'}
                    name={option.iconName}
                    size={26}
                    color={isSelected ? colors.warning : colors.iconMuted}
                  />
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default memo(ServiceModeSection);

const styles = StyleSheet.create({
  infoButton: {
    alignItems: 'center',
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  infoTooltip: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  infoWrap: {
    marginLeft: 'auto',
  },
  optionCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  optionRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  optionsWrap: {
    gap: 10,
  },
  radioInner: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  radioOuter: {
    alignItems: 'center',
    borderRadius: 11,
    borderWidth: 1.5,
    height: 22,
    justifyContent: 'center',
    marginTop: 2,
    width: 22,
  },
  section: {
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  trailingIconWrap: {
    alignItems: 'center',
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
});
