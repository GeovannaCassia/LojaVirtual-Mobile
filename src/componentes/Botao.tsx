import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES, RAIO, ESPACAMENTO, TIPOGRAFIA } from '../constantes/tema';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
}

export const Botao: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  iconName,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getContainerStyle = () => {
    const base = styles.baseContainer;
    const variantStyles = {
      primary: styles.primaryContainer,
      secondary: styles.secondaryContainer,
      outline: styles.outlineContainer,
      ghost: styles.ghostContainer,
      danger: styles.dangerContainer,
    };
    const sizeStyles = {
      sm: styles.sizeSm,
      md: styles.sizeMd,
      lg: styles.sizeLg,
    };
    return [base, variantStyles[variant], sizeStyles[size], fullWidth && styles.fullWidth];
  };

  const getTextStyle = () => {
    const variantStyles = {
      primary: styles.primaryText,
      secondary: styles.secondaryText,
      outline: styles.outlineText,
      ghost: styles.ghostText,
      danger: styles.dangerText,
    };
    return [TIPOGRAFIA.button, variantStyles[variant], textStyle];
  };

  const getIconColor = () => {
    switch (variant) {
      case 'secondary':
        return CORES.primaryDark;
      case 'outline':
      case 'ghost':
        return CORES.primary;
      case 'danger':
        return '#FFFFFF';
      case 'primary':
      default:
        return '#FFFFFF';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        getContainerStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : CORES.primary}
          size="small"
        />
      ) : (
        <View style={styles.contentRow}>
          {iconName && iconPosition === 'left' && (
            <Ionicons
              name={iconName}
              size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18}
              color={getIconColor()}
              style={styles.icon}
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {iconName && iconPosition === 'right' && (
            <Ionicons
              name={iconName}
              size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18}
              color={getIconColor()}
              style={[styles.icon, { marginLeft: ESPACAMENTO.sm }]}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: RAIO.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: ESPACAMENTO.sm,
  },
  fullWidth: {
    width: '100%',
  },
  sizeSm: {
    minHeight: 38,
    paddingHorizontal: ESPACAMENTO.md,
    paddingVertical: 6,
  },
  sizeMd: {
    minHeight: 48,
    paddingHorizontal: ESPACAMENTO.lg,
    paddingVertical: 10,
  },
  sizeLg: {
    minHeight: 56,
    paddingHorizontal: ESPACAMENTO.xl,
    paddingVertical: 12,
  },
  primaryContainer: {
    backgroundColor: CORES.primary,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryContainer: {
    backgroundColor: CORES.primaryLight,
  },
  secondaryText: {
    color: CORES.primaryDark,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: CORES.primary,
  },
  outlineText: {
    color: CORES.primary,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: CORES.textSecondary,
  },
  dangerContainer: {
    backgroundColor: CORES.danger,
  },
  dangerText: {
    color: '#FFFFFF',
  },
  disabled: {
    opacity: 0.5,
  },
});