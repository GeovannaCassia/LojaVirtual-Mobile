import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CORES, RAIO, ESPACAMENTO } from '../constantes/tema';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onFilterPress?: () => void;
  showFilterButton?: boolean;
  filterCount?: number;
}

export const BarraBusca: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar produtos...',
  onClear,
  onFilterPress,
  showFilterButton = true,
  filterCount = 0,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Ionicons name="search-outline" size={22} color={CORES.textMuted} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={CORES.textMuted}
          value={value}
          onChangeText={onChangeText}
          clearButtonMode="never"
        />
        {value.length > 0 && onClear && (
          <TouchableOpacity onPress={onClear} style={styles.clearBtn} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={20} color={CORES.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {showFilterButton && onFilterPress && (
        <TouchableOpacity
          style={[styles.filterBtn, filterCount > 0 && styles.filterBtnActive]}
          onPress={onFilterPress}
          activeOpacity={0.8}
        >
          <Ionicons name="funnel-outline" size={20} color={filterCount > 0 ? CORES.primary : CORES.textSecondary} />
          {filterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{filterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CORES.surface,
    borderRadius: RAIO.md,
    borderWidth: 1,
    borderColor: CORES.divider,
    paddingHorizontal: ESPACAMENTO.md,
    height: 48,
  },
  icon: {
    marginRight: ESPACAMENTO.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: CORES.textPrimary,
  },
  clearBtn: {
    padding: ESPACAMENTO.xs,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: RAIO.md,
    backgroundColor: CORES.surface,
    borderWidth: 1,
    borderColor: CORES.divider,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  filterBtnActive: {
    backgroundColor: CORES.primaryLight,
    borderColor: CORES.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: CORES.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});