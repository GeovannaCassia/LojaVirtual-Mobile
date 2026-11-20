import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAutenticacao } from '../contextos/ContextoAutenticacao';
import { useCarrinho } from '../contextos/ContextoCarrinho';
import { Cabecalho } from '../componentes/Cabecalho';
import { Botao } from '../componentes/Botao';
import { Cartao } from '../componentes/Cartao';
import { formatarMoeda } from '../utilitarios/formatadores';
import { exibirAlerta, confirmarAcao } from '../utilitarios/alertas';
import { CORES, ESPACAMENTO, RAIO, TIPOGRAFIA } from '../constantes/tema';
import { ParametrosPilhaRaiz } from '../tipos';

export const TelaPerfil: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParametrosPilhaRaiz>>();
  const { user, isAuthenticated, logout, isLoading } = useAutenticacao();
  const { itemCount } = useCarrinho();

  const handleLogout = useCallback(() => {
    confirmarAcao(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      () => { void logout(); },
      'Sair'
    );
  }, [logout]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Cabecalho showCart cartCount={itemCount} />
        <View style={styles.loadingContainer}>
          <Esqueleto width={100} height={100} borderRadius={50} style={styles.skeletonAvatar} />
          <Esqueleto width="60%" height={20} style={{ marginTop: ESPACAMENTO.md, alignSelf: 'center' }} />
          <Esqueleto width="40%" height={14} style={{ marginTop: ESPACAMENTO.xs, alignSelf: 'center' }} />
        </View>
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <Cabecalho showCart cartCount={itemCount} />
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + ESPACAMENTO.xl * 2 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.guestCard}>
            <View style={styles.guestAvatar}>
              <Ionicons name="person-circle" size={64} color={CORES.primary} />
            </View>
            <Text style={styles.guestTitle}>Olá, visitante!</Text>
            <Text style={styles.guestText}>
              Faça login ou crie uma conta para acessar seus pedidos, endereços e lista de desejos.
            </Text>
            <View style={styles.guestButtons}>
              <Botao
                title="Entrar"
                variant="primary"
                onPress={() => navigation.navigate('Login')}
                style={styles.guestBtn}
              />
              <Botao
                title="Cadastrar"
                variant="secondary"
                onPress={() => navigation.navigate('Cadastro')}
                style={styles.guestBtn}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  const defaultAddress = user.addresses.find((a) => a.isDefault) || user.addresses[0];

  return (
    <View style={styles.container}>
      <Cabecalho showCart cartCount={itemCount} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + ESPACAMENTO.xl * 2 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Usuario Cabecalho */}
        <Cartao style={styles.userCard}>
          <View style={styles.userHeader}>
            <View style={styles.avatarWrapper}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarInitial}>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
            <TouchableOpacity
              style={styles.editProfileBtn}
              onPress={() => exibirAlerta('Perfil', `Nome: ${user.name}\nE-mail: ${user.email}`)}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={20} color={CORES.primary} />
            </TouchableOpacity>
          </View>
        </Cartao>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('HistoricoPedidos')}
            activeOpacity={0.7}
          >
            <View style={styles.statIconWrapper}>
              <Ionicons name="bag-handle-outline" size={24} color={CORES.primary} />
            </View>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Pedidos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('AbasPrincipais', { screen: 'Favoritos' })}
            activeOpacity={0.7}
          >
            <View style={styles.statIconWrapper}>
              <Ionicons name="heart-outline" size={24} color={CORES.danger} />
            </View>
            <Text style={styles.statValue}>{user.favorites.length}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => navigation.navigate('ListaEnderecos')}
            activeOpacity={0.7}
          >
            <View style={styles.statIconWrapper}>
              <Ionicons name="location-outline" size={24} color={CORES.success} />
            </View>
            <Text style={styles.statValue}>{user.addresses.length}</Text>
            <Text style={styles.statLabel}>Endereços</Text>
          </TouchableOpacity>
        </View>

        {/* Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meus Dados</Text>
          <Cartao style={styles.menuCard}>
            <MenuItem
              icon="person-outline"
              title="Informações pessoais"
              subtitle={`${user.name} • ${user.email}`}
              onPress={() => exibirAlerta('Meus Dados', `Nome: ${user.name}\nE-mail: ${user.email}\nCadastro ativo desde 2026`)}
            />
            <MenuItem
              icon="lock-closed-outline"
              title="Segurança e Senha"
              subtitle="Criptografia com hash & salt ativa"
              onPress={() => exibirAlerta('Segurança', 'Sua senha está protegida com criptografia segura.')}
            />
          </Cartao>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Endereços</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('ListaEnderecos')}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllText}>Gerenciar</Text>
              <Ionicons name="chevron-forward" size={16} color={CORES.textSecondary} />
            </TouchableOpacity>
          </View>
          <Cartao style={styles.menuCard}>
            {defaultAddress ? (
              <>
                <MenuItem
                  icon="location-outline"
                  title={defaultAddress.label}
                  subtitle={`${defaultAddress.street}, ${defaultAddress.number} - ${defaultAddress.neighborhood}, ${defaultAddress.city}/${defaultAddress.state}`}
                  onPress={() => navigation.navigate('ListaEnderecos')}
                />
                {user.addresses.length > 1 && (
                  <MenuItem
                    icon="add-circle-outline"
                    title="Adicionar novo endereço"
                    subtitle={`${user.addresses.length - 1} endereço(s) adicional(is)`}
                    onPress={() => navigation.navigate('FormularioEndereco', {})}
                  />
                )}
              </>
            ) : (
              <MenuItem
                icon="add-circle-outline"
                title="Adicionar endereço"
                subtitle="Cadastre seu endereço para entregas mais rápidas"
                onPress={() => navigation.navigate('FormularioEndereco', {})}
              />
            )}
          </Cartao>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pedidos</Text>
          <Cartao style={styles.menuCard}>
            <MenuItem
              icon="bag-handle-outline"
              title="Histórico de pedidos"
              subtitle="Acompanhe seus pedidos e status de entrega"
              onPress={() => navigation.navigate('HistoricoPedidos')}
            />
            <MenuItem
              icon="download-outline"
              title="Notas fiscais"
              subtitle="Baixe as notas fiscais dos seus pedidos"
              onPress={() => exibirAlerta('Em breve', 'Funcionalidade em desenvolvimento')}
            />
          </Cartao>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          <Cartao style={styles.menuCard}>
            <MenuItem
              icon="help-circle-outline"
              title="Central de ajuda"
              subtitle="Perguntas frequentes e suporte"
              onPress={() => exibirAlerta('Em breve', 'Funcionalidade em desenvolvimento')}
            />
            <MenuItem
              icon="chatbubble-outline"
              title="Fale conosco"
              subtitle="Chat, e-mail ou telefone"
              onPress={() => exibirAlerta('Em breve', 'Funcionalidade em desenvolvimento')}
            />
            <MenuItem
              icon="document-text-outline"
              title="Política de privacidade"
              subtitle="Como usamos seus dados (LGPD)"
              onPress={() => exibirAlerta('Em breve', 'Funcionalidade em desenvolvimento')}
            />
          </Cartao>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          <Cartao style={styles.menuCard}>
            <MenuItem
              icon="notifications-outline"
              title="Notificações"
              subtitle="Gerencie alertas de promoções e pedidos"
              onPress={() => exibirAlerta('Em breve', 'Funcionalidade em desenvolvimento')}
            />
            <MenuItem
              icon="moon-outline"
              title="Tema do aplicativo"
              subtitle="Claro, escuro ou automático"
              onPress={() => exibirAlerta('Em breve', 'Funcionalidade em desenvolvimento')}
            />
            <MenuItem
              icon="language-outline"
              title="Idioma"
              subtitle="Português (Brasil)"
              onPress={() => exibirAlerta('Em breve', 'Funcionalidade em desenvolvimento')}
            />
          </Cartao>
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color={CORES.danger} style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Versão 1.0.0</Text>
          <Text style={styles.appCopyright}>© 2026 Todos os direitos reservados.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

// MenuItem Component
const MenuItem: React.FC<{
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
}> = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name={icon as any} size={22} color={CORES.textSecondary} style={styles.menuIcon} />
    <View style={styles.menuText}>
      <Text style={styles.menuTitle}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={20} color={CORES.textMuted} />
  </TouchableOpacity>
);

// Esqueleto import
import { Esqueleto } from '../componentes/Esqueleto';

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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeletonAvatar: {
    marginBottom: ESPACAMENTO.md,
  },
  userCard: {
    padding: ESPACAMENTO.md,
    marginBottom: ESPACAMENTO.sm,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: CORES.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: CORES.primary,
  },
  userInfo: {
    flex: 1,
    marginLeft: ESPACAMENTO.md,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: CORES.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: CORES.textSecondary,
    marginTop: 2,
  },
  editProfileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CORES.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: ESPACAMENTO.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: CORES.surface,
    borderRadius: RAIO.lg,
    paddingVertical: ESPACAMENTO.md,
    paddingHorizontal: ESPACAMENTO.sm,
    borderWidth: 1,
    borderColor: CORES.divider,
  },
  statIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: CORES.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ESPACAMENTO.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: CORES.textPrimary,
  },
  statLabel: {
    fontSize: 11,
    color: CORES.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: {
    gap: ESPACAMENTO.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ESPACAMENTO.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: CORES.textPrimary,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: CORES.primary,
  },
  menuCard: {
    borderWidth: 1,
    borderColor: CORES.divider,
    borderRadius: RAIO.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ESPACAMENTO.md,
    borderBottomWidth: 1,
    borderBottomColor: CORES.divider,
    gap: ESPACAMENTO.md,
  },
  menuIcon: {
    width: 28,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: CORES.textPrimary,
  },
  menuSubtitle: {
    fontSize: 12,
    color: CORES.textSecondary,
    marginTop: 2,
  },
  guestCard: {
    alignItems: 'center',
    padding: ESPACAMENTO.xl,
    marginTop: ESPACAMENTO.xl,
  },
  guestAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CORES.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ESPACAMENTO.md,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: CORES.textPrimary,
  },
  guestText: {
    fontSize: 14,
    color: CORES.textSecondary,
    textAlign: 'center',
    marginTop: ESPACAMENTO.xs,
    marginBottom: ESPACAMENTO.lg,
    lineHeight: 22,
  },
  guestButtons: {
    flexDirection: 'row',
    gap: ESPACAMENTO.md,
    width: '100%',
  },
  guestBtn: {
    flex: 1,
  },
  logoutSection: {
    paddingTop: ESPACAMENTO.md,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESPACAMENTO.md,
    paddingVertical: ESPACAMENTO.md,
    paddingHorizontal: ESPACAMENTO.lg,
    borderRadius: RAIO.lg,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutIcon: {},
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: CORES.danger,
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: ESPACAMENTO.lg,
    paddingBottom: ESPACAMENTO.xl,
    borderTopWidth: 1,
    borderTopColor: CORES.divider,
  },
  appVersion: {
    fontSize: 12,
    color: CORES.textMuted,
    fontWeight: '600',
  },
  appCopyright: {
    fontSize: 11,
    color: CORES.textMuted,
    marginTop: 2,
  },
});