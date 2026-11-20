import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCarrinho } from '../contextos/ContextoCarrinho';
import { useAutenticacao } from '../contextos/ContextoAutenticacao';
import { usePedidos } from '../contextos/ContextoPedidos';
import { exibirAlerta } from '../utilitarios/alertas';
import { Cabecalho } from '../componentes/Cabecalho';
import { Botao } from '../componentes/Botao';
import { Cartao } from '../componentes/Cartao';
import { CampoTexto } from '../componentes/CampoTexto';
import { Selo } from '../componentes/Selo';
import { formatarMoeda, LIMITE_FRETE_GRATIS } from '../utilitarios/formatadores';
import { CORES, ESPACAMENTO, RAIO, TIPOGRAFIA } from '../constantes/tema';
import { ParametrosPilhaRaiz } from '../tipos';

const PAYMENT_METHODS = [
  { id: 'pix', label: 'PIX', icon: 'qr-code-outline', description: 'Pagamento instantâneo' },
  { id: 'credit_card', label: 'Cartão de Crédito', icon: 'card-outline', description: 'Até 12x sem juros' },
  { id: 'boleto', label: 'Boleto Bancário', icon: 'document-text-outline', description: 'Vencimento em 3 dias' },
] as const;

export const TelaFinalizarCompra: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParametrosPilhaRaiz>>();
  const { items, subtotal, shipping, total, clearCart, isLoading: carregandoCarrinho } = useCarrinho();
  const { user, isAuthenticated, isLoading: carregandoAutenticacao } = useAutenticacao();
  const { criarPedido } = usePedidos();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);

  const finalizandoRef = React.useRef(false);

  const defaultAddress = user?.addresses.find((a) => a.isDefault) || user?.addresses[0];

  React.useEffect(() => {
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
    }
  }, [defaultAddress?.id]);

  // Auth guard
  React.useEffect(() => {
    if (carregandoAutenticacao) return;
    if (!isAuthenticated) {
      navigation.replace('Login', { redirecionarParaCheckout: true });
    }
  }, [carregandoAutenticacao, isAuthenticated, navigation]);

  if (carregandoAutenticacao || !isAuthenticated) {
    return null; // or a loading spinner
  }

  if (carregandoCarrinho) {
    return null; // loading cart
  }

  if (items.length === 0) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={insets.top + 56}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + ESPACAMENTO.xl * 3 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Cabecalho title="Finalizar Compra" showBack showCart cartCount={0} />
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={64} color={CORES.textMuted} />
            <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
            <Text style={styles.emptyText}>
              Adicione produtos para finalizar a compra
            </Text>
            <Botao
              title="Voltar ao carrinho"
              iconName="arrow-back"
              variant="primary"
              onPress={() => navigation.navigate('AbasPrincipais', { screen: 'Carrinho' })}
              style={styles.emptyBtn}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  const selectedAddress = user?.addresses.find((a) => a.id === selectedAddressId) || defaultAddress;

  const handlePlaceOrder = useCallback(async () => {
    if (!selectedAddress) {
      exibirAlerta('Atenção', 'Selecione um endereço de entrega');
      return;
    }

    if (paymentMethod === 'credit_card') {
      if (cardNumber.replace(/\D/g, '').length !== 16) {
        exibirAlerta('Atenção', 'Número do cartão inválido');
        return;
      }
      if (!cardName.trim()) {
        exibirAlerta('Atenção', 'Nome no cartão é obrigatório');
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        exibirAlerta('Atenção', 'Validade inválida (MM/AA)');
        return;
      }
      if (!/^\d{3}$/.test(cardCvv)) {
        exibirAlerta('Atenção', 'CVV inválido');
        return;
      }
    }

    if (paymentMethod === 'boleto' && cpf.replace(/\D/g, '').length !== 11) {
      exibirAlerta('Atenção', 'CPF é obrigatório para boleto');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API

    finalizandoRef.current = true;
    const pedido = await criarPedido({
      userId: user!.id,
      items,
      shippingAddress: selectedAddress,
      paymentMethod,
      subtotal,
      shipping,
      total,
    });
    await clearCart();
    finalizandoRef.current = false;
    setLoading(false);
    navigation.replace('PedidoConfirmado', { pedidoId: pedido.id });
  }, [selectedAddress, paymentMethod, cardNumber, cardName, cardExpiry, cardCvv, cpf, clearCart, navigation, user, items, subtotal, shipping, total, criarPedido]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={insets.top + 56}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + ESPACAMENTO.xl * 3 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Cabecalho title="Finalizar Compra" showBack showCart cartCount={0} />

          {/* Resumo do pedido */}
        <Cartao style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Resumo do Pedido</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemImageWrapper}>
                <Image
                  source={{ uri: item.productImage }}
                  style={styles.orderItemImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.orderItemInfo}>
                <Text style={styles.orderItemName} numberOfLines={1}>
                  {item.productName}
                </Text>
                <Text style={styles.orderItemVariant}>
                  {item.color} / {item.size}
                </Text>
                <Text style={styles.orderItemQty}>Qtd: {item.quantity}</Text>
              </View>
              <Text style={styles.orderItemPrice}>
                {formatarMoeda(item.price * item.quantity)}
              </Text>
            </View>
          ))}

          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({items.length} itens)</Text>
            <Text style={styles.summaryValue}>{formatarMoeda(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Frete {shipping === 0 ? ' (Grátis)' : ''}
            </Text>
            <Text style={[
              styles.summaryValue,
              shipping === 0 && { color: CORES.success },
            ]}>
              {shipping === 0 ? 'Grátis' : formatarMoeda(shipping)}
            </Text>
          </View>
          <View style={styles.summaryRowTotal}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatarMoeda(total)}</Text>
          </View>
        </Cartao>

        {/* Delivery Endereco */}
        <Cartao style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Endereço de Entrega</Text>
            {(user?.addresses?.length ?? 0) > 1 && (
              <TouchableOpacity
                onPress={() => navigation.navigate('ListaEnderecos', { origemCheckout: true })}
                activeOpacity={0.7}
              >
                <Text style={styles.changeAddressText}>Alterar</Text>
                <Ionicons name="chevron-forward" size={16} color={CORES.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {(user?.addresses?.length ?? 0) === 0 ? (
            <TouchableOpacity
              style={styles.addAddressBtn}
              onPress={() => navigation.navigate('FormularioEndereco', { origemCheckout: true })}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={24} color={CORES.primary} />
              <Text style={styles.addAddressText}>Adicionar endereço de entrega</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.addressCard,
                selectedAddressId === selectedAddress?.id && styles.addressCardSelected,
              ]}
              onPress={() => setSelectedAddressId(selectedAddress!.id)}
              activeOpacity={0.8}
            >
              <View style={styles.addressIconWrapper}>
                <Ionicons name="location-outline" size={24} color={CORES.primary} />
              </View>
              <View style={styles.addressInfo}>
                <View style={styles.addressHeader}>
                  <Text style={styles.addressLabel}>{selectedAddress?.label}</Text>
                  {selectedAddress?.isDefault && (
                    <Selo variant="success" size="sm">Principal</Selo>
                  )}
                </View>
                <Text style={styles.addressStreet}>
                  {selectedAddress?.street}, {selectedAddress?.number}
                  {selectedAddress?.complement && `, ${selectedAddress.complement}`}
                </Text>
                <Text style={styles.addressCity}>
                  {selectedAddress?.neighborhood} - {selectedAddress?.city}/{selectedAddress?.state}
                </Text>
                <Text style={styles.addressZip}>
                  {selectedAddress?.zipCode}
                </Text>
              </View>
              <Ionicons
                name={selectedAddressId === selectedAddress?.id ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={selectedAddressId === selectedAddress?.id ? CORES.primary : CORES.textMuted}
              />
            </TouchableOpacity>
          )}
        </Cartao>

        {/* Payment Method */}
        <Cartao style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Forma de Pagamento</Text>

          <View style={styles.paymentOptions}>
            {PAYMENT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  paymentMethod === method.id && styles.paymentOptionSelected,
                ]}
                onPress={() => setPaymentMethod(method.id as any)}
                activeOpacity={0.8}
              >
                <View style={styles.paymentIconWrapper}>
                  <Ionicons
                    name={method.icon as any}
                    size={24}
                    color={paymentMethod === method.id ? CORES.primary : CORES.textSecondary}
                  />
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={[
                    styles.paymentLabel,
                    paymentMethod === method.id && styles.paymentLabelSelected,
                  ]}>
                    {method.label}
                  </Text>
                  <Text style={styles.paymentDescription}>{method.description}</Text>
                </View>
                <View
                  style={[
                    styles.paymentRadio,
                    paymentMethod === method.id && styles.paymentRadioSelected,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          {paymentMethod === 'credit_card' && (
            <View style={styles.cardForm}>
              <Text style={styles.formSectionTitle}>Dados do Cartão</Text>
              <CampoTexto
                label="Número do cartão"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(text.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                keyboardType="numeric"
                maxLength={19}
                leftIcon="card-outline"
              />
              <CampoTexto
                label="Nome no cartão"
                placeholder="JOAO DA SILVA"
                value={cardName}
                onChangeText={setCardName}
                autoCapitalize="characters"
                leftIcon="person-outline"
              />
              <View style={styles.cardFormRow}>
                <CampoTexto
                  label="Validade (MM/AA)"
                  placeholder="MM/AA"
                  value={cardExpiry}
                  onChangeText={(text) => {
                    const clean = text.replace(/\D/g, '');
                    if (clean.length >= 2) {
                      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2, 4)}`);
                    } else {
                      setCardExpiry(clean);
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={5}
                  leftIcon="calendar-outline"
                />
                <CampoTexto
                  label="CVV"
                  placeholder="123"
                  value={cardCvv}
                  onChangeText={(text) => setCardCvv(text.replace(/\D/g, '').slice(0, 3))}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                  leftIcon="lock-closed-outline"
                />
              </View>
            </View>
          )}

          {paymentMethod === 'boleto' && (
            <View style={styles.cardForm}>
              <Text style={styles.formSectionTitle}>Dados para Boleto</Text>
              <CampoTexto
                label="CPF"
                placeholder="000.000.000-00"
                value={cpf}
                onChangeText={(text) => {
                  const clean = text.replace(/\D/g, '');
                  let formatted = clean;
                  if (clean.length > 3) formatted = `${clean.slice(0, 3)}.${clean.slice(3)}`;
                  if (clean.length > 6) formatted = `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6)}`;
                  if (clean.length > 9) formatted = `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9, 11)}`;
                  setCpf(formatted);
                }}
                keyboardType="numeric"
                maxLength={14}
                leftIcon="id-card-outline"
              />
              <Text style={styles.boletoInfo}>
                O boleto será gerado após a confirmação do pedido. Vencimento em 3 dias úteis.
              </Text>
            </View>
          )}
        </Cartao>

        {/* Botão de finalizar pedido */}
        <Botao
          title={`Confirmar Pedido - ${formatarMoeda(total)}`}
          iconName="checkmark-circle"
          onPress={handlePlaceOrder}
          loading={loading}
          size="lg"
          style={styles.placeOrderBtn}
        />

        <View style={styles.secureNotice}>
          <Ionicons name="lock-closed" size={14} color={CORES.success} />
          <Text style={styles.secureText}>
            Compra segura • Seus dados são criptografados (SSL)
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    gap: ESPACAMENTO.lg,
  },
  summaryCard: {
    marginBottom: ESPACAMENTO.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: CORES.textPrimary,
    marginBottom: ESPACAMENTO.md,
  },
  orderItem: {
    flexDirection: 'row',
    gap: ESPACAMENTO.md,
    paddingVertical: ESPACAMENTO.sm,
    borderBottomWidth: 1,
    borderBottomColor: CORES.divider,
  },
  orderItemImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: RAIO.md,
    overflow: 'hidden',
    backgroundColor: CORES.divider,
  },
  orderItemImage: {
    width: '100%',
    height: '100%',
  },
  orderItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  orderItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: CORES.textPrimary,
  },
  orderItemVariant: {
    fontSize: 11,
    color: CORES.textSecondary,
    marginTop: 2,
  },
  orderItemQty: {
    fontSize: 11,
    color: CORES.textMuted,
    marginTop: 2,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: CORES.textPrimary,
    alignSelf: 'center',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: CORES.divider,
    marginVertical: ESPACAMENTO.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: ESPACAMENTO.xs,
  },
  summaryLabel: {
    fontSize: 13,
    color: CORES.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: CORES.textPrimary,
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: ESPACAMENTO.md,
    borderTopWidth: 1,
    borderTopColor: CORES.divider,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: CORES.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: CORES.textPrimary,
  },
  sectionCard: {
    marginBottom: ESPACAMENTO.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ESPACAMENTO.md,
  },
  changeAddressText: {
    fontSize: 13,
    fontWeight: '600',
    color: CORES.primary,
  },
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESPACAMENTO.sm,
    paddingVertical: ESPACAMENTO.md,
    borderRadius: RAIO.md,
    borderWidth: 2,
    borderColor: CORES.primary,
    borderStyle: 'dashed',
  },
  addAddressText: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.primary,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.md,
    padding: ESPACAMENTO.md,
    borderRadius: RAIO.md,
    borderWidth: 2,
    borderColor: CORES.divider,
    backgroundColor: CORES.surface,
  },
  addressCardSelected: {
    borderColor: CORES.primary,
    backgroundColor: CORES.primaryLight,
  },
  addressIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: CORES.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressInfo: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.sm,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: CORES.textPrimary,
  },
  addressStreet: {
    fontSize: 13,
    color: CORES.textPrimary,
    marginTop: 2,
  },
  addressCity: {
    fontSize: 12,
    color: CORES.textSecondary,
    marginTop: 1,
  },
  addressZip: {
    fontSize: 11,
    color: CORES.textMuted,
    marginTop: 1,
  },
  paymentOptions: {
    gap: ESPACAMENTO.sm,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.md,
    padding: ESPACAMENTO.md,
    borderRadius: RAIO.md,
    borderWidth: 2,
    borderColor: CORES.divider,
    backgroundColor: CORES.surface,
  },
  paymentOptionSelected: {
    borderColor: CORES.primary,
    backgroundColor: CORES.primaryLight,
  },
  paymentIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: CORES.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.textPrimary,
  },
  paymentLabelSelected: {
    color: CORES.primary,
  },
  paymentDescription: {
    fontSize: 12,
    color: CORES.textSecondary,
    marginTop: 1,
  },
  paymentRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: CORES.divider,
  },
  paymentRadioSelected: {
    borderColor: CORES.primary,
    backgroundColor: CORES.primary,
  },
  cardForm: {
    marginTop: ESPACAMENTO.md,
    paddingTop: ESPACAMENTO.md,
    borderTopWidth: 1,
    borderTopColor: CORES.divider,
  },
  formSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.textPrimary,
    marginBottom: ESPACAMENTO.md,
  },
  cardFormRow: {
    flexDirection: 'row',
    gap: ESPACAMENTO.md,
  },
  cardFormRowItem: {
    flex: 1,
  },
  boletoInfo: {
    fontSize: 12,
    color: CORES.textSecondary,
    marginTop: ESPACAMENTO.md,
    lineHeight: 18,
  },
  placeOrderBtn: {
    marginTop: ESPACAMENTO.md,
  },
  secureNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESPACAMENTO.xs,
    paddingVertical: ESPACAMENTO.md,
    paddingHorizontal: ESPACAMENTO.md,
    marginTop: ESPACAMENTO.md,
    borderRadius: RAIO.md,
    backgroundColor: '#ECFDF5',
  },
  secureText: {
    fontSize: 12,
    color: CORES.success,
    fontWeight: '500',
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
  emptyBtn: {
    marginTop: ESPACAMENTO.lg,
    width: 250,
  },
});