import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CORES, RAIO, ESPACAMENTO, TIPOGRAFIA } from '../constantes/tema';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md';
  style?: object;
}

export const Selo: React.FC<BadgeProps> = ({ children, variant = 'primary', size = 'sm', style }) => {
  const variants = {
    primary: { bg: CORES.primaryLight, color: CORES.primaryDark, border: 'transparent' },
    secondary: { bg: CORES.divider, color: CORES.textSecondary, border: 'transparent' },
    success: { bg: '#ECFDF5', color: CORES.success, border: 'transparent' },
    warning: { bg: '#FFFBEB', color: CORES.warning, border: 'transparent' },
    danger: { bg: '#FEF2F2', color: CORES.danger, border: 'transparent' },
    outline: { bg: 'transparent', color: CORES.textSecondary, border: CORES.divider },
  };

  const v = variants[variant];
  const paddingH = size === 'sm' ? 6 : 8;
  const paddingV = size === 'sm' ? 2 : 3;
  const fontSize = size === 'sm' ? 10 : 12;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: v.border === 'transparent' ? 0 : 1,
          paddingHorizontal: paddingH,
          paddingVertical: paddingV,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: v.color, fontSize, fontWeight: '700' },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

interface RatingProps {
  value: number;
  max?: number;
  size?: number;
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

export const Avaliacao: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = 16,
  showValue = false,
  interactive = false,
  onChange,
}) => {
  const stars = Array.from({ length: max }, (_, i) => i + 1);

  return (
    <View style={styles.ratingContainer}>
      {stars.map((star) => {
        const filled = star <= value;
        const half = !filled && star - 0.5 <= value;
        return (
          <TouchableOpacity
            key={star}
            style={styles.star}
            onPress={() => interactive && onChange?.(star)}
            activeOpacity={0.7}
            disabled={!interactive}
          >
            {half ? (
              <Text style={[{ fontSize: size, color: CORES.star }]}>★</Text>
            ) : (
              <Text
                style={[
                  { fontSize: size },
                  { color: filled ? CORES.star : CORES.textMuted },
                ]}
              >
                {filled ? '★' : '☆'}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
      {showValue && (
        <Text style={[styles.ratingValue, { marginLeft: 6 }]}>
          {value.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: RAIO.full,
    overflow: 'hidden',
  },
  text: {
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    padding: 1,
  },
  ratingValue: {
    fontSize: 13,
    fontWeight: '600',
    color: CORES.textPrimary,
  },
});