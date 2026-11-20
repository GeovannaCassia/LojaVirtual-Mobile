import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ParametrosPilhaRaiz, ParametrosAbas } from '../tipos';
import { useCarrinho } from '../contextos/ContextoCarrinho';

// Screens
import { TelaInicial } from '../telas/TelaInicial';
import { TelaCatalogo } from '../telas/TelaCatalogo';
import { TelaFavoritos } from '../telas/TelaFavoritos';
import { TelaCarrinho } from '../telas/TelaCarrinho';
import { TelaPerfil } from '../telas/TelaPerfil';
import { TelaDetalhesProduto } from '../telas/TelaDetalhesProduto';
import { TelaLogin } from '../telas/TelaLogin';
import { TelaCadastro } from '../telas/TelaCadastro';
import { TelaRecuperarSenha } from '../telas/TelaRecuperarSenha';
import { TelaListaEnderecos } from '../telas/TelaListaEnderecos';
import { TelaFormularioEndereco } from '../telas/TelaFormularioEndereco';
import { TelaFinalizarCompra } from '../telas/TelaFinalizarCompra';
import { TelaPedidoConfirmado } from '../telas/TelaPedidoConfirmado';
import { TelaHistoricoPedidos } from '../telas/TelaHistoricoPedidos';
import { TelaProdutosCategoria } from '../telas/TelaProdutosCategoria';

const Tab = createBottomTabNavigator<ParametrosAbas>();
const Stack = createNativeStackNavigator<ParametrosPilhaRaiz>();

const CONFIGURACAO_ABAS: Record<
  keyof ParametrosAbas,
  { label: string; iconActive: keyof typeof Ionicons.glyphMap; iconInactive: keyof typeof Ionicons.glyphMap }
> = {
  Inicio: { label: 'Início', iconActive: 'home', iconInactive: 'home-outline' },
  Catalogo: { label: 'Explorar', iconActive: 'grid', iconInactive: 'grid-outline' },
  Favoritos: { label: 'Favoritos', iconActive: 'heart', iconInactive: 'heart-outline' },
  Carrinho: { label: 'Carrinho', iconActive: 'cart', iconInactive: 'cart-outline' },
  Perfil: { label: 'Perfil', iconActive: 'person', iconInactive: 'person-outline' },
};

const BarraAbasPersonalizada: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const { itemCount } = useCarrinho();

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 24 : 10),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const routeName = route.name as keyof ParametrosAbas;
        const config = CONFIGURACAO_ABAS[routeName];
        if (!config) return null;

        const color = isFocused ? '#2563EB' : '#94A3B8';
        const iconName = isFocused ? config.iconActive : config.iconInactive;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={config.label}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name={iconName} size={22} color={color} />
              {routeName === 'Carrinho' && itemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{itemCount > 99 ? '99+' : itemCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabLabel,
                { color, fontWeight: isFocused ? '700' : '500' },
              ]}
              numberOfLines={1}
            >
              {config.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const NavegadorAbas = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BarraAbasPersonalizada {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Inicio" component={TelaInicial} />
      <Tab.Screen name="Catalogo" component={TelaCatalogo} />
      <Tab.Screen name="Favoritos" component={TelaFavoritos} />
      <Tab.Screen name="Carrinho" component={TelaCarrinho} />
      <Tab.Screen name="Perfil" component={TelaPerfil} />
    </Tab.Navigator>
  );
};

export const NavegadorPrincipal = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
        contentStyle: { backgroundColor: '#F8FAFC' },
      }}
    >
      <Stack.Screen name="AbasPrincipais" component={NavegadorAbas} />
      <Stack.Screen
        name="DetalhesProduto"
        component={TelaDetalhesProduto}
        options={{ presentation: 'card', animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Login"
        component={TelaLogin}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="Cadastro"
        component={TelaCadastro}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="RecuperarSenha"
        component={TelaRecuperarSenha}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="ListaEnderecos"
        component={TelaListaEnderecos}
        options={{ presentation: 'card', animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="FormularioEndereco"
        component={TelaFormularioEndereco}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="FinalizarCompra"
        component={TelaFinalizarCompra}
        options={{ presentation: 'card', animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="PedidoConfirmado"
        component={TelaPedidoConfirmado}
        options={{ presentation: 'card', animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="HistoricoPedidos"
        component={TelaHistoricoPedidos}
        options={{ presentation: 'card', animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="ProdutosCategoria"
        component={TelaProdutosCategoria}
        options={{ presentation: 'card', animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    width: 28,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 3,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
