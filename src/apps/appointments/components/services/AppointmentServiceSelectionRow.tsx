import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type {
  AppointmentDeal,
  AppointmentServiceCustomizationSection,
  AppointmentStoreService,
} from '../../api/types';
import {
  formatDurationMinutes,
  formatPrice,
  getServiceMeta,
} from '../details/detailHelpers';
import AppointmentServicePrice from './AppointmentServicePrice';

type Props = {
  isSelected: boolean;
  item: AppointmentStoreService;
  onPress: (service: AppointmentStoreService) => void;
  onVariantPress?: (
    service: AppointmentStoreService,
    variant: AppointmentServiceCustomizationSection,
  ) => void;
  customizationSections?: AppointmentServiceCustomizationSection[];
  deal?: AppointmentDeal | null;
  selectedVariantGroupId?: string | null;
};

function getEffectiveVariantPrice(
  originalPrice: number,
  deal?: AppointmentDeal | null,
) {
  if (!deal) {
    return originalPrice;
  }

  const discountedPrice =
    deal.type === 'percentage'
      ? originalPrice - (originalPrice * deal.value) / 100
      : deal.type === 'fixed'
        ? originalPrice - deal.value
        : originalPrice;

  return Math.max(0, Number(discountedPrice.toFixed(2)));
}

export default function AppointmentServiceSelectionRow({
  isSelected,
  item,
  onPress,
  onVariantPress,
  customizationSections = [],
  deal,
  selectedVariantGroupId,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('appointments');
  const metaLabel = getServiceMeta(item);
  const availableVariants = customizationSections.filter(
    (section) =>
      section.type?.toLowerCase() === 'variation' &&
      section.options.length > 0,
  );

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={styles.row}>
        <View style={styles.content}>
          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.md,
              lineHeight: typography.lineHeight.md,
            }}
            weight="semiBold"
          >
            {item.name}
          </Text>

          <View style={styles.metaRow}>
            <AppointmentServicePrice
              dealName={item.deal?.name}
              originalPrice={item.originalPrice}
              price={item.price}
            />
            <Text
              style={{ color: colors.mutedText, fontSize: typography.size.sm }}
            >
              {metaLabel}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityLabel={item.name}
          accessibilityRole="button"
          onPress={() => onPress(item)}
          style={[
            styles.actionButton,
            {
              backgroundColor: isSelected ? colors.blue50 : colors.surface,
              borderColor: isSelected ? colors.primary : colors.border,
            },
          ]}
        >
          <Icon
            color={isSelected ? colors.primary : colors.text}
            name={isSelected ? 'checkmark' : 'add'}
            size={24}
            type="Ionicons"
          />
        </Pressable>
      </View>

      {isSelected && availableVariants.length > 0 ? (
        <View style={styles.variantsSection}>
          <Text
            style={{ color: colors.mutedText, fontSize: typography.size.sm }}
            weight="semiBold"
          >
            {t('services_variants_label')}
          </Text>
          <View style={styles.variantsContent}>
            {availableVariants.map((variant) => {
              const option = variant.options[0];
              const isVariantSelected =
                selectedVariantGroupId === variant.groupId;
              const effectivePrice = getEffectiveVariantPrice(
                option.price,
                deal,
              );
              const optionTitle = option.title?.trim();
              const showOptionTitle =
                optionTitle &&
                optionTitle.toLocaleLowerCase() !==
                  variant.name.trim().toLocaleLowerCase();
              const variantDurationMinutes =
                typeof variant.durationMinutes === 'number' &&
                variant.durationMinutes > 0
                  ? variant.durationMinutes
                  : typeof item.estimatedDurationMinutes === 'number' &&
                      item.estimatedDurationMinutes > 0
                    ? item.estimatedDurationMinutes
                    : null;
              const durationLabel =
                variantDurationMinutes !== null
                  ? formatDurationMinutes(variantDurationMinutes)
                  : null;

              return (
                <Pressable
                  key={variant.groupId}
                  accessibilityLabel={`${variant.name}, ${formatPrice(effectivePrice) ?? ''}`}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isVariantSelected }}
                  onPress={() => onVariantPress?.(item, variant)}
                  style={[
                    styles.variantCard,
                    {
                      backgroundColor: isVariantSelected
                        ? colors.blue50
                        : colors.surface,
                      borderColor: isVariantSelected
                        ? colors.primary
                        : colors.border,
                      shadowColor: colors.shadowColor,
                    },
                  ]}
                >
                  {variant.imageUrl ? (
                    <Image
                      resizeMode="cover"
                      source={{ uri: variant.imageUrl }}
                      style={styles.variantImage}
                    />
                  ) : (
                    <View
                      style={[
                        styles.variantImage,
                        styles.variantImagePlaceholder,
                        { backgroundColor: colors.surface },
                      ]}
                    >
                      <Icon
                        color={colors.mutedText}
                        name="cut-outline"
                        size={28}
                        type="Ionicons"
                      />
                    </View>
                  )}
                  <View style={styles.variantCopy}>
                    <Text
                      numberOfLines={2}
                      style={{
                        color: colors.text,
                        fontSize: typography.size.md,
                      }}
                      weight="semiBold"
                    >
                      {variant.name}
                    </Text>
                    {showOptionTitle ? (
                      <Text
                        numberOfLines={1}
                        style={{
                          color: colors.mutedText,
                          fontSize: typography.size.xs,
                        }}
                      >
                        {optionTitle}
                      </Text>
                    ) : null}
                    <View style={styles.variantMeta}>
                      <AppointmentServicePrice
                        dealName={deal?.name}
                        originalPrice={option.price}
                        price={effectivePrice}
                        size={typography.size.sm}
                      />
                      {durationLabel ? (
                        <View style={styles.duration}>
                          <Icon
                            color={colors.mutedText}
                            name="time-outline"
                            size={15}
                            type="Ionicons"
                          />
                          <Text
                            style={{
                              color: colors.mutedText,
                              fontSize: typography.size.xs,
                            }}
                            weight="medium"
                          >
                            {durationLabel}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  <View
                    style={[
                      styles.variantRadio,
                      {
                        backgroundColor: isVariantSelected
                          ? colors.primary
                          : colors.surface,
                        borderColor: isVariantSelected
                          ? colors.primary
                          : colors.border,
                      },
                    ]}
                  >
                    {isVariantSelected ? (
                      <Icon
                        color={colors.white}
                        name="checkmark"
                        size={16}
                        type="Ionicons"
                      />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  content: {
    flex: 1,
    gap: 8,
    paddingRight: 12,
  },
  duration: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  container: {
    borderBottomWidth: 1,
    paddingVertical: 14,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  variantCard: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
    flexDirection: 'row',
    gap: 14,
    minHeight: 96,
    padding: 10,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  variantCopy: {
    flex: 1,
    gap: 2,
  },
  variantImage: {
    borderRadius: 12,
    height: 76,
    width: 76,
  },
  variantImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  variantMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  variantRadio: {
    alignItems: 'center',
    borderRadius: 13,
    borderWidth: 1.5,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  variantsContent: {
    gap: 12,
  },
  variantsSection: {
    gap: 10,
    paddingTop: 16,
  },
});
