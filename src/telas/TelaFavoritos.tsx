import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLoja } from '../contextos/ContextoLoja';
import { useAutenticacao } from '../contextos/ContextoAutenticacao';
import { useCarrinho } from '../contextos/ContextoCarrinho';
import { Cabecalho } from '../componentes/Cabecalho';
import { CartaoProduto } from '../componentes/CartaoProduto';
import { Botao } from '../componentes/Botao';
import { Esqueleto } from '../componentes/Esqueleto';
import { CORES, ESPACAMENTO, RAIO } from '../constantes/tema';
import { ParametrosPilhaRaiz } from '../tipos';

export const TelaFavoritos: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParametrosPilhaRaiz>>();
  const { getProductById } = useLoja();
  const { user, isFavorite, toggleFavorite } = useAutenticacao();
  const { addItem, isInCart } = useCarrinho();

  const favoriteProducts = useMemo(() => {
    if (!user) return [];
    return user.favorites
      .map((id) => getProductById(id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);
  }, [user, getProductById]);

  const handleAddToCart = useCallback(async (product: any) => {
    if (!product) return;
    const firstVariant = product.variants.find((v: any) => v.stock > 0) || product.variants[0];
    if (firstVariant) {
      await addItem(product, firstVariant, 1);
    }
  }, [addItem]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Cabecalho title="Favoritos" showCart cartCount={0} />
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={CORES.textMuted} />
          <Text style={styles.emptyTitle}>Faça login para ver seus favoritos</Text>
          <Text style={styles.emptyText}>
            Seus produtos salvos serão sincronizados entre dispositivos
          </Text>
          <Botao
            title="Entrar ou Cadastrar"
            iconName="log-in-outline"
            variant="primary"
            onPress={() => navigation.navigate('Login')}
            style={styles.loginBtn}
          />
        </View>
      </View>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <View style={styles.container}>
        <Cabecalho title="Favoritos" showCart cartCount={0} />
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={CORES.textMuted} />
          <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
          <Text style={styles.emptyText}>
            Toque no coração nos produtos para salvá-los aqui
          </Text>
          <Botao
            title="Explorar produtos"
            iconName="search-outline"
            variant="primary"
            onPress={() => navigation.navigate('AbasPrincipais', { screen: 'Catalogo' })}
            style={styles.loginBtn}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Cabecalho title="Favoritos" showCart cartCount={0} />

      <FlatList
        data={favoriteProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + ESPACAMENTO.xl * 2 },
        ]}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.productsGrid}
        renderItem={({ item }) => (
          <CartaoProduto
            product={item}
            onPress={() => navigation.navigate('DetalhesProduto', { produtoId: item.id })}
            onFavoritePress={() => toggleFavorite(item.id)}
            isFavorite={isFavorite(item.id)}
            variant="grid"
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color={CORES.textMuted} />
            <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
          </View>
        }
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
    fontSize: 20,
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
  loginBtn: {
    marginTop: ESPACAMENTO.lg,
    width: 250,
  },
});