import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAutenticacao } from '../contextos/ContextoAutenticacao';
import { Cabecalho } from '../componentes/Cabecalho';
import { Botao } from '../componentes/Botao';
import { Cartao } from '../componentes/Cartao';
import { Selo } from '../componentes/Selo';
import { CORES, ESPACAMENTO, RAIO } from '../constantes/tema';
import { confirmarAcao } from '../utilitarios/alertas';
import { ParametrosPilhaRaiz } from '../tipos';

export const TelaListaEnderecos: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParametrosPilhaRaiz>>();
  const route = useRoute<RouteProp<ParametrosPilhaRaiz, 'ListaEnderecos'>>();
  const { origemCheckout } = route.params || {};
  const { user, removeAddress, setDefaultAddress } = useAutenticacao();

  const handleSelectAddress = useCallback((addressId: string) => {
    if (origemCheckout) {
      setDefaultAddress(addressId);
      navigation.goBack();
    }
  }, [origemCheckout, navigation, setDefaultAddress]);

  const handleDelete = useCallback((addressId: string) => {
    confirmarAcao(
      'Excluir endereço',
      'Tem certeza que deseja excluir este endereço?',
      () => { void removeAddress(addressId); },
      'Excluir'
    );
  }, [removeAddress]);

  if (!user || user.addresses.length === 0) {
    return (
      <View style={styles.container}>
        <Cabecalho title="Endereços" showBack />
        <View style={styles.emptyContainer}>
          <Ionicons name="location-outline" size={64} color={CORES.textMuted} />
          <Text style={styles.emptyTitle}>Nenhum endereço cadastrado</Text>
          <Text style={styles.emptyText}>
            Adicione seu primeiro endereço para agilizar suas compras
          </Text>
          <Botao
            title="Adicionar endereço"
            iconName="add-outline"
            variant="primary"
            onPress={() => navigation.navigate('FormularioEndereco')}
            style={styles.addBtn}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Cabecalho title="Meus Endereços" showBack showCart cartCount={0} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + ESPACAMENTO.xl * 2 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {user.addresses.map((address) => (
          <TouchableOpacity
            key={address.id}
            style={styles.addressCard}
            onPress={() => handleSelectAddress(address.id)}
            activeOpacity={0.8}
          >
            <View style={styles.addressMain}>
              <View style={styles.addressIconWrapper}>
                <Ionicons name="location-outline" size={24} color={CORES.primary} />
              </View>
              <View style={styles.addressInfo}>
                <View style={styles.addressHeader}>
                  <Text style={styles.addressLabel}>{address.label}</Text>
                  {address.isDefault && <Selo variant="success" size="sm">Principal</Selo>}
                </View>
                <Text style={styles.addressStreet}>
                  {address.street}, {address.number}
                  {address.complement && `, ${address.complement}`}
                </Text>
                <Text style={styles.addressCity}>
                  {address.neighborhood} - {address.city}/{address.state}
                </Text>
                <Text style={styles.addressZip}>{address.zipCode}</Text>
              </View>
              {origemCheckout && address.isDefault && (
                <View style={styles.selectedIndicator}>
                  <Ionicons name="checkmark-circle" size={24} color={CORES.success} />
                  <Text style={styles.selectedText}>Selecionado</Text>
                </View>
              )}
            </View>

            {!origemCheckout && (
              <View style={styles.addressActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    navigation.navigate('FormularioEndereco', { endereco: address });
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="create-outline" size={18} color={CORES.textSecondary} />
                  <Text style={styles.actionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtnDanger}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDelete(address.id);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={18} color={CORES.danger} />
                  <Text style={styles.actionTextDanger}>Excluir</Text>
                </TouchableOpacity>
                {!address.isDefault && (
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      setDefaultAddress(address.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="star-outline" size={18} color={CORES.warning} />
                    <Text style={styles.actionText}>Definir principal</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}

        <Botao
          title="Adicionar novo endereço"
          iconName="add-outline"
          variant="outline"
          onPress={() => navigation.navigate('FormularioEndereco')}
          style={styles.addNewBtn}
        />
      </ScrollView>
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
    gap: ESPACAMENTO.md,
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
  addBtn: {
    marginTop: ESPACAMENTO.lg,
    width: 250,
  },
  addressCard: {
    backgroundColor: CORES.surface,
    borderRadius: RAIO.lg,
    padding: ESPACAMENTO.md,
    borderWidth: 1,
    borderColor: CORES.divider,
    gap: ESPACAMENTO.md,
  },
  addressMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: ESPACAMENTO.md,
  },
  addressIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: CORES.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
    fontSize: 15,
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
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.xs,
    paddingHorizontal: ESPACAMENTO.sm,
    paddingVertical: ESPACAMENTO.xs,
    backgroundColor: '#ECFDF5',
    borderRadius: RAIO.full,
    alignSelf: 'flex-start',
    marginTop: ESPACAMENTO.xs,
  },
  selectedText: {
    fontSize: 11,
    fontWeight: '600',
    color: CORES.success,
  },
  addressActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACAMENTO.sm,
    paddingTop: ESPACAMENTO.xs,
    borderTopWidth: 1,
    borderTopColor: CORES.divider,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.xs,
    paddingHorizontal: ESPACAMENTO.sm,
    paddingVertical: ESPACAMENTO.xs,
    borderRadius: RAIO.sm,
    backgroundColor: CORES.divider,
  },
  actionBtnDanger: {
    backgroundColor: '#FEF2F2',
  },
  actionText: {
    fontSize: 11,
    fontWeight: '600',
    color: CORES.textSecondary,
  },
  actionTextDanger: {
    color: CORES.danger,
  },
  addNewBtn: {
    marginTop: ESPACAMENTO.md,
  },
});