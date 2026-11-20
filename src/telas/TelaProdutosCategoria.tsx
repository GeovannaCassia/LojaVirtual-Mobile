import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLoja } from '../contextos/ContextoLoja';
import { Cabecalho } from '../componentes/Cabecalho';
import { CartaoProduto } from '../componentes/CartaoProduto';
import { Esqueleto } from '../componentes/Esqueleto';
import { CORES, ESPACAMENTO, RAIO } from '../constantes/tema';
import { ParametrosPilhaRaiz } from '../tipos';

export const TelaProdutosCategoria: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParametrosPilhaRaiz>>();
  const route = useRoute<RouteProp<ParametrosPilhaRaiz, 'ProdutosCategoria'>>();
  const { categoriaId, nomeCategoria } = route.params;

  const { getProductsByCategory, isLoading } = useLoja();
  const products = getProductsByCategory(categoriaId);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Cabecalho title={nomeCategoria} showBack showCart cartCount={0} />
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
      <Cabecalho title={nomeCategoria} showBack showCart cartCount={0} />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + ESPACAMENTO.xl * 2 },
        ]}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.productsGrid}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={48} color={CORES.textMuted} />
            <Text style={styles.emptyTitle}>Nenhum produto nesta categoria</Text>
            <Text style={styles.emptyText}>
              Volte em breve para novidades
            </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.background,
  },
  content: {
    paddingHorizontal: ESPACAMENTO.md,
    paddingTop: ESPACAMENTO.md,
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
  skeletonProducts: {
    paddingHorizontal: ESPACAMENTO.md,
  },
});