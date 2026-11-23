import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Categoria } from '../tipos';
import { CORES, RAIO, ESPACAMENTO } from '../constantes/tema';

interface FilterChipsProps {
  categories: Categoria[];
  selectedId: string | null;
  onPress: (id: string | null) => void;
  showAll?: boolean;
  allLabel?: string;
  scrollable?: boolean;
}

export const FiltrosCategoria: React.FC<FilterChipsProps> = ({
  categories,
  selectedId,
  onPress,
  showAll = true,
  allLabel = 'Todos',
  scrollable = true,
}) => {
  const renderChip = (cat: Categoria, isSelected: boolean) => (
    <TouchableOpacity
      key={cat.id}
      style={[
        styles.chip,
        isSelected && styles.chipSelected,
        { backgroundColor: isSelected ? CORES.primary : CORES.surface, borderColor: isSelected ? CORES.primary : CORES.divider },
      ]}
      onPress={() => onPress(cat.id)}
      activeOpacity={0.8}
    >
      <Ionicons
        name={cat.icon as any}
        size={16}
        color={isSelected ? '#FFFFFF' : CORES.textSecondary}
        style={styles.chipIcon}
      />
      <Text
        style={[
          styles.chipText,
          { color: isSelected ? '#FFFFFF' : CORES.textSecondary },
        ]}
      >
        {cat.name}
      </Text>
    </TouchableOpacity>
  );

  const allChip = (
    <TouchableOpacity
      key="all"
      style={[
        styles.chip,
        selectedId === null && styles.chipSelected,
        { backgroundColor: selectedId === null ? CORES.primary : CORES.surface, borderColor: selectedId === null ? CORES.primary : CORES.divider },
      ]}
      onPress={() => onPress(null)}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.chipText,
          { color: selectedId === null ? '#FFFFFF' : CORES.textSecondary },
        ]}
      >
        {allLabel}
      </Text>
    </TouchableOpacity>
  );

  const chips = showAll ? [allChip, ...categories.map((c) => renderChip(c, selectedId === c.id))] : categories.map((c) => renderChip(c, selectedId === c.id));

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {chips}
      </ScrollView>
    );
  }

  return (
    <View style={styles.wrapContent}>
      {chips}
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: {
    // O ScrollView padrão usa flexGrow/flexShrink 1; sem esse override ele
    // é comprimido pelo FlatList e corta os chips em telas menores.
    flexGrow: 0,
    flexShrink: 0,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: ESPACAMENTO.sm,
    paddingHorizontal: ESPACAMENTO.md,
    paddingVertical: ESPACAMENTO.xs,
  },
  wrapContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACAMENTO.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ESPACAMENTO.md,
    paddingVertical: ESPACAMENTO.xs + 2,
    borderRadius: RAIO.full,
    borderWidth: 1,
  },
  chipSelected: {
    shadowColor: CORES.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  chipIcon: {
    marginRight: ESPACAMENTO.xs,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});