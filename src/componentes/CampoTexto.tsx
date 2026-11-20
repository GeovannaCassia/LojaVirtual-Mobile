import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES, RAIO, ESPACAMENTO, TIPOGRAFIA } from '../constantes/tema';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
}

export const CampoTexto: React.FC<CustomInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  style,
  ...rest
}) => {
  const hasError = !!error;
  const hasHelper = !!helperText && !hasError;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, hasError && styles.labelError]}>{label}</Text>
      )}
      <View style={styles.inputWrapper}>
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={22}
            color={hasError ? CORES.danger : CORES.textMuted}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            hasError && styles.inputError,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            inputStyle,
            style,
          ]}
          placeholderTextColor={CORES.textMuted}
          {...rest}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.iconButton}>
            <Ionicons
              name={rightIcon}
              size={22}
              color={CORES.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {hasError ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hasHelper ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: ESPACAMENTO.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.textPrimary,
    marginBottom: ESPACAMENTO.xs,
  },
  labelError: {
    color: CORES.danger,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.surface,
    borderRadius: RAIO.md,
    borderWidth: 1,
    borderColor: CORES.divider,
  },
  input: {
    flex: 1,
    height: 52,
    paddingHorizontal: ESPACAMENTO.md,
    fontSize: 16,
    color: CORES.textPrimary,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  inputError: {
    borderColor: CORES.danger,
  },
  icon: {
    marginLeft: ESPACAMENTO.md,
    marginRight: ESPACAMENTO.sm,
  },
  iconButton: {
    padding: ESPACAMENTO.md,
    marginRight: ESPACAMENTO.xs,
  },
  errorText: {
    fontSize: 12,
    color: CORES.danger,
    marginTop: ESPACAMENTO.xs,
  },
  helperText: {
    fontSize: 12,
    color: CORES.textMuted,
    marginTop: ESPACAMENTO.xs,
  },
});