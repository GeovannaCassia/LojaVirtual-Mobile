import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES, RAIO, ESPACAMENTO } from '../constantes/tema';

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  allowZero?: boolean;
}

export const SeletorQuantidade: React.FC<QuantitySelectorProps> = ({
  value,
  min = 1,
  max,
  onChange,
  size = 'md',
  showLabel = false,
  label = 'Quantidade',
  allowZero = false,
}) => {
  const effectiveMin = allowZero ? 0 : min;
  const sizes = {
    sm: { btn: 28, font: 14, padding: 8 },
    md: { btn: 36, font: 16, padding: 12 },
    lg: { btn: 44, font: 18, padding: 16 },
  };

  const s = sizes[size];

  const handleDecrement = () => {
    if (value > effectiveMin) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const isAtMin = value <= effectiveMin;
  const isDeleteAction = allowZero && value === 1;

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={[styles.label, { marginBottom: ESPACAMENTO.xs }]}>{label}</Text>
      )}
      <View style={[styles.selector, { height: s.btn }]}>
        <TouchableOpacity
          style={styles.btn}
          onPress={handleDecrement}
          disabled={isAtMin}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isDeleteAction ? 'trash-outline' : 'remove'}
            size={s.font}
            color={
              isAtMin
                ? CORES.textMuted
                : isDeleteAction
                ? CORES.danger
                : CORES.textPrimary
            }
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.value,
            { fontSize: s.font, paddingHorizontal: s.padding },
          ]}
        >
          {value}
        </Text>

        <TouchableOpacity
          style={styles.btn}
          onPress={handleIncrement}
          disabled={value >= max}
          activeOpacity={0.7}
        >
          <Ionicons
            name="add"
            size={s.font}
            color={value >= max ? CORES.textMuted : CORES.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: CORES.textPrimary,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.surface,
    borderRadius: RAIO.md,
    borderWidth: 1,
    borderColor: CORES.divider,
    overflow: 'hidden',
  },
  btn: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    textAlign: 'center',
    minWidth: 40,
    fontWeight: '600',
    color: CORES.textPrimary,
  },
});