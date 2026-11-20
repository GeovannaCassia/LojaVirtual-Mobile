import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLoja } from '../contextos/ContextoLoja';
import { useCarrinho } from '../contextos/ContextoCarrinho';
import { useAutenticacao } from '../contextos/ContextoAutenticacao';
import { Cabecalho } from '../componentes/Cabecalho';
import { SeletorQuantidade } from '../componentes/SeletorQuantidade';
import { Botao } from '../componentes/Botao';
import { Selo, Avaliacao } from '../componentes/Selo';
import { formatarMoeda, calcularDesconto, obterStatusEstoque } from '../utilitarios/formatadores';
import { exibirAlerta } from '../utilitarios/alertas';
import { CORES, ESPACAMENTO, RAIO, TIPOGRAFIA } from '../constantes/tema';
import { ParametrosPilhaRaiz, Produto, VarianteProduto } from '../tipos';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const TelaDetalhesProduto: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParametrosPilhaRaiz>>();
  const route = useRoute<RouteProp<ParametrosPilhaRaiz, 'DetalhesProduto'>>();
  const { produtoId } = route.params;

  const { getProductById } = useLoja();
  const { addItem, isInCart, getItemQuantity } = useCarrinho();
  const { isAuthenticated, user, toggleFavorite, isFavorite } = useAutenticacao();

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const product = useMemo(() => getProductById(produtoId), [getProductById, produtoId]);
  const selectedVariant = useMemo(() => {
    if (!product || !selectedColor || !selectedSize) return null;
    return product.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  }, [product, selectedColor, selectedSize]);

  const stock = selectedVariant?.stock || 0;
  const stockStatus = obterStatusEstoque(stock);
  const discount = calcularDesconto(product?.originalPrice || 0, product?.price || 0);
  const isFav = isFavorite(produtoId);
  const inCartQty = selectedVariant ? getItemQuantity(produtoId, selectedVariant.id) : 0;

  // Initialize first available variant
  React.useEffect(() => {
    if (product && product.variants.length > 0) {
      const firstVariant = product.variants.find(v => v.stock > 0) || product.variants[0];
      if (!selectedColor) setSelectedColor(firstVariant.color);
      if (!selectedSize) setSelectedSize(firstVariant.size);
    }
  }, [product, selectedColor, selectedSize]);

  const handleAddToCart = useCallback(async () => {
    if (!product || !selectedVariant) return;

    if (stock <= 0) {
      exibirAlerta('Esgotado', 'Este produto está esgotado no momento.');
      return;
    }

    const result = await addItem(product, selectedVariant, quantity);
    if (!result.success) {
      exibirAlerta('Atenção', result.message || 'Não foi possível adicionar ao carrinho.');
    }
  }, [product, selectedVariant, quantity, stock, addItem]);

  const handleBuyNow = useCallback(async () => {
    if (!product || !selectedVariant) return;

    const result = await addItem(product, selectedVariant, quantity);
    if (result.success) {
      navigation.navigate('AbasPrincipais', { screen: 'Carrinho' });
    } else {
      exibirAlerta('Atenção', result.message || 'Não foi possível adicionar ao carrinho.');
    }
  }, [product, selectedVariant, quantity, addItem, navigation]);

  if (!product) {
    return (
      <View style={styles.container}>
        <Cabecalho title="Produto" showBack />
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={48} color={CORES.danger} />
          <Text style={styles.notFoundTitle}>Produto não encontrado</Text>
          <Botao title="Voltar" onPress={() => navigation.goBack()} style={{ marginTop: ESPACAMENTO.md }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Image Gallery */}
      <View style={styles.imageGallery}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentImageIndex(index);
          }}
          contentContainerStyle={styles.imageScrollContent}
        >
          {product.images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Image Indicators */}
        {product.images.length > 1 && (
          <View style={styles.imageIndicators}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicatorDot,
                  index === currentImageIndex && styles.indicatorDotActive,
                ]}
              />
            ))}
          </View>
        )}

        {/* Favorite Botao */}
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => {
            if (!isAuthenticated) {
              navigation.navigate('Login');
              return;
            }
            void toggleFavorite(produtoId);
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={24}
            color={isFav ? CORES.danger : '#FFFFFF'}
          />
        </TouchableOpacity>

        {/* Discount Selo */}
        {discount > 0 && (
          <View style={styles.discountBadgeTop}>
            <Text style={styles.discountBadgeText}>-{discount}%</Text>
          </View>
        )}

        {/* Back Botao */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + ESPACAMENTO.xl * 3 },
        ]}
        showsVerticalScrollIndicator={false}
      >
            {/* Informações do produto */}
        <View style={styles.infoSection}>
          <View style={styles.categoryRow}>
            <Selo variant="primary" size="sm">{product.category}</Selo>
            <Avaliacao value={product.rating} size={14} showValue />
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>{formatarMoeda(product.price)}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>{formatarMoeda(product.originalPrice)}</Text>
            )}
          </View>

          {discount > 0 && (
            <Selo variant="success" size="sm" style={{ marginTop: ESPACAMENTO.xs }}>
              Economize {formatarMoeda(product.originalPrice! - product.price)}
            </Selo>
          )}
        </View>

        {/* Color Selection */}
        <View style={styles.selectionSection}>
          <Text style={styles.selectionLabel}>Cor</Text>
          <View style={styles.colorOptions}>
            {product.variants
              .filter((v, i, arr) => arr.findIndex(v2 => v2.color === v.color) === i)
              .map((variant) => (
                <TouchableOpacity
                  key={variant.color}
                  style={[
                    styles.colorOption,
                    selectedColor === variant.color && styles.colorOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedColor(variant.color);
                    // Reset size if not available in new color
                    const availableSizes = product.variants
                      .filter(v => v.color === variant.color && v.stock > 0)
                      .map(v => v.size);
                    if (!availableSizes.includes(selectedSize)) {
                      setSelectedSize(availableSizes[0] || '');
                    }
                  }}
                  activeOpacity={0.8}
                  disabled={variant.stock === 0}
                >
                  <View
                    style={[
                      styles.colorCircle,
                      { backgroundColor: variant.colorHex },
                      variant.stock === 0 && styles.colorCircleDisabled,
                    ]}
                  />
                  <Text style={[
                    styles.colorName,
                    variant.stock === 0 && styles.colorNameDisabled,
                  ]}>
                    {variant.color}
                    {variant.stock === 0 && ' (Esgotado)'}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>

        {/* Size Selection */}
        <View style={styles.selectionSection}>
          <Text style={styles.selectionLabel}>
            Tamanho
            {selectedSize && <Text style={styles.selectedSizeHint}> ({selectedSize})</Text>}
          </Text>
          <View style={styles.sizeOptions}>
            {product.variants
              .filter(v => v.color === selectedColor)
              .map((variant) => (
                <TouchableOpacity
                  key={variant.size}
                  style={[
                    styles.sizeOption,
                    selectedSize === variant.size && styles.sizeOptionSelected,
                    variant.stock === 0 && styles.sizeOptionDisabled,
                  ]}
                  onPress={() => variant.stock > 0 && setSelectedSize(variant.size)}
                  activeOpacity={0.8}
                  disabled={variant.stock === 0}
                >
                  <Text style={[
                    styles.sizeOptionText,
                    selectedSize === variant.size && styles.sizeOptionTextSelected,
                    variant.stock === 0 && styles.sizeOptionTextDisabled,
                  ]}>
                    {variant.size}
                  </Text>
                  {variant.stock === 0 && (
                    <Text style={styles.sizeOutOfStock}>Esgotado</Text>
                  )}
                </TouchableOpacity>
              ))}
          </View>
        </View>

        {/* Quantity Selector */}
        <View style={styles.selectionSection}>
          <SeletorQuantidade
            value={quantity}
            min={1}
            max={stock}
            onChange={setQuantity}
            size="lg"
            showLabel
            label="Quantidade"
          />
        </View>

        {/* Stock Status */}
        <View style={[styles.stockBadge, { backgroundColor: `${stockStatus.color}15`, borderColor: stockStatus.color }]}>
          <Ionicons name={stock <= 0 ? 'close-circle' : stock <= 5 ? 'alert' : 'checkmark-circle'} size={16} color={stockStatus.color} style={styles.stockIcon} />
          <Text style={{ color: stockStatus.color, fontWeight: '600', fontSize: 13 }}>{stockStatus.label}</Text>
        </View>

        {/* Size Guide */}
        <TouchableOpacity
          style={styles.sizeGuideBtn}
          onPress={() => setShowSizeGuide(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="help-circle-outline" size={18} color={CORES.primary} style={styles.sizeGuideIcon} />
          <Text style={styles.sizeGuideText}>Guia de tamanhos</Text>
        </TouchableOpacity>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>

        {/* Tags */}
        {product.tags.length > 0 && (
          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {product.tags.map((tag) => (
                <Selo key={tag} variant="outline" size="sm">{tag}</Selo>
              ))}
            </View>
          </View>
        )}

        {/* Reviews Summary */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Avaliações</Text>
            <TouchableOpacity style={styles.seeAllReviews}>
              <Text style={styles.seeAllReviewsText}>Ver todas ({product.reviewCount})</Text>
              <Ionicons name="chevron-forward" size={16} color={CORES.textSecondary} />
            </TouchableOpacity>
          </View>
          <View style={styles.ratingSummary}>
            <Text style={styles.ratingBig}>{product.rating.toFixed(1)}</Text>
            <Avaliacao value={product.rating} size={24} />
            <Text style={styles.ratingCount}>{product.reviewCount} avaliações</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Botao
            title={inCartQty > 0 ? 'Atualizar no Carrinho' : 'Adicionar ao Carrinho'}
            iconName="cart-outline"
            onPress={handleAddToCart}
            disabled={stock <= 0}
            size="lg"
            style={styles.addToCartBtn}
          />
          <Botao
            title="Comprar Agora"
            iconName="flash-outline"
            variant="secondary"
            onPress={handleBuyNow}
            disabled={stock <= 0}
            size="lg"
            style={styles.buyNowBtn}
          />
        </View>
      </ScrollView>

      {/* Size Guide Modal */}
      <ModalBase
        visible={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        title="Guia de Tamanhos"
        size="md"
      >
        <Text style={styles.sizeGuideNote}>Medidas aproximadas em centímetros</Text>
        <View style={styles.sizeTable}>
          {['P', 'M', 'G', 'GG'].map((size) => (
            <View key={size} style={styles.sizeTableRow}>
              <Text style={styles.sizeTableCell}>{size}</Text>
              <Text style={styles.sizeTableCell}>Tórax: {size === 'P' ? '90-94' : size === 'M' ? '96-100' : size === 'G' ? '102-106' : '108-112'}cm</Text>
              <Text style={styles.sizeTableCell}>Cintura: {size === 'P' ? '78-82' : size === 'M' ? '84-88' : size === 'G' ? '90-94' : '96-100'}cm</Text>
              <Text style={styles.sizeTableCell}>Quadril: {size === 'P' ? '94-98' : size === 'M' ? '100-104' : size === 'G' ? '106-110' : '112-116'}cm</Text>
            </View>
          ))}
        </View>
      </ModalBase>
    </View>
  );
};

import { ModalBase } from '../componentes/JanelaModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.background,
  },
  imageGallery: {
    height: SCREEN_WIDTH * 0.9,
    position: 'relative',
    backgroundColor: CORES.divider,
  },
  imageScrollContent: {
    flexDirection: 'row',
  },
  productImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.9,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: ESPACAMENTO.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  indicatorDotActive: {
    backgroundColor: '#FFFFFF',
    width: 20,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 48,
    right: ESPACAMENTO.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountBadgeTop: {
    position: 'absolute',
    top: 48,
    left: ESPACAMENTO.md + 48,
    backgroundColor: CORES.danger,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RAIO.full,
  },
  discountBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  backBtn: {
    position: 'absolute',
    top: 48,
    left: ESPACAMENTO.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    paddingHorizontal: ESPACAMENTO.md,
    paddingTop: ESPACAMENTO.md,
  },
  infoSection: {
    marginBottom: ESPACAMENTO.lg,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.sm,
    marginBottom: ESPACAMENTO.xs,
  },
  productName: {
    fontSize: 24,
    fontWeight: '800',
    color: CORES.textPrimary,
    lineHeight: 32,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.sm,
    marginTop: ESPACAMENTO.sm,
    flexWrap: 'wrap',
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: CORES.textPrimary,
  },
  originalPrice: {
    fontSize: 18,
    fontWeight: '400',
    color: CORES.textMuted,
    textDecorationLine: 'line-through',
  },
  selectionSection: {
    marginBottom: ESPACAMENTO.lg,
    paddingHorizontal: ESPACAMENTO.md,
  },
  selectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: CORES.textPrimary,
    marginBottom: ESPACAMENTO.sm,
  },
  selectedSizeHint: {
    fontWeight: '400',
    color: CORES.primary,
    fontSize: 13,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACAMENTO.sm,
  },
  colorOption: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: ESPACAMENTO.xs,
    borderRadius: RAIO.md,
    borderWidth: 2,
    borderColor: CORES.divider,
    minWidth: 60,
  },
  colorOptionSelected: {
    borderColor: CORES.primary,
    backgroundColor: CORES.primaryLight,
  },
  colorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: CORES.divider,
  },
  colorCircleDisabled: {
    opacity: 0.4,
    borderColor: CORES.divider,
  },
  colorName: {
    fontSize: 11,
    fontWeight: '500',
    color: CORES.textPrimary,
    marginTop: 4,
    textAlign: 'center',
  },
  colorNameDisabled: {
    color: CORES.textMuted,
  },
  sizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACAMENTO.sm,
  },
  sizeOption: {
    minWidth: 52,
    height: 48,
    borderRadius: RAIO.md,
    borderWidth: 2,
    borderColor: CORES.divider,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ESPACAMENTO.sm,
    backgroundColor: CORES.surface,
  },
  sizeOptionSelected: {
    borderColor: CORES.primary,
    backgroundColor: CORES.primaryLight,
  },
  sizeOptionDisabled: {
    opacity: 0.4,
    borderColor: CORES.divider,
    backgroundColor: CORES.divider,
  },
  sizeOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.textPrimary,
  },
  sizeOptionTextSelected: {
    color: CORES.primary,
  },
  sizeOptionTextDisabled: {
    color: CORES.textMuted,
  },
  sizeOutOfStock: {
    fontSize: 9,
    color: CORES.danger,
    marginTop: 2,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.xs,
    paddingHorizontal: ESPACAMENTO.md,
    paddingVertical: ESPACAMENTO.sm,
    borderRadius: RAIO.md,
    marginHorizontal: ESPACAMENTO.md,
    borderWidth: 1,
  },
  stockIcon: {
    marginRight: 2,
  },
  sizeGuideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESPACAMENTO.xs,
    paddingVertical: ESPACAMENTO.sm,
    marginHorizontal: ESPACAMENTO.md,
  },
  sizeGuideIcon: {
    marginRight: 4,
  },
  sizeGuideText: {
    fontSize: 14,
    fontWeight: '600',
    color: CORES.primary,
  },
  descriptionSection: {
    marginTop: ESPACAMENTO.lg,
    paddingHorizontal: ESPACAMENTO.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: CORES.textPrimary,
    marginBottom: ESPACAMENTO.sm,
  },
  descriptionText: {
    fontSize: 14,
    color: CORES.textSecondary,
    lineHeight: 22,
  },
  tagsSection: {
    marginTop: ESPACAMENTO.lg,
    paddingHorizontal: ESPACAMENTO.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ESPACAMENTO.sm,
    marginTop: ESPACAMENTO.sm,
  },
  reviewsSection: {
    marginTop: ESPACAMENTO.lg,
    paddingHorizontal: ESPACAMENTO.md,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ESPACAMENTO.md,
  },
  seeAllReviews: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllReviewsText: {
    fontSize: 13,
    fontWeight: '600',
    color: CORES.primary,
  },
  ratingSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACAMENTO.md,
  },
  ratingBig: {
    fontSize: 36,
    fontWeight: '800',
    color: CORES.textPrimary,
  },
  ratingCount: {
    fontSize: 13,
    color: CORES.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: ESPACAMENTO.md,
    padding: ESPACAMENTO.md,
    paddingBottom: ESPACAMENTO.xl * 2,
  },
  addToCartBtn: {
    flex: 1,
  },
  buyNowBtn: {
    flex: 1,
  },
  sizeGuideNote: {
    fontSize: 13,
    color: CORES.textSecondary,
    marginBottom: ESPACAMENTO.md,
    textAlign: 'center',
  },
  sizeTable: {
    borderWidth: 1,
    borderColor: CORES.divider,
    borderRadius: RAIO.md,
    overflow: 'hidden',
  },
  sizeTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: CORES.divider,
  },
  sizeTableCell: {
    flex: 1,
    padding: ESPACAMENTO.md,
    fontSize: 13,
    color: CORES.textPrimary,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: CORES.divider,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: ESPACAMENTO.xl,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: CORES.textPrimary,
    marginTop: ESPACAMENTO.md,
  },
});