import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLoja } from '../contextos/ContextoLoja';
import { useCarrinho } from '../contextos/ContextoCarrinho';
import { useAutenticacao } from '../contextos/ContextoAutenticacao';
import { Cabecalho } from '../componentes/Cabecalho';
import { CartaoProduto } from '../componentes/CartaoProduto';
import { BarraBusca } from '../componentes/BarraBusca';
import { FiltrosCategoria } from '../componentes/FiltrosCategoria';
import { Esqueleto } from '../componentes/Esqueleto';
import { AvisoCatalogo } from '../componentes/AvisoCatalogo';
import { CORES, ESPACAMENTO, RAIO, TIPOGRAFIA } from '../constantes/tema';
import { ParametrosPilhaRaiz } from '../tipos';

export const TelaInicial: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParametrosPilhaRaiz>>();
  const { featuredProducts, filteredProducts, categories, filterState, setFilterState, isLoading, error, reloadProducts } = useLoja();
  const { itemCount } = useCarrinho();
  const { user } = useAutenticacao();

  const handleSearchChange = useCallback((text: string) => {
    setFilterState({ searchQuery: text });
  }, [setFilterState]);

  const handleClearSearch = useCallback(() => {
    setFilterState({ searchQuery: '' });
  }, [setFilterState]);

  const handleCategoryPress = useCallback((categoryId: string | null) => {
    setFilterState({ categoryId });
    if (categoryId) {
      navigation.navigate('ProdutosCategoria', { categoriaId: categoryId, nomeCategoria: categories.find(c => c.id === categoryId)?.name || '' });
    }
  }, [categories, setFilterState, navigation]);

  const handleFilterPress = useCallback(() => {
    navigation.navigate('AbasPrincipais', { screen: 'Catalogo' });
  }, [navigation]);

  const renderCategoryItem = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(category.id)}
      activeOpacity={0.85}
    >
      <View style={styles.categoryImageWrapper}>
        <Image
          source={{ uri: category.image }}
          style={styles.categoryImage}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.categoryName}>{category.name}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Cabecalho showCart cartCount={0} />
        <Esqueleto width="60%" height={24} style={styles.skeletonTitle} />
        <Esqueleto height={48} style={styles.skeletonSearch} />
        <View style={styles.skeletonCategories}>
          {Array.from({ length: 5 }).map((_, i) => (
            <View key={i} style={styles.skeletonCategoryItem}>
              <Esqueleto width={80} height={80} borderRadius={RAIO.lg} />
              <Esqueleto width="80%" height={14} style={{ marginTop: ESPACAMENTO.xs }} />
            </View>
          ))}
        </View>
        <Esqueleto height={16} style={{ marginTop: ESPACAMENTO.lg, marginBottom: ESPACAMENTO.sm, marginHorizontal: ESPACAMENTO.md }} />
        <View style={styles.skeletonProducts}>
          {Array.from({ length: 2 }).map((_, i) => (
            <Esqueleto key={i} width="100%" height={260} style={{ marginBottom: ESPACAMENTO.md }} />
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top, paddingBottom: insets.bottom + ESPACAMENTO.xl * 2 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Cabecalho
        showCart
        cartCount={itemCount}
        backgroundColor="transparent"
      />

      {error && <AvisoCatalogo mensagem={error} onTentarNovamente={reloadProducts} />}

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <View>
          <Text style={styles.welcomeLabel}>Olá,</Text>
          <Text style={styles.welcomeName}>{user?.name || 'Usuário'}</Text>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="person-circle" size={48} color={CORES.primary} />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <BarraBusca
          value={filterState.searchQuery}
          onChangeText={handleSearchChange}
          onClear={handleClearSearch}
          onFilterPress={handleFilterPress}
          filterCount={filterState.categoryId || filterState.minPrice || filterState.maxPrice ? 1 : 0}
        />
      </View>

      {/* Categories Carousel */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categorias</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {categories.map(renderCategoryItem)}
      </ScrollView>

      {/* Featured Products / Search Results */}
      {(() => {
        const hasSearch = filterState.searchQuery.trim().length > 0;
        const displayProducts = hasSearch ? filteredProducts : featuredProducts;
        const sectionTitle = hasSearch ? 'Resultados da busca' : 'Em Destaque';
        const emptyMessage = hasSearch
          ? 'Nenhum produto encontrado para esta busca'
          : 'Nenhum produto em destaque';

        return (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>{sectionTitle}</Text>
              <TouchableOpacity
                style={styles.seeAllBtn}
                onPress={() => navigation.navigate('AbasPrincipais', { screen: 'Catalogo' })}
              >
                <Text style={styles.seeAllText}>Ver todos</Text>
                <Ionicons name="chevron-forward" size={16} color={CORES.textSecondary} />
              </TouchableOpacity>
            </View>

            {displayProducts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name={hasSearch ? 'search-outline' : 'cube-outline'} size={48} color={CORES.textMuted} />
                <Text style={styles.emptyText}>{emptyMessage}</Text>
              </View>
            ) : (
              <View style={styles.productsGrid}>
                {displayProducts.map((product) => (
                  <CartaoProduto
                    key={product.id}
                    product={product}
                    onPress={() => navigation.navigate('DetalhesProduto', { produtoId: product.id })}
                    variant="grid"
                  />
                ))}
              </View>
            )}
          </>
        );
      })()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.background,
  },
  content: {
    paddingHorizontal: ESPACAMENTO.md,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ESPACAMENTO.md,
    paddingTop: ESPACAMENTO.xs,
  },
  welcomeLabel: {
    fontSize: 14,
    color: CORES.textSecondary,
  },
  welcomeName: {
    fontSize: 24,
    fontWeight: '800',
    color: CORES.textPrimary,
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: CORES.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    marginBottom: ESPACAMENTO.lg,
  },
  sectionHeader: {
    marginBottom: ESPACAMENTO.md,
    paddingTop: ESPACAMENTO.xs,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ESPACAMENTO.md,
    paddingTop: ESPACAMENTO.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: CORES.textPrimary,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: CORES.primary,
  },
  categoriesScroll: {
    flexDirection: 'row',
    gap: ESPACAMENTO.sm,
    paddingBottom: ESPACAMENTO.xs,
  },
  categoryItem: {
    width: 80,
    alignItems: 'center',
  },
  categoryImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: RAIO.lg,
    overflow: 'hidden',
    marginBottom: ESPACAMENTO.xs,
    backgroundColor: CORES.divider,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: CORES.textPrimary,
    textAlign: 'center',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: ESPACAMENTO.sm,
  },
  emptyState: {
    alignItems: 'center',
    padding: ESPACAMENTO.xl,
    marginTop: ESPACAMENTO.md,
  },
  emptyText: {
    marginTop: ESPACAMENTO.sm,
    fontSize: 14,
    color: CORES.textSecondary,
  },
  skeletonTitle: {
    marginHorizontal: ESPACAMENTO.md,
    borderRadius: RAIO.xs,
  },
  skeletonSearch: {
    marginHorizontal: ESPACAMENTO.md,
    borderRadius: RAIO.md,
  },
  skeletonCategories: {
    flexDirection: 'row',
    gap: ESPACAMENTO.sm,
    paddingHorizontal: ESPACAMENTO.md,
  },
  skeletonCategoryItem: {
    width: 80,
    alignItems: 'center',
  },
  skeletonProducts: {
    paddingHorizontal: ESPACAMENTO.md,
  },
});