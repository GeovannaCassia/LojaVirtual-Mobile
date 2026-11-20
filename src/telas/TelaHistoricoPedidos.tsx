import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Cabecalho } from '../componentes/Cabecalho';
import { Cartao } from '../componentes/Cartao';
import { Selo } from '../componentes/Selo';
import { formatarMoeda } from '../utilitarios/formatadores';
import { exibirAlerta } from '../utilitarios/alertas';
import { useAutenticacao } from '../contextos/ContextoAutenticacao';
import { usePedidos } from '../contextos/ContextoPedidos';
import { CORES, ESPACAMENTO, RAIO } from '../constantes/tema';
import { ParametrosPilhaRaiz, Pedido } from '../tipos';

const STATUS_CONFIG = {
  pending: { label: 'Pendente', color: '#F59E0B', icon: 'time-outline' },
  paid: { label: 'Pago', color: '#3B82F6', icon: 'checkmark-circle-outline' },
  shipped: { label: 'Enviado', color: '#8B5CF6', icon: 'truck-outline' },
  delivered: { label: 'Entregue', color: '#10B981', icon: 'checkmark-done-circle' },
  cancelled: { label: 'Cancelado', color: '#EF4444', icon: 'close-circle-outline' },
};

export const TelaHistoricoPedidos: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParametrosPilhaRaiz>>();
  const { user } = useAutenticacao();
  const { pedidos } = usePedidos();

  const userOrders = useMemo(() => {
    if (!user) return [];
    return pedidos
      .filter((pedido) => pedido.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [user, pedidos]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderOrder = ({ item }: { item: Pedido }) => {
    const status = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG];
    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => exibirAlerta('Detalhes do Pedido', `Pedido ${item.id}\nStatus: ${status.label}\nTotal: ${formatarMoeda(item.total)}`)}
        activeOpacity={0.8}
      >
        <View style={styles.orderHeader}>
          <View style={styles.pedidoId}>
            <Text style={styles.orderIdLabel}>Pedido</Text>
            <Text style={styles.orderIdValue}>{item.id}</Text>
          </View>
          <View style={styles.orderDate}>
            <Text style={styles.orderDateLabel}>Data</Text>
            <Text style={styles.orderDateValue}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.orderBody}>
          <View style={styles.orderStatus}>
            <Ionicons name={status.icon as any} size={16} color={status.color} />
            <Selo variant="outline" size="sm" style={{ marginLeft: 4 }}>
              {status.label}
            </Selo>
          </View>
          <View style={styles.orderSummary}>
            <Text style={styles.orderItems}>{item.items.length} {item.items.length === 1 ? 'item' : 'itens'}</Text>
            <Text style={styles.orderTotal}>{formatarMoeda(item.total)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Cabecalho title="Meus Pedidos" showBack showCart cartCount={0} />

      <FlatList
        data={userOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + ESPACAMENTO.xl * 2 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={renderOrder}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-handle-outline" size={64} color={CORES.textMuted} />
            <Text style={styles.emptyTitle}>Nenhum pedido ainda</Text>
            <Text style={styles.emptyText}>
              Suas compras aparecerão aqui
            </Text>
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
    paddingBottom: ESPACAMENTO.xl * 2,
    gap: ESPACAMENTO.md,
  },
  orderCard: {
    backgroundColor: CORES.surface,
    borderRadius: RAIO.lg,
    padding: ESPACAMENTO.md,
    borderWidth: 1,
    borderColor: CORES.divider,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ESPACAMENTO.md,
    paddingBottom: ESPACAMENTO.md,
    borderBottomWidth: 1,
    borderBottomColor: CORES.divider,
  },
  pedidoId: {},
  orderIdLabel: {
    fontSize: 11,
    color: CORES.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orderIdValue: {
    fontSize: 15,
    fontWeight: '700',
    color: CORES.textPrimary,
    marginTop: 2,
  },
  orderDate: {
    alignItems: 'flex-end',
  },
  orderDateLabel: {
    fontSize: 11,
    color: CORES.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orderDateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.textPrimary,
    marginTop: 2,
  },
  orderBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderSummary: {
    alignItems: 'flex-end',
  },
  orderItems: {
    fontSize: 12,
    color: CORES.textSecondary,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: CORES.textPrimary,
    marginTop: 2,
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
});