import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParametrosPilhaRaiz } from '../tipos';
import { CORES, ESPACAMENTO } from '../constantes/tema';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showCart?: boolean;
  cartCount?: number;
  onCartPress?: () => void;
  leftAction?: () => void;
  rightAction?: () => void;
  rightIcon?: string;
  backgroundColor?: string;
}

export const Cabecalho: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showCart = true,
  cartCount = 0,
  onCartPress,
  leftAction,
  rightAction,
  rightIcon,
  backgroundColor = CORES.surface,
}) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParametrosPilhaRaiz>>();
  const abrirCarrinho = () => {
    navigation.navigate('AbasPrincipais', { screen: 'Carrinho' });
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {showBack ? (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={leftAction || (() => navigation.goBack())}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={CORES.textPrimary} />
        </TouchableOpacity>
      ) : title ? (
        <View style={styles.spacer} />
      ) : (
        <View style={styles.spacer} />
      )}

      {title && <Text style={styles.title}>{title}</Text>}

      <View style={styles.rightActions}>
        {rightIcon && rightAction && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={rightAction}
            activeOpacity={0.7}
          >
            <Ionicons name={rightIcon as any} size={24} color={CORES.textPrimary} />
          </TouchableOpacity>
        )}
        {showCart && (
          <TouchableOpacity
            style={[styles.cartBtn, cartCount > 0 && styles.cartBtnHasItems]}
            onPress={onCartPress || abrirCarrinho}
            activeOpacity={0.8}
          >
            <Ionicons name="cart-outline" size={24} color={CORES.textPrimary} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: ESPACAMENTO.md,
    borderBottomWidth: 1,
    borderBottomColor: CORES.divider,
  },
  spacer: {
    width: 44,
  },
  actionBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: CORES.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.xs,
  },
  cartBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBtnHasItems: {
    backgroundColor: CORES.primaryLight,
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: CORES.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: CORES.surface,
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default Cabecalho;