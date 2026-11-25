import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Produto } from '../tipos';
import { CartaoImagem } from './Cartao';
import { formatarMoeda, calcularDesconto, obterStatusEstoque } from '../utilitarios/formatadores';
import { CORES, ESPACAMENTO, RAIO } from '../constantes/tema';

interface ProductCardProps {
  product: Produto;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  variant?: 'grid' | 'list';
}

export const CartaoProduto: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onFavoritePress,
  isFavorite = false,
  variant = 'grid',
}) => {
  const discount = calcularDesconto(product.originalPrice || 0, product.price);
  const hasDiscount = discount > 0;
  const primaryImage = product.images[0];
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const stockStatus = obterStatusEstoque(totalStock);
  const showStockBadge = stockStatus.label !== 'Em estoque';

  if (variant === 'list') {
    return (
      <TouchableOpacity
        style={styles.listCard}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <CartaoImagem
          source={{ uri: primaryImage }}
          aspectRatio={1.3}
          borderRadius={RAIO.md}
          style={styles.listImage}
        />
        <View style={styles.listContent}>
          <View style={styles.listHeader}>
            <Text style={styles.listName} numberOfLines={1}>{product.name}</Text>
            {hasDiscount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discount}%</Text>
              </View>
            )}
          </View>
          <Text style={styles.listCategory}>{product.category}</Text>
          <View style={styles.listRating}>
            <Ionicons name="star" size={14} color={CORES.star} />
            <Text style={styles.listRatingText}>
              {product.rating.toFixed(1)} ({product.reviewCount})
            </Text>
          </View>
          <View style={styles.listPriceRow}>
            <Text style={styles.listPrice}>{formatarMoeda(product.price)}</Text>
            {hasDiscount && (
              <Text style={styles.listOriginalPrice}>
                {formatarMoeda(product.originalPrice!)}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.gridCard} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageWrapper}>
        <CartaoImagem
          source={{ uri: primaryImage }}
          aspectRatio={0.78}
          borderRadius={RAIO.md}
        />
        {hasDiscount && (
          <View style={styles.discountBadgeGrid}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}
        {showStockBadge && (
          <View style={[styles.stockBadge, { backgroundColor: stockStatus.color }]}>
            <Text style={styles.stockText}>{stockStatus.label}</Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.favoriteBtn, isFavorite && styles.favoriteBtnActive]}
          onPress={onFavoritePress}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? CORES.danger : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.gridContent}>
        <Text style={styles.gridCategory}>{product.category}</Text>
        <Text style={styles.gridName} numberOfLines={2}>{product.name}</Text>
        
        <View style={styles.gridRating}>
          <Ionicons name="star" size={13} color={CORES.star} />
          <Text style={styles.gridRatingText}>
            {product.rating.toFixed(1)}
            <Text style={styles.reviewCount}> ({product.reviewCount})</Text>
          </Text>
        </View>

        <View style={styles.gridPriceRow}>
          <Text style={styles.gridPrice}>{formatarMoeda(product.price)}</Text>
          {hasDiscount && (
            <Text style={styles.gridOriginalPrice}>
              {formatarMoeda(product.originalPrice!)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Versão em grade
  gridCard: {
    backgroundColor: CORES.surface,
    borderRadius: RAIO.lg,
    overflow: 'hidden',
    shadowColor: CORES.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    width: '100%',
  },
  imageWrapper: {
    position: 'relative',
    backgroundColor: CORES.divider,
  },
  discountBadgeGrid: {
    position: 'absolute',
    top: ESPACAMENTO.sm,
    left: ESPACAMENTO.sm,
    backgroundColor: CORES.danger,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RAIO.xs,
  },
  stockBadge: {
    position: 'absolute',
    top: ESPACAMENTO.sm,
    right: ESPACAMENTO.sm,
    backgroundColor: CORES.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RAIO.xs,
  },
  stockText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  favoriteBtn: {
    position: 'absolute',
    bottom: ESPACAMENTO.sm,
    right: ESPACAMENTO.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteBtnActive: {
    backgroundColor: 'rgba(239,68,68,0.9)',
  },
  gridContent: {
    padding: ESPACAMENTO.md,
    gap: 4,
  },
  gridCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: CORES.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gridName: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.textPrimary,
    lineHeight: 20,
  },
  gridRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  gridRatingText: {
    fontSize: 12,
    color: CORES.textSecondary,
    marginLeft: 2,
  },
  reviewCount: {
    fontWeight: '400',
    color: CORES.textMuted,
  },
  gridPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.xs,
    marginTop: 4,
  },
  gridPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: CORES.textPrimary,
  },
  gridOriginalPrice: {
    fontSize: 13,
    fontWeight: '400',
    color: CORES.textMuted,
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  discountBadge: {
    backgroundColor: CORES.danger,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: RAIO.xs,
    marginLeft: ESPACAMENTO.xs,
  },

  // Versão em lista
  listCard: {
    flexDirection: 'row',
    backgroundColor: CORES.surface,
    borderRadius: RAIO.lg,
    marginBottom: ESPACAMENTO.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CORES.divider,
  },
  listImage: {
    width: 100,
    minWidth: 100,
  },
  listContent: {
    flex: 1,
    padding: ESPACAMENTO.md,
    justifyContent: 'space-between',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  listName: {
    fontSize: 16,
    fontWeight: '600',
    color: CORES.textPrimary,
    flex: 1,
    marginRight: ESPACAMENTO.sm,
  },
  listCategory: {
    fontSize: 12,
    color: CORES.textSecondary,
    marginBottom: 6,
  },
  listRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listRatingText: {
    fontSize: 12,
    color: CORES.textSecondary,
    marginLeft: 2,
  },
  listPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.xs,
  },
  listPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: CORES.textPrimary,
  },
  listOriginalPrice: {
    fontSize: 14,
    fontWeight: '400',
    color: CORES.textMuted,
    textDecorationLine: 'line-through',
  },
});