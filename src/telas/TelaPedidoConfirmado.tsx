import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Cabecalho } from '../componentes/Cabecalho';
import { Botao } from '../componentes/Botao';
import { Cartao } from '../componentes/Cartao';
import { formatarMoeda } from '../utilitarios/formatadores';
import { exibirAlerta } from '../utilitarios/alertas';
import { CORES, ESPACAMENTO, RAIO, TIPOGRAFIA } from '../constantes/tema';
import { ParametrosPilhaRaiz } from '../tipos';

export const TelaPedidoConfirmado: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParametrosPilhaRaiz>>();
  const route = useRoute<RouteProp<ParametrosPilhaRaiz, 'PedidoConfirmado'>>();
  const { pedidoId } = route.params;

  const handleContinueShopping = () => {
    navigation.navigate('AbasPrincipais', { screen: 'Inicio' });
  };

  const handleViewOrders = () => {
    navigation.navigate('HistoricoPedidos');
  };

  return (
    <View style={styles.container}>
      <Cabecalho showCart cartCount={0} backgroundColor="transparent" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + ESPACAMENTO.xl * 2 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Animation Area */}
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.successTitle}>Pedido Confirmado!</Text>
          <Text style={styles.successSubtitle}>
            Seu pedido foi realizado com sucesso
          </Text>

          <Cartao style={styles.orderIdCard}>
            <View style={styles.orderIdRow}>
              <View>
                <Text style={styles.orderIdLabel}>Número do Pedido</Text>
                <Text style={styles.orderIdValue}>{pedidoId}</Text>
              </View>
              <TouchableOpacity
                style={styles.copyBtn}
                onPress={() => exibirAlerta('Copiado', 'Número do pedido copiado para a área de transferência')}
                activeOpacity={0.7}
              >
                <Ionicons name="copy-outline" size={20} color={CORES.primary} />
              </TouchableOpacity>
            </View>
          </Cartao>
        </View>

          {/* Detalhes do pedido */}
        <Cartao style={styles.detailsCard}>
          <Text style={styles.cardTitle}>O que acontece agora?</Text>
          <View style={styles.stepsContainer}>
            {[
              { icon: 'checkmark-circle', color: CORES.success, title: 'Pedido confirmado', desc: 'Recebemos seu pedido e estamos preparando' },
              { icon: 'bag-handle', color: CORES.primary, title: 'Separação', desc: 'Seus itens estão sendo separados no estoque' },
              { icon: 'truck', color: CORES.warning, title: 'Envio', desc: 'Você receberá o código de rastreamento por e-mail' },
              { icon: 'home', color: CORES.success, title: 'Entrega', desc: 'Seu pedido chegará no endereço cadastrado' },
            ].map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepIconWrapper}>
                  <Ionicons name={step.icon as any} size={24} color={step.color} />
                </View>
                <View style={styles.stepText}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </Cartao>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <Botao
            title="Ver meus pedidos"
            iconName="bag-handle-outline"
            onPress={handleViewOrders}
            variant="secondary"
            style={styles.viewOrdersBtn}
          />
          <Botao
            title="Continuar comprando"
            iconName="storefront-outline"
            onPress={handleContinueShopping}
            style={styles.continueBtn}
          />
        </View>

        <View style={styles.supportNotice}>
          <Ionicons name="help-circle-outline" size={16} color={CORES.textMuted} />
          <Text style={styles.supportText}>
            Dúvidas? Entre em contato com a equipe de suporte
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

import { Alert } from 'react-native';

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
  successContainer: {
    alignItems: 'center',
    paddingVertical: ESPACAMENTO.xl,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: CORES.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ESPACAMENTO.md,
    shadowColor: CORES.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: CORES.textPrimary,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 15,
    color: CORES.textSecondary,
    textAlign: 'center',
    marginTop: ESPACAMENTO.xs,
    maxWidth: '85%',
  },
  orderIdCard: {
    marginTop: ESPACAMENTO.lg,
    width: '100%',
    backgroundColor: CORES.primaryLight,
    borderColor: CORES.primary,
  },
  orderIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdLabel: {
    fontSize: 12,
    color: CORES.primaryDark,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orderIdValue: {
    fontSize: 18,
    fontWeight: '800',
    color: CORES.primary,
    marginTop: 2,
  },
  copyBtn: {
    padding: ESPACAMENTO.xs,
  },
  detailsCard: {
    marginBottom: ESPACAMENTO.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: CORES.textPrimary,
    marginBottom: ESPACAMENTO.md,
  },
  stepsContainer: {
    gap: ESPACAMENTO.md,
  },
  stepItem: {
    flexDirection: 'row',
    gap: ESPACAMENTO.md,
  },
  stepIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: {
    flex: 1,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.textPrimary,
  },
  stepDesc: {
    fontSize: 12,
    color: CORES.textSecondary,
    marginTop: 2,
  },
  actionsContainer: {
    gap: ESPACAMENTO.md,
  },
  viewOrdersBtn: {},
  continueBtn: {},
  supportNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESPACAMENTO.xs,
    marginTop: ESPACAMENTO.lg,
    paddingVertical: ESPACAMENTO.md,
  },
  supportText: {
    fontSize: 12,
    color: CORES.textMuted,
    maxWidth: '85%',
  },
});