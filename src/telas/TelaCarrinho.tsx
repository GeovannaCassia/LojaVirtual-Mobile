import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCarrinho } from '../contextos/ContextoCarrinho';
import { useAutenticacao } from '../contextos/ContextoAutenticacao';
import { Cabecalho } from '../componentes/Cabecalho';
import { SeletorQuantidade } from '../componentes/SeletorQuantidade';
import { Botao } from '../componentes/Botao';
import { formatarMoeda, LIMITE_FRETE_GRATIS } from '../utilitarios/formatadores';
import { exibirAlerta, confirmarAcao } from '../utilitarios/alertas';
import { CORES, ESPACAMENTO, RAIO, TIPOGRAFIA } from '../constantes/tema';
import { ParametrosPilhaRaiz } from '../tipos';

export const TelaCarrinho: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParametrosPilhaRaiz>>();
  const { items, subtotal, shipping, total, itemCount, updateQuantity, removeItem, clearCart } = useCarrinho();
  const { isAuthenticated } = useAutenticacao();

  const handleRemove = useCallback((cartItemId: string) => {
    confirmarAcao(
      'Remover item',
      'Tem certeza que deseja remover este item do carrinho?',
      () => { void removeItem(cartItemId); },
      'Remover'
    );
  }, [removeItem]);

  const handleUpdateQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemove(cartItemId);
      return;
    }

    const result = await updateQuantity(cartItemId, quantity);
    if (!result.success) {
      exibirAlerta('Atenção', result.message);
    }
  }, [updateQuantity, handleRemove]);

  const handleClearCart = useCallback(() => {
    confirmarAcao(
      'Limpar carrinho',
      'Todos os itens serão removidos. Tem certeza?',
      () => { void clearCart(); },
      'Limpar'
    );
  }, [clearCart]);

  const handleCheckout = useCallback(() => {
    if (items.length === 0) return;

    if (!isAuthenticated) {
      navigation.navigate('Login', { redirecionarParaCheckout: true });
      return;
    }

    navigation.navigate('FinalizarCompra');
  }, [items.length, isAuthenticated, navigation]);

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Cabecalho title="Carrinho" showCart cartCount={0} />
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color={CORES.textMuted} />
          <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
          <Text style={styles.emptyText}>
            Adicione produtos incríveis ao seu carrinho
          </Text>
          <Botao
            title="Continuar comprando"
            iconName="arrow-back"
            variant="primary"
            onPress={() => navigation.navigate('AbasPrincipais', { screen: 'Inicio' })}
            style={styles.continueBtn}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Cabecalho title="Carrinho" showCart cartCount={itemCount} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + ESPACAMENTO.xl * 3 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>
              {itemCount} {itemCount === 1 ? 'item' : 'itens'} no carrinho
            </Text>
            {items.length > 1 && (
              <TouchableOpacity
                style={styles.clearAllBtn}
                onPress={handleClearCart}
                activeOpacity={0.7}
              >
                <Text style={styles.clearAllText}>Limpar tudo</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.cartItemImageWrapper}>
              <Image
                source={{ uri: item.productImage }}
                style={styles.cartItemImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.cartItemInfo}>
              <Text style={styles.cartItemName} numberOfLines={2}>
                {item.productName}
              </Text>
              <Text style={styles.cartItemVariant}>
                {item.color} / {item.size}
              </Text>
              <Text style={styles.cartItemPrice}>{formatarMoeda(item.price)}</Text>
            </View>

            <View style={styles.cartItemActions}>
              <SeletorQuantidade
                value={item.quantity}
                min={0}
                max={item.stock}
                onChange={(qty) => handleUpdateQuantity(item.id, qty)}
                size="sm"
                allowZero
              />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => handleRemove(item.id)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={20} color={CORES.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Summary Bar - Fixed at bottom */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryContent}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatarMoeda(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Frete
              {shipping === 0 ? ' (Grátis!)' : ''}
            </Text>
            <Text style={[
              styles.summaryValue,
              shipping === 0 && { color: CORES.success },
            ]}>
              {shipping === 0 ? 'Grátis' : formatarMoeda(shipping)}
            </Text>
          </View>
          {subtotal < LIMITE_FRETE_GRATIS && shipping > 0 && (
            <View style={styles.freeShippingProgress}>
              <Text style={styles.freeShippingText}>
                Adicione mais {formatarMoeda(LIMITE_FRETE_GRATIS - subtotal)} para frete grátis
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(100, (subtotal / LIMITE_FRETE_GRATIS) * 100)}%` },
                  ]}
                />
              </View>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatarMoeda(total)}</Text>
          </View>
        </View>

        <Botao
          title="Finalizar Compra"
          iconName="arrow-forward"
          onPress={handleCheckout}
          size="lg"
          style={styles.checkoutBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.background,
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
  continueBtn: {
    marginTop: ESPACAMENTO.lg,
    width: 250,
  },
  listContent: {
    paddingHorizontal: ESPACAMENTO.md,
    paddingTop: ESPACAMENTO.md,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ESPACAMENTO.md,
    paddingBottom: ESPACAMENTO.md,
  },
  listHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.textSecondary,
  },
  clearAllBtn: {
    padding: ESPACAMENTO.xs,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: CORES.danger,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: CORES.surface,
    borderRadius: RAIO.lg,
    padding: ESPACAMENTO.md,
    marginBottom: ESPACAMENTO.md,
    borderWidth: 1,
    borderColor: CORES.divider,
    gap: ESPACAMENTO.md,
  },
  cartItemImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: RAIO.md,
    overflow: 'hidden',
    backgroundColor: CORES.divider,
  },
  cartItemImage: {
    width: '100%',
    height: '100%',
  },
  cartItemInfo: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: ESPACAMENTO.sm,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.textPrimary,
    lineHeight: 20,
  },
  cartItemVariant: {
    fontSize: 12,
    color: CORES.textSecondary,
    marginTop: 2,
  },
  cartItemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: CORES.textPrimary,
    marginTop: 4,
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.sm,
    justifyContent: 'flex-end',
  },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CORES.surface,
    borderTopWidth: 1,
    borderTopColor: CORES.divider,
    paddingHorizontal: ESPACAMENTO.md,
    paddingVertical: ESPACAMENTO.md,
    shadowColor: CORES.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryContent: {
    gap: ESPACAMENTO.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: CORES.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.textPrimary,
  },
  freeShippingProgress: {
    paddingTop: ESPACAMENTO.xs,
  },
  freeShippingText: {
    fontSize: 12,
    color: CORES.primary,
    fontWeight: '600',
    marginBottom: ESPACAMENTO.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: CORES.divider,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: CORES.primary,
    borderRadius: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: ESPACAMENTO.xs,
    borderTopWidth: 1,
    borderTopColor: CORES.divider,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: CORES.textPrimary,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: CORES.textPrimary,
  },
  checkoutBtn: {
    marginTop: ESPACAMENTO.sm,
  },
});