import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLoja } from '../contextos/ContextoLoja';
import { useCarrinho } from '../contextos/ContextoCarrinho';
import { Cabecalho } from '../componentes/Cabecalho';
import { CartaoProduto } from '../componentes/CartaoProduto';
import { BarraBusca } from '../componentes/BarraBusca';
import { FiltrosCategoria } from '../componentes/FiltrosCategoria';
import { Selo } from '../componentes/Selo';
import { Esqueleto } from '../componentes/Esqueleto';
import { AvisoCatalogo } from '../componentes/AvisoCatalogo';
import { CORES, ESPACAMENTO, RAIO, TIPOGRAFIA } from '../constantes/tema';
import { ParametrosPilhaRaiz, OpcaoOrdenacao } from '../tipos';

const SORT_OPTIONS: { value: OpcaoOrdenacao; label: string; icon: string }[] = [
  { value: 'relevance', label: 'Relevância', icon: 'layers-outline' },
  { value: 'price_asc', label: 'Menor preço', icon: 'arrow-down-outline' },
  { value: 'price_desc', label: 'Maior preço', icon: 'arrow-up-outline' },
  { value: 'rating', label: 'Melhor avaliado', icon: 'star-outline' },
  { value: 'newest', label: 'Mais recentes', icon: 'time-outline' },
];

export const TelaCatalogo: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParametrosPilhaRaiz>>();
  const { filteredProducts, categories, filterState, setFilterState, clearFilters, isLoading, error, reloadProducts } = useLoja();
  const { itemCount } = useCarrinho();
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [minPriceText, setMinPriceText] = useState('');
  const [maxPriceText, setMaxPriceText] = useState('');
  const [minRating, setMinRating] = useState(0);

  const openFilterModal = useCallback(() => {
    setMinPriceText(filterState.minPrice !== null ? String(filterState.minPrice) : '');
    setMaxPriceText(filterState.maxPrice !== null ? String(filterState.maxPrice) : '');
    setMinRating(filterState.minRating);
    setShowFilterModal(true);
  }, [filterState]);

  const handleApplyFilters = useCallback(() => {
    const minPrice = minPriceText.trim() ? Number(minPriceText.replace(',', '.')) : null;
    const maxPrice = maxPriceText.trim() ? Number(maxPriceText.replace(',', '.')) : null;
    setFilterState({
      minPrice: minPrice !== null && !isNaN(minPrice) && minPrice >= 0 ? minPrice : null,
      maxPrice: maxPrice !== null && !isNaN(maxPrice) && maxPrice >= 0 ? maxPrice : null,
      minRating,
    });
    setShowFilterModal(false);
  }, [minPriceText, maxPriceText, minRating, setFilterState]);

  const handleClearPriceRating = useCallback(() => {
    setMinPriceText('');
    setMaxPriceText('');
    setMinRating(0);
    setFilterState({ minPrice: null, maxPrice: null, minRating: 0 });
  }, [setFilterState]);

  const handleSearchChange = useCallback((text: string) => {
    setFilterState({ searchQuery: text });
  }, [setFilterState]);

  const handleClearSearch = useCallback(() => {
    setFilterState({ searchQuery: '' });
  }, [setFilterState]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterState.categoryId) count++;
    if (filterState.minPrice !== null) count++;
    if (filterState.maxPrice !== null) count++;
    if (filterState.minRating > 0) count++;
    if (filterState.sortBy !== 'relevance') count++;
    return count;
  }, [filterState]);

  const handleSortSelect = (value: OpcaoOrdenacao) => {
    setFilterState({ sortBy: value });
    setShowSortModal(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Cabecalho showCart cartCount={0} />
        <Esqueleto height={48} style={styles.skeletonSearch} />
        <View style={styles.skeletonFilters}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Esqueleto key={i} width={80} height={36} borderRadius={RAIO.full} style={styles.skeletonChip} />
          ))}
        </View>
        <View style={styles.skeletonProducts}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Esqueleto key={i} width="100%" height={260} style={{ marginBottom: ESPACAMENTO.md }} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Cabecalho
        title="Catálogo"
        showCart
        cartCount={itemCount}
      />

      {error && <AvisoCatalogo mensagem={error} onTentarNovamente={reloadProducts} />}

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <BarraBusca
          value={filterState.searchQuery}
          onChangeText={handleSearchChange}
          onClear={handleClearSearch}
          showFilterButton={false}
        />
      </View>

      {/* Sort & Filter Row */}
      <View style={styles.sortFilterRow}>
        <View style={styles.sortBtnGroup}>
          <TouchableOpacity
            style={[styles.sortBtn, filterState.sortBy !== 'relevance' && styles.sortBtnActive]}
            onPress={() => setShowSortModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="swap-horizontal-outline" size={18} color={filterState.sortBy !== 'relevance' ? CORES.primary : CORES.textSecondary} />
            <Text style={[styles.sortBtnText, filterState.sortBy !== 'relevance' && styles.sortBtnTextActive]}>
              {SORT_OPTIONS.find(o => o.value === filterState.sortBy)?.label || 'Ordenar'}
            </Text>
            <Ionicons name="chevron-down" size={16} color={CORES.textSecondary} style={{ marginLeft: 2 }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortBtn, (filterState.minPrice !== null || filterState.maxPrice !== null || filterState.minRating > 0) && styles.sortBtnActive]}
            onPress={openFilterModal}
            activeOpacity={0.8}
          >
            <Ionicons name="funnel-outline" size={18} color={(filterState.minPrice !== null || filterState.maxPrice !== null || filterState.minRating > 0) ? CORES.primary : CORES.textSecondary} />
            <Text style={[styles.sortBtnText, (filterState.minPrice !== null || filterState.maxPrice !== null || filterState.minRating > 0) && styles.sortBtnTextActive]}>
              Filtros
            </Text>
          </TouchableOpacity>
        </View>

        {activeFiltersCount > 0 && (
          <TouchableOpacity
            style={styles.clearFiltersBtn}
            onPress={clearFilters}
            activeOpacity={0.8}
          >
            <Text style={styles.clearFiltersText}>Limpar filtros ({activeFiltersCount})</Text>
          </TouchableOpacity>
        )}
      </View>

        {/* Filtros de categoria */}
      <FiltrosCategoria
        categories={categories}
        selectedId={filterState.categoryId}
        onPress={(id) => setFilterState({ categoryId: id })}
      />

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.productsContent,
          { paddingBottom: insets.bottom + ESPACAMENTO.xl * 2 },
        ]}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.productsGrid}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={CORES.textMuted} />
            <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
            <Text style={styles.emptyText}>
              Tente ajustar os filtros ou termo de busca
            </Text>
            <TouchableOpacity
              style={[styles.clearFiltersBtn, { marginTop: ESPACAMENTO.md }]}
              onPress={clearFilters}
              activeOpacity={0.8}
            >
              <Text style={styles.clearFiltersText}>Limpar todos os filtros</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <CartaoProduto
            product={item}
            onPress={() => navigation.navigate('DetalhesProduto', { produtoId: item.id })}
            variant="grid"
          />
        )}
      />

      {/* Sort Modal */}
      <ModalBase
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        title="Ordenar por"
        size="sm"
      >
        {SORT_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.sortOption,
              filterState.sortBy === option.value && styles.sortOptionSelected,
            ]}
            onPress={() => handleSortSelect(option.value)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={option.icon as any}
              size={20}
              color={filterState.sortBy === option.value ? CORES.primary : CORES.textSecondary}
              style={styles.sortOptionIcon}
            />
            <Text
              style={[
                styles.sortOptionText,
                filterState.sortBy === option.value && styles.sortOptionTextSelected,
              ]}
            >
              {option.label}
            </Text>
            {filterState.sortBy === option.value && (
              <Ionicons name="checkmark" size={20} color={CORES.primary} />
            )}
          </TouchableOpacity>
        ))}
      </ModalBase>

      {/* Filter Modal */}
      <ModalBase
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filtros"
        size="sm"
      >
        <Text style={styles.filterLabel}>Preço (R$)</Text>
        <View style={styles.priceRow}>
          <TextInput
            style={styles.priceInput}
            value={minPriceText}
            onChangeText={setMinPriceText}
            placeholder="Mín."
            placeholderTextColor={CORES.textMuted}
            keyboardType="decimal-pad"
          />
          <Text style={styles.priceSeparator}>—</Text>
          <TextInput
            style={styles.priceInput}
            value={maxPriceText}
            onChangeText={setMaxPriceText}
            placeholder="Máx."
            placeholderTextColor={CORES.textMuted}
            keyboardType="decimal-pad"
          />
        </View>

        <Text style={styles.filterLabel}>Avaliação mínima</Text>
        <View style={styles.ratingRow}>
          {[0, 3, 4, 4.5].map((value) => (
            <TouchableOpacity
              key={value}
              style={[styles.ratingChip, minRating === value && styles.ratingChipActive]}
              onPress={() => setMinRating(value)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={value === 0 ? 'star-outline' : 'star'}
                size={14}
                color={minRating === value ? CORES.primary : CORES.textSecondary}
              />
              <Text style={[styles.ratingChipText, minRating === value && styles.ratingChipTextActive]}>
                {value === 0 ? 'Todas' : `${value}+`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.filterActions}>
          <TouchableOpacity style={styles.filterClearBtn} onPress={handleClearPriceRating} activeOpacity={0.8}>
            <Text style={styles.filterClearText}>Limpar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterApplyBtn} onPress={handleApplyFilters} activeOpacity={0.8}>
            <Text style={styles.filterApplyText}>Aplicar</Text>
          </TouchableOpacity>
        </View>
      </ModalBase>
    </View>
  );
};

// Import ModalBase at the top
import { ModalBase } from '../componentes/JanelaModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.background,
  },
  searchSection: {
    paddingHorizontal: ESPACAMENTO.md,
    paddingVertical: ESPACAMENTO.sm,
  },
  sortFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ESPACAMENTO.md,
    paddingVertical: ESPACAMENTO.xs,
  },
  sortBtnGroup: {
    flexDirection: 'row',
    gap: ESPACAMENTO.sm,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ESPACAMENTO.md,
    paddingVertical: ESPACAMENTO.xs + 2,
    borderRadius: RAIO.full,
    backgroundColor: CORES.surface,
    borderWidth: 1,
    borderColor: CORES.divider,
  },
  sortBtnActive: {
    backgroundColor: CORES.primaryLight,
    borderColor: CORES.primary,
  },
  sortBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: CORES.textSecondary,
    marginLeft: ESPACAMENTO.xs,
  },
  sortBtnTextActive: {
    color: CORES.primary,
  },
  clearFiltersBtn: {
    paddingHorizontal: ESPACAMENTO.md,
    paddingVertical: ESPACAMENTO.xs,
  },
  clearFiltersText: {
    fontSize: 12,
    fontWeight: '600',
    color: CORES.primary,
  },
  productsContent: {
    paddingHorizontal: ESPACAMENTO.md,
    paddingTop: ESPACAMENTO.sm,
  },
  productsGrid: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: ESPACAMENTO.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: CORES.textPrimary,
    marginTop: ESPACAMENTO.md,
  },
  emptyText: {
    fontSize: 14,
    color: CORES.textSecondary,
    textAlign: 'center',
    marginTop: ESPACAMENTO.xs,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ESPACAMENTO.md,
    paddingHorizontal: ESPACAMENTO.md,
    borderBottomWidth: 1,
    borderBottomColor: CORES.divider,
  },
  sortOptionSelected: {
    backgroundColor: CORES.primaryLight,
  },
  sortOptionIcon: {
    marginRight: ESPACAMENTO.md,
    width: 24,
  },
  sortOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: CORES.textPrimary,
    flex: 1,
  },
  sortOptionTextSelected: {
    color: CORES.primary,
    fontWeight: '600',
  },
  skeletonSearch: {
    marginHorizontal: ESPACAMENTO.md,
    borderRadius: RAIO.md,
  },
  skeletonFilters: {
    flexDirection: 'row',
    gap: ESPACAMENTO.sm,
    paddingHorizontal: ESPACAMENTO.md,
    paddingVertical: ESPACAMENTO.sm,
  },
  skeletonChip: {
    marginRight: ESPACAMENTO.sm,
  },
  skeletonProducts: {
    paddingHorizontal: ESPACAMENTO.md,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.textPrimary,
    marginBottom: ESPACAMENTO.sm,
    marginTop: ESPACAMENTO.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.sm,
  },
  priceInput: {
    flex: 1,
    height: 44,
    borderRadius: RAIO.md,
    borderWidth: 1,
    borderColor: CORES.divider,
    backgroundColor: CORES.surface,
    paddingHorizontal: ESPACAMENTO.md,
    fontSize: 14,
    color: CORES.textPrimary,
  },
  priceSeparator: {
    color: CORES.textMuted,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    gap: ESPACAMENTO.sm,
    flexWrap: 'wrap',
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: ESPACAMENTO.md,
    paddingVertical: ESPACAMENTO.xs + 2,
    borderRadius: RAIO.full,
    backgroundColor: CORES.surface,
    borderWidth: 1,
    borderColor: CORES.divider,
  },
  ratingChipActive: {
    backgroundColor: CORES.primaryLight,
    borderColor: CORES.primary,
  },
  ratingChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: CORES.textSecondary,
  },
  ratingChipTextActive: {
    color: CORES.primary,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: ESPACAMENTO.sm,
    marginTop: ESPACAMENTO.lg,
  },
  filterClearBtn: {
    paddingHorizontal: ESPACAMENTO.md,
    paddingVertical: ESPACAMENTO.sm,
    borderRadius: RAIO.md,
  },
  filterClearText: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.textSecondary,
  },
  filterApplyBtn: {
    paddingHorizontal: ESPACAMENTO.lg,
    paddingVertical: ESPACAMENTO.sm,
    borderRadius: RAIO.md,
    backgroundColor: CORES.primary,
  },
  filterApplyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});