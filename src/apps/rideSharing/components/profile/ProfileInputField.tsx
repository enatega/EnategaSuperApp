import React, { useState } from 'react';
import { StyleSheet, View, TextInput, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  isPassword?: boolean;
};

export default function ProfileInputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'none',
  secureTextEntry = false,
  style,
  inputStyle,
  isPassword = false,
}: Props) {
  const { colors } = useTheme();
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  // Sync isSecure with secureTextEntry prop initially, but user can toggle it
  // Actually, we should just respect isPassword to enable the toggle functionality
  // and use local state for the actual visibility.
  
  const actualSecureTextEntry = isPassword ? isSecure : secureTextEntry;

  return (
    <View style={[styles.field, style]}>
      {label ? (
        <Text
          variant="subtitle"
          weight="semiBold"
          color={colors.text}
          style={styles.label}
        >
          {label}
        </Text>
      ) : null}
      <View style={[styles.inputContainer, { borderColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.text }, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={actualSecureTextEntry}
        />
        {isPassword && (
          <TouchableOpacity onPress={toggleSecureEntry} style={styles.iconContainer}>
            <Icon
              type="Ionicons"
              name={isSecure ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.mutedText}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    marginBottom: 4,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 0, 
    flex: 1,
  },
  iconContainer: {
    marginLeft: 8,
    padding: 4,
  },
});
